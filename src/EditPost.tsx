import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Component, NewComponent, Post} from "./api";
import Config from "./Config";
import {Alert, Button, Spinner} from "react-bootstrap";
import {PostForm} from "./PostForm";

async function updatePost(post: Post, components: (Component | NewComponent)[]): Promise<[Post, Component[]]> {
    try {
        const postResponse = await Config.postApi.updatePost(post.id as number, post);
        const componentsIndexResponse = await Config.componentApi.indexComponents(post.id as number);

        const updatedPost = postResponse.data;

        const initialComponentsIds = componentsIndexResponse.data.map(c => c.id);
        const currentComponentsIds = components.map(c => "id" in c ? c.id as number : undefined).filter(c => c !== undefined);
        const componentsIdsToDelete = initialComponentsIds.filter(id => !currentComponentsIds.includes(id));

        for (const componentIdToDelete of componentsIdsToDelete) {
            await Config.componentApi.deleteComponent(post.id as number, componentIdToDelete as number);
        }

        let updatedComponents: Component[] = [];

        for (const component of components) {
            let componentResponse;
            if ("id" in component) {
                componentResponse = await Config.componentApi.updateComponent(postResponse.data.id as number, (component as Component).id as number, component);
            } else {
                componentResponse = await Config.componentApi.createComponent(postResponse.data.id as number, component as NewComponent);
            }
            updatedComponents.push(componentResponse.data);
        }

        return [updatedPost, updatedComponents];
    } catch (e) {
        if (e.response && e.response.status === 422) {
            throw(new Error("Форма заполнена некорректно: " + e.response.data.errors.join(", ")));
        } else {
            throw(new Error("Произошла ошибка во время создания публикации"));
        }
    }
}

export function EditPost() {
    let {id}: any = useParams();
    const [post, setPost] = useState<Post | undefined>();
    const [components, setComponents] = useState<(Component | NewComponent)[] | undefined>();
    const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
    const [saveError, setSaveError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingError, setLoadingError] = useState<string | undefined>();

    async function load() {
        setLoading(true);
        setLoadingError(undefined);

        try {
            const postResponse = await Config.postApi.getPost(id);
            const componentsResponse = await Config.componentApi.indexComponents(id);
            setPost(postResponse.data);
            setComponents(componentsResponse.data);
        } catch {
            setLoadingError("При загрузке публикации произошла ошибка");
        }
        setLoading(false);
    }

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function onSave() {
        if (post === undefined || components === undefined) return;

        setSaveSuccess(false);
        setSaveError("");

        if (post.name === "" || post.seo_url === "") {
            setSaveError("Необходимо заполнить все поля формы");
            return;
        }

        try {
            const [updatedPost, updatedComponents] = await updatePost(post, components);
            setPost(updatedPost);
            setComponents(updatedComponents);
            setSaveSuccess(true);
        } catch (e) {
            setSaveError(e.message);
        }
    }

    return (
        <div>
            <h1>Редактирование публикации</h1>

            <Alert show={!!loadingError} variant="danger">
                <p>{loadingError}</p>
                <Button onClick={() => load()}>Повторить попытку</Button>
            </Alert>

            {loading ? <Spinner animation="border" variant="primary"/> : ''}

            {(post === undefined || components === undefined) ? '' :
                <div>
                    <Alert show={saveSuccess} variant="success">
                        <p>Публикация успешно сохранена</p>
                    </Alert>

                    <Alert show={saveError !== ""} variant="danger">
                        <p>Не удалось сохранить публикацию. {saveError}</p>
                    </Alert>

                    <PostForm post={post}
                              components={components}
                              saveText="Сохранить"
                              onSave={onSave}
                              onChangePost={setPost}
                              onChangeComponents={setComponents}/>
                </div>
            }
        </div>
    );
}