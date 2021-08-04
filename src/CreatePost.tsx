import React, {useState} from "react";
import {Alert, Button, Col, Form} from "react-bootstrap";
import {NewPost} from "./api";
import Config from "./Config";

export function CreatePost() {
    const [name, setName] = useState("");
    const [seoUrl, setSeoUrl] = useState("");
    const [saved, setSaved] = useState(false);
    const [saveError, setSaveError] = useState<string | undefined>("");

    async function save() {
        if (name === "" || seoUrl === "") {
            setSaved(false);
            setSaveError("Необходимо заполнить все поля формы");
            return;
        }

        const post: NewPost = {name: name, seo_url: seoUrl};

        try {
            await Config.postApi.createPost(post);
            setSaved(true);
        } catch (e) {
            if (e.response && e.response.status === 422) {
                setSaveError("Форма заполнена некорректно: " + e.response.data.errors.join(", "));
            } else {
                setSaveError("Произошла ошибка во время создания публикации");
            }

            setSaved(false);
        }

    }

    return (
        <div>
            <h1>Создание новой публикации</h1>
            <Alert show={saved} variant="success">
                <Alert.Heading>Создание публикации</Alert.Heading>
                <p>Публикация успешно создана</p>
            </Alert>

            <Alert show={saveError !== ""} variant="success">
                <Alert.Heading>Создание публикации</Alert.Heading>
                <p>{saveError}</p>
            </Alert>

            <Form>
                <Form.Group as={Col} controlId="name">
                    <Form.Label>Внутреннее название публикации</Form.Label>
                    <Form.Control placeholder="Amazon увольняет всех сотрудников" value={name}
                                  onChange={e => setName(e.target.value)}/>
                </Form.Group>
                <Form.Group as={Col} controlId="seoUrl">
                    <Form.Label>Человекочитаемый URL</Form.Label>
                    <Form.Control placeholder="amazon-fires-all-the-people" value={seoUrl}
                                  onChange={e => setSeoUrl(e.target.value)}/>
                </Form.Group>
                <Button variant="primary" onClick={save}>Создать</Button>
            </Form>
        </div>
    )
}