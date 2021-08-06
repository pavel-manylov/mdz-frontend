import {Component, NewComponent, NewPost, Post} from "./api";
import React from "react";
import {Button, Col, Form, Row} from "react-bootstrap";
import {ComponentsForm} from "./ComponentsForm";

interface PostFormProps {
    post: NewPost | Post;
    components: (NewComponent | Component)[];
    saveText: string;

    onSave(): void;

    onChangePost(post: NewPost | Post): void;

    onChangeComponents(components: (Component | NewComponent)[]): void;
}

export function PostForm({
                                post,
                                components,
                                saveText,
                                onSave,
                                onChangePost,
                                onChangeComponents
                            }: PostFormProps) {

    return (
        <div>
            <Form>
                <Form.Group as={Row} controlId="name">
                    <Form.Label column sm={2}>Внутреннее название публикации</Form.Label>
                    <Col sm={10}>
                        <Form.Control placeholder="Amazon увольняет всех сотрудников"
                                      value={post.name}
                                      onChange={e => onChangePost({...post, name: e.target.value})}/>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="seoUrl">
                    <Form.Label column sm={2}>Человекочитаемый URL</Form.Label>
                    <Col sm={10}>
                        <Form.Control placeholder="amazon-fires-all-the-people"
                                      value={post.seo_url}
                                      onChange={e => onChangePost({...post, seo_url: e.target.value})}/>
                    </Col>
                </Form.Group>

                <ComponentsForm components={components}
                                onChange={onChangeComponents}
                                onDelete={f => f}/>

                <Row className="mt-3">
                    <Col>
                        <Button variant="primary" onClick={onSave}>{saveText}</Button>
                    </Col>
                </Row>

            </Form>
        </div>
    )
}