import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Component, NewComponent, Post} from "./api";
import {OldPostForm} from "./OldPostForm";
import Config from "./Config";
import {Alert, Button, Spinner} from "react-bootstrap";

export function EditPost() {
    let {id}: any = useParams();
    const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
    const [saveError, setSaveError] = useState<string>("");
    const [post, setPost] = useState<Post | undefined>();
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingError, setLoadingError] = useState<string | undefined>();
    const [components, setComponents] = useState<(Component | NewComponent)[] | undefined>();

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
    }, []);

    return (
        <div>
            <h1>Редактирование публикации</h1>

            <Alert show={!!loadingError} variant="danger">
                <p>{loadingError}</p>
                <Button onClick={e => load()}>Повторить попытку</Button>
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
                    <OldPostForm post={post} saveText="Сохранить" components={components}
                                 onSaveSuccess={() => {
                                  setSaveError("");
                                  setSaveSuccess(true);
                              }}
                                 onSaveError={(errorMessage) => {
                                  setSaveError(errorMessage);
                                  setSaveSuccess(false);
                              }}
                    />
                </div>
            }
        </div>
    );
}