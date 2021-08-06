import React from "react";
import {Component, NewComponent, NewComponentTypeEnum, PostReference} from "./api";
import {ComponentSubForm} from "./ComponentSubForm";
import {Button, ButtonGroup, Col, Dropdown, Row} from "react-bootstrap";

interface ComponentsFormParams {
    components: (Component | NewComponent)[];

    onChange(components: (Component | NewComponent)[]): void;

    onDelete(component: Component | NewComponent): void;
}

export function ComponentsForm({components, onChange, onDelete}: ComponentsFormParams) {
    function addComponent(type: NewComponentTypeEnum, value: string | boolean | PostReference[]) {
        onChange([
            ...components,
            {
                order: components.length > 0 ? (components[components.length - 1].order || 0) + 1 : 0,
                type: type,
                value: value,
                custom_fields: {},
                public: true
            } as NewComponent
        ]);
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

    function sortByOrder(components: (Component|NewComponent)[]) {
        components.sort((a, b) => (a.order || 0) - (b.order || 0));
    }

    function componentChanged(index: number, component: Component | NewComponent) {
        let updatedComponents: (Component|NewComponent)[] = [...components];
        updatedComponents[index] = component;
        sortByOrder(updatedComponents);
        onChange(updatedComponents);
    }

    function moveComponent(index: number, newIndex: number) {
        let updatedComponents: (Component|NewComponent)[] = [...components];

        const component = updatedComponents[index];
        updatedComponents.splice(index, 1);
        updatedComponents.splice(newIndex, 0, component);
        updatedComponents.forEach((c, index) => c.order = index);

        onChange(updatedComponents);
    }

    function moveDown(index: number) {
        moveComponent(index, index + 1);
    }

    function moveUp(index: number) {
        moveComponent(index, index - 1);
    }

    function deleteComponent(index: number) {
        const componentToDelete = components[index];

        let updatedComponents = [...components];
        updatedComponents.splice(index, 1);

        onChange(updatedComponents);
        onDelete(componentToDelete);
    }

    return (<div>
        {components.map((component, i) =>
            <ComponentSubForm key={i}
                              component={component}
                              onChange={(c) => componentChanged(i, c)}
                              onMoveUp={() => moveUp(i)}
                              onMoveDown={() => moveDown(i)}
                              onDelete={() => deleteComponent(i)}
            />)}

        <Row>
            <Col>
                <Dropdown as={ButtonGroup}>
                    <Button variant="outline-secondary" onClick={addStringComponent}>Добавить строку</Button>

                    <Dropdown.Toggle split variant="outline-secondary" id="dropdown-split-basic"/>

                    <Dropdown.Menu>
                        <Dropdown.Item as="button" onClick={e => {
                            addBooleanComponent();
                            e.preventDefault();
                        }}>Добавить булево значение</Dropdown.Item>
                        <Dropdown.Item as="button" onClick={e => {
                            addRelationComponent();
                            e.preventDefault();
                        }}>Добавить вложения</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Col>
        </Row>
    </div>);
}