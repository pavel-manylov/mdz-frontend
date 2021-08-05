import React, {useEffect, useState} from "react";
import {Component, NewComponent, NewComponentTypeEnum, PostReference} from "./api";
import {ComponentSubForm} from "./ComponentSubForm";
import {Button, ButtonGroup, Col, Dropdown, Row} from "react-bootstrap";
import {v4 as uuid} from 'uuid';

interface ComponentsFormParams {
    components: (Component|NewComponent)[];

    onChange(components: (Component|NewComponent)[]): void;
}

interface ComponentWithKey {
    component: NewComponent | Component;
    key: string;
}

export function ComponentsForm({components: initialComponents, onChange}: ComponentsFormParams) {
    const [componentsWithKey, setComponentsWithKey] = useState<ComponentWithKey[]>(
        initialComponents.map(c => {
            return {component: c, key: uuid()}
        })
    );

    function addComponent(type: NewComponentTypeEnum, value: string | boolean | PostReference[]) {
        setComponentsWithKey([...componentsWithKey, {
            component: {
                order: componentsWithKey.length > 0 ? (componentsWithKey[componentsWithKey.length - 1].component.order || 0) + 1 : 0,
                type: type,
                value: value,
                custom_fields: {},
                public: true
            },
            key: uuid()
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

    function sortByOrder(componentsWithKey: ComponentWithKey[]) {
        componentsWithKey.sort((a, b) => (a.component.order || 0) - (b.component.order || 0));
    }

    function componentChanged(index: number, component: Component | NewComponent) {
        let newComponentsWithKey: ComponentWithKey[] = [...componentsWithKey];
        newComponentsWithKey[index] = {component: component as NewComponent, key: componentsWithKey[index].key};
        sortByOrder(newComponentsWithKey);
        setComponentsWithKey(newComponentsWithKey);
    }

    function moveComponent(index: number, newIndex: number) {
        let newComponentsWithKey: ComponentWithKey[] = [...componentsWithKey];

        const component = newComponentsWithKey[index];
        newComponentsWithKey.splice(index, 1);
        newComponentsWithKey.splice(newIndex, 0, component);
        newComponentsWithKey.forEach((c, index) => c.component.order = index);
        setComponentsWithKey(newComponentsWithKey);
    }

    function moveDown(index: number) {
        moveComponent(index, index + 1);
    }

    function moveUp(index: number) {
        moveComponent(index, index - 1);
    }

    useEffect(() => {
        onChange(componentsWithKey.map(c => c.component));
    }, [componentsWithKey, onChange]);

    return (<div>
        {componentsWithKey.map((componentWithKey, i) =>
            <ComponentSubForm key={componentWithKey.key}
                              component={componentWithKey.component}
                              onChange={(c) => componentChanged(i, c)}
                              onMoveUp={c => moveUp(i)}
                              onMoveDown={c => moveDown(i)}
            />)}

        <Row>
            <Col>
                <Dropdown as={ButtonGroup}>
                    <Button variant="outline-secondary" onClick={addStringComponent}>Добавить строку</Button>

                    <Dropdown.Toggle split variant="outline-secondary" id="dropdown-split-basic"/>

                    <Dropdown.Menu>
                        <Dropdown.Item as="button" onClick={ e => { addBooleanComponent(); e.preventDefault(); }}>Добавить булево значение</Dropdown.Item>
                        <Dropdown.Item as="button" onClick={ e => { addRelationComponent(); e.preventDefault(); }}>Добавить вложения</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Col>
        </Row>
    </div>);
}