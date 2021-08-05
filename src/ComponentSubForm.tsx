import {Component, NewComponent, PostReference} from "./api";
import React, {useEffect, useState} from "react";
import {Button, ButtonGroup, Card, Col, Form, FormGroup, Row} from "react-bootstrap";
import {CustomFields, CustomFieldsComponent} from "./CustomFieldsComponent";
import {ComponentBooleanValueComponent} from "./ComponentBooleanValueComponent";
import {ComponentStringValueComponent} from "./ComponentStringValueComponent";
import {ComponentRelationValueComponent} from "./ComponentRelationValueComponent";

interface ComponentSubFormProps {
    component: Component | NewComponent;

    onChange(component: Component | NewComponent): void;

    onMoveUp(component: Component | NewComponent): void;

    onMoveDown(component: Component | NewComponent): void;

    onDelete(component: Component | NewComponent): void;
}

export function ComponentSubForm({component, onChange, onMoveUp, onMoveDown, onDelete}: ComponentSubFormProps) {
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
        valueComponent =
            <ComponentRelationValueComponent value={(value || []) as PostReference[]} onChange={setValue}/>;
    }

    const titles = {
        string: 'Строковый компонент',
        boolean: 'Булев компонент (чекбокс)',
        relation: 'Вложения'
    };

    return (
        <Card className="mb-4">
            <Card.Header>{titles[component.type || 'string']}</Card.Header>
            <Card.Body>
                <FormGroup as={Row} controlId="value">
                    <Form.Label column sm={2}>Значение</Form.Label>
                    <Col sm={10}>
                        {valueComponent}
                    </Col>
                </FormGroup>

                <hr/>

                <FormGroup as={Row} controlId="public">
                    <Form.Label column sm={2}>Публичный компонент</Form.Label>
                    <Col sm={10}>
                        <Form.Check type="checkbox" checked={_public} onChange={e => {
                            setPublic(e.target.checked);
                        }}/>
                    </Col>
                </FormGroup>

                <FormGroup as={Row} controlId="displayClass">
                    <Form.Label column sm={2}>Класс для отображения на клиенте</Form.Label>
                    <Col sm={10}>
                        <Form.Control value={displayClass} placeholder="header1" onChange={e => {
                            setDisplayClass(e.target.value);
                        }}/>
                    </Col>
                </FormGroup>

                <hr/>
                <CustomFieldsComponent customFields={customFields} onChange={setCustomFields}/>
            </Card.Body>
            <Card.Footer>
                <ButtonGroup>
                    <Button variant="outline-secondary" onClick={e => onMoveUp(component)}>Вверх</Button>
                    <Button variant="outline-secondary" onClick={e => onMoveDown(component)}>Вниз</Button>
                    <Button variant="outline-danger" onClick={e => onDelete(component)}>Удалить</Button>
                </ButtonGroup>
            </Card.Footer>
        </Card>
    );
}