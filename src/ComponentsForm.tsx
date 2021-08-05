import React, {useEffect, useState} from "react";
import {Component, NewComponent, NewComponentTypeEnum, PostReference} from "./api";
import {ComponentSubForm} from "./ComponentSubForm";
import {Button} from "react-bootstrap";
import {v4 as uuid} from 'uuid';

interface ComponentsFormParams {
    components: NewComponent[];

    onChange(components: NewComponent[]): void;
}

interface NewComponentWithKey {
    component: NewComponent;
    key: string;
}

export function ComponentsForm({components: initialComponents, onChange}: ComponentsFormParams) {
    const [componentsWithKey, setComponentsWithKey] = useState<NewComponentWithKey[]>(
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

    function sortByOrder(componentsWithKey: NewComponentWithKey[]) {
        componentsWithKey.sort((a, b) => (a.component.order || 0) - (b.component.order || 0));
    }
    function componentChanged(index: number, component: Component | NewComponent) {
        let newComponentsWithKey: NewComponentWithKey[] = [...componentsWithKey];
        newComponentsWithKey[index] = {component: component as NewComponent, key: componentsWithKey[index].key};
        sortByOrder(newComponentsWithKey);
        setComponentsWithKey(newComponentsWithKey);
    }

    function moveComponent(index: number, newIndex: number) {
        let newComponentsWithKey: NewComponentWithKey[] = [...componentsWithKey];

        const component = newComponentsWithKey[index];
        newComponentsWithKey.splice(index, 1);
        newComponentsWithKey.splice(newIndex, 0, component);
        newComponentsWithKey.forEach((c, index) => c.component.order = index);
        setComponentsWithKey(newComponentsWithKey);
    }

    function moveDown(index: number) {
        moveComponent(index, index+1);
    }

    function moveUp(index: number) {
        moveComponent(index, index-1);
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

        <Button variant="secondary" onClick={addStringComponent}>Добавить строковый компонент</Button> <br/>
        <Button variant="secondary" onClick={addBooleanComponent}>Добавить булев компонент</Button> <br/>
        <Button variant="secondary" onClick={addRelationComponent}>Добавить компонент-вложения</Button> <br/>

    </div>);
}