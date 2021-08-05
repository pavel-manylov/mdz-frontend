import {Component, NewComponent, NewPost, Post} from "./api";
import React, {useState} from "react";
import Config from "./Config";
import {Button, Col, Form, Row} from "react-bootstrap";
import {ComponentsForm} from "./ComponentsForm";

interface PostFormProps {
    post: NewPost | Post;
    components: (NewComponent | Component)[];
    saveText: string;

    onSaveSuccess(post: NewPost | Post): void;

    onSaveError(errorMessage: string): void;
}

export function PostForm({saveText, post, components: initialComponents, onSaveSuccess, onSaveError}: PostFormProps) {
    const [name, setName] = useState(post.name);
    const [seoUrl, setSeoUrl] = useState(post.seo_url);
    const [components, setComponents] = useState<(Component | NewComponent)[]>(initialComponents);

    async function save() {
        if (name === "" || seoUrl === "") {
            onSaveError("Необходимо заполнить все поля формы");
            return;
        }

        const post: NewPost = {name: name, seo_url: seoUrl};
        post.name = name;
        post.seo_url = seoUrl;

        try {
            let postResponse;
            if ("id" in post) {
                postResponse = await Config.postApi.updatePost((post as Post).id as number, post);
            } else {
                postResponse = await Config.postApi.createPost(post);
            }

            for (const component of components) {
                if ("id" in component) {
                    await Config.componentApi.updateComponent(postResponse.data.id as number, (component as Component).id as number, component);
                } else {
                    await Config.componentApi.createComponent(postResponse.data.id as number, component as NewComponent);
                }

            }

            onSaveSuccess(postResponse.data);
        } catch (e) {
            if (e.response && e.response.status === 422) {
                onSaveError("Форма заполнена некорректно: " + e.response.data.errors.join(", "));
            } else {
                onSaveError("Произошла ошибка во время создания публикации");
            }
        }
    }

    return (
        <div>
            <Form>
                <Form.Group as={Row} controlId="name">
                    <Form.Label column sm={2}>Внутреннее название публикации</Form.Label>
                    <Col sm={10}>
                        <Form.Control placeholder="Amazon увольняет всех сотрудников" value={name}
                                      onChange={e => setName(e.target.value)}/>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="seoUrl">
                    <Form.Label column sm={2}>Человекочитаемый URL</Form.Label>
                    <Col sm={10}>
                        <Form.Control placeholder="amazon-fires-all-the-people" value={seoUrl}
                                      onChange={e => setSeoUrl(e.target.value)}/>
                    </Col>
                </Form.Group>

                <ComponentsForm components={components} onChange={setComponents}/>

                <Row className="mt-3">
                    <Col>
                        <Button variant="primary" onClick={save}>{saveText}</Button>
                    </Col>
                </Row>

            </Form>
        </div>
    )
}