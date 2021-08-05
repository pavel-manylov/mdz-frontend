import React, {useState} from "react";
import {Alert} from "react-bootstrap";
import {NewComponent, NewPost, PostReference} from "./api";
import {PostForm} from "./PostForm";

export function CreatePost() {
    const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
    const [saveError, setSaveError] = useState<string>("");
    const newPost: NewPost = {};
    const newComponents: NewComponent[] = [{type: 'relation', value: [] as PostReference[], public: true, order: 0} as NewComponent];

    return (
        <div>
            <h1>Создание новой публикации</h1>
            <Alert show={saveSuccess} variant="success">
                <p>Публикация успешно создана</p>
            </Alert>

            <Alert show={saveError !== ""} variant="danger">
                <p>Не удалось создать публикацию. {saveError}</p>
            </Alert>

            <PostForm post={newPost}
                      components={newComponents}
                      saveText="Создать"
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
    )
}