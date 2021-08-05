import React, {useState} from "react";
import {Alert} from "react-bootstrap";
import {Link} from "react-router-dom";
import {NewComponent, NewPost, Post, PostReference} from "./api";
import {PostForm} from "./PostForm";

export function CreatePost() {
    const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
    const [saveError, setSaveError] = useState<string>("");
    const [createdPostId, setCreatedPostId] = useState<number | undefined>();

    const newPost: NewPost = {};
    const newComponents: NewComponent[] = [{
        type: 'relation',
        value: [] as PostReference[],
        public: true,
        order: 0
    } as NewComponent];

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
                <PostForm post={newPost}
                          components={newComponents}
                          saveText="Создать"
                          onSaveSuccess={(post) => {
                              setCreatedPostId((post as Post).id);
                              setSaveError("");
                              setSaveSuccess(true);
                          }}
                          onSaveError={(errorMessage) => {
                              setSaveError(errorMessage);
                              setSaveSuccess(false);
                          }}
                />
            }

        </div>
    )
}