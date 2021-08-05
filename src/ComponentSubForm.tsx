import {Component, NewComponent} from "./api";
import React, {useEffect, useState} from "react";
import {Col, Form, FormGroup} from "react-bootstrap";
import {CustomFields, CustomFieldsComponent} from "./CustomFieldsComponent";

interface ComponentSubFormProps {
    component: Component | NewComponent;

    onChange(component: Component | NewComponent): void;
}

export function ComponentSubForm({component, onChange}: ComponentSubFormProps) {
    const [order, setOrder] = useState<string>(String(component.order));
    const [value, setValue] = useState<string>(String(component.value));
    const [displayClass, setDisplayClass] = useState<string>(component.display_class || '');
    const [_public, setPublic] = useState<boolean>(!!component.public);
    const [customFields, setCustomFields] = useState<CustomFields>(component.custom_fields || {});

    useEffect(() => {
        component.order = parseInt(order);
        component.value = value;
        component.display_class = displayClass;
        component.public = _public;
        component.custom_fields = customFields;

        console.log('custom', customFields);

        onChange(component);
    });

    return (
        <div>
            <h2>Компонент</h2>
            <FormGroup as={Col} controlId="order">
                <Form.Label>Порядковый номер</Form.Label>
                <Form.Control value={order} onChange={e => {
                    setOrder(e.target.value);
                }}/>
            </FormGroup>
            <FormGroup as={Col} controlId="value">
                <Form.Label>Значение</Form.Label>
                <Form.Control as="textarea" value={value} onChange={e => {
                    setValue(e.target.value);
                }}/>
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