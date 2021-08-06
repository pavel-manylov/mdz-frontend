import React, {useState} from "react";
import {Alert} from "react-bootstrap";
import {Link} from "react-router-dom";
import {NewComponent, NewComponentTypeEnum, NewPost, Post, PostReference} from "./api";
import {PostForm} from "./PostForm";
import Config from "./Config";

async function createNewPost(post: NewPost, components: NewComponent[]): Promise<Post> {
    try {
        const postResponse = await Config.postApi.createPost(post);

        for (const component of components) {
            await Config.componentApi.createComponent(postResponse.data.id as number, component as NewComponent);
        }

        return postResponse.data as Post;
    } catch (e) {
        if (e.response && e.response.status === 422) {
            throw(new Error("Форма заполнена некорректно: " + e.response.data.errors.join(", ")));
        } else {
            throw(new Error("Произошла ошибка во время создания публикации"));
        }
    }
}

export function CreatePost() {
    const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
    const [saveError, setSaveError] = useState<string>("");
    const [createdPostId, setCreatedPostId] = useState<number | undefined>();

    const [post, setPost] = useState<NewPost>({
        name: "",
        seo_url: ""
    });

    const [components, setComponents] = useState<NewComponent[]>([{
        type: NewComponentTypeEnum.Relation,
        value: [] as PostReference[],
        public: true,
        order: 0,
        custom_fields: {}
    }]);

    async function onSave() {
        setSaveSuccess(false);
        setSaveError("");

        if (post.name === "" || post.seo_url === "") {
            setSaveError("Необходимо заполнить все поля формы");
            return;
        }

        try {
            const createdPost: Post = await createNewPost(post, components);
            setCreatedPostId(createdPost.id);
            setSaveSuccess(true);
        } catch(e) {
            setSaveError(e.message);
        }
    }

    return (
        <div>
            <h1>Создание новой публикации</h1>
            <Alert show={saveSuccess} variant="success">
                <p>Публикация успешно создана</p>
            </Alert>

            <Alert show={saveError !== ""} variant="danger">
                <p>Не удалось создать публикацию. {saveError}</p>
            </Alert>

            {saveSuccess ? <div>Перейти к <Link to={"/posts/" + createdPostId}>редактированию</Link></div> :
                <PostForm post={post}
                          components={components}
                          onSave={onSave}
                          saveText="Сохранить"
                          onChangePost={setPost}
                          onChangeComponents={c => setComponents(c as NewComponent[])}/>
            }

        </div>
    )
}