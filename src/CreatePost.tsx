import React, {useState} from "react";
import {Alert, Button, Col, Form} from "react-bootstrap";
import {Component, NewComponent, NewComponentTypeEnum, NewPost, PostReference} from "./api";
import Config from "./Config";
import {ComponentSubForm} from "./ComponentSubForm";

export function CreatePost() {
    const [name, setName] = useState("");
    const [seoUrl, setSeoUrl] = useState("");
    const [saved, setSaved] = useState(false);
    const [saveError, setSaveError] = useState<string>("");

    const [components, setComponents] = useState<NewComponent[]>([]);

    async function save() {
        if (name === "" || seoUrl === "") {
            setSaved(false);
            setSaveError("Необходимо заполнить все поля формы");
            return;
        }

        const post: NewPost = {name: name, seo_url: seoUrl};

        try {
            const postResponse = await Config.postApi.createPost(post);

            for(const component of components) {
                await Config.componentApi.createComponent(postResponse.data.id as number, component);
            }

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

    function addComponent(type: NewComponentTypeEnum, value: string|boolean|PostReference[]) {
        setComponents([...components, {
            order: 0,
            type: type,
            value: value,
            custom_fields: {},
            public: true
        }]);
    }

    function addStringComponent() {
        addComponent(NewComponentTypeEnum.String, "");
    }

    function addBooleanComponent() {
        addComponent(NewComponentTypeEnum.Boolean, true);
    }

    function addRelationComponent() {
        addComponent(NewComponentTypeEnum.Relation, [] as PostReference[]);
    }

    function componentChanged(index: number, component: Component | NewComponent) {
        components[index] = component as NewComponent;
        setComponents(components)
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

                {components.map((component, i) =>
                    <ComponentSubForm key={i}
                                      component={component}
                                      onChange={(c) => componentChanged(i, c) }
                    />)
                }

                <Button variant="secondary" onClick={addStringComponent}>Добавить строковый компонент</Button> <br/>
                <Button variant="secondary" onClick={addBooleanComponent}>Добавить булев компонент</Button> <br/>
                <Button variant="secondary" onClick={addRelationComponent}>Добавить компонент-вложения</Button> <br/>
                <Button variant="primary" onClick={save}>Создать</Button>
            </Form>
        </div>
    )
}