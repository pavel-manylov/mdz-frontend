import {Component, NewComponent, PostReference} from "./api";
import React, {useEffect, useState} from "react";
import {Button, Col, Form, FormGroup} from "react-bootstrap";
import {CustomFields, CustomFieldsComponent} from "./CustomFieldsComponent";
import {ComponentBooleanValueComponent} from "./ComponentBooleanValueComponent";
import {ComponentStringValueComponent} from "./ComponentStringValueComponent";
import {ComponentRelationValueComponent} from "./ComponentRelationValueComponent";

interface ComponentSubFormProps {
    component: Component | NewComponent;

    onChange(component: Component | NewComponent): void;

    onMoveUp(component: Component | NewComponent): void;

    onMoveDown(component: Component | NewComponent): void;
}

export function ComponentSubForm({component, onChange, onMoveUp, onMoveDown}: ComponentSubFormProps) {
    const [value, setValue] = useState<string | boolean | PostReference[] | undefined>(component.value);
    const [displayClass, setDisplayClass] = useState<string>(component.display_class || '');
    const [_public, setPublic] = useState<boolean>(!!component.public);
    const [customFields, setCustomFields] = useState<CustomFields>(component.custom_fields || {});

    useEffect(() => {
        component.value = value;
        component.display_class = displayClass;
        component.public = _public;
        component.custom_fields = customFields;

        onChange(component);
    }, [value, displayClass, _public, customFields]);

    let valueComponent: any;
    if (component.type === "string") {
        valueComponent = <ComponentStringValueComponent value={String(value)} onChange={setValue}/>;
    } else if (component.type === "boolean") {
        valueComponent = <ComponentBooleanValueComponent value={!!value} onChange={setValue}/>;
    } else if (component.type === "relation") {
        valueComponent = <ComponentRelationValueComponent value={value as PostReference[]} onChange={setValue}/>;
    }

    return (
        <div>
            <h2>Компонент</h2>
            <Button onClick={e => onMoveUp(component)}>Вверх</Button>
            <Button onClick={e => onMoveDown(component)}>Вниз</Button>
            <FormGroup as={Col} controlId="value">
                <Form.Label>Значение</Form.Label>
                {valueComponent}

            </FormGroup>
            <FormGroup as={Col} controlId="public">
                <Form.Label>Публичный компонент</Form.Label>
                <Form.Check type="checkbox" checked={_public} onChange={e => {
                    setPublic(e.target.checked);
                }}/>
            </FormGroup>
            <FormGroup as={Col} controlId="displayClass">
                <Form.Label>Класс для отображения на клиенте</Form.Label>
                <Form.Control value={displayClass} onChange={e => {
                    setDisplayClass(e.target.value);
                }}/>
            </FormGroup>
            <h3>Настраиваемые поля</h3>
            <CustomFieldsComponent customFields={customFields} onChange={setCustomFields}/>
        </div>
    );
}