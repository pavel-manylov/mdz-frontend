import {Component, NewComponent, PostReference} from "./api";
import React from "react";
import {Button, ButtonGroup, Card, Col, Form, FormGroup, Row} from "react-bootstrap";
import {CustomFieldsComponent} from "./CustomFieldsComponent";
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
    let valueComponent: any;
    if (component.type === "string") {
        valueComponent = <ComponentStringValueComponent value={String(component.value)}
                                                        onChange={(newValue) => {
                                                            onChange({...component, value: newValue})
                                                        }}/>;
    } else if (component.type === "boolean") {
        valueComponent = <ComponentBooleanValueComponent value={!!component.value}
                                                         onChange={(newValue) => {
                                                             onChange({...component, value: newValue})
                                                         }}/>;
    } else if (component.type === "relation") {
        valueComponent = <ComponentRelationValueComponent value={(component.value || []) as PostReference[]}
                                                          onChange={(newValue) => {
                                                              onChange({...component, value: newValue})
                                                          }}/>;
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
                        <Form.Check type="checkbox" checked={component.public} onChange={e => {
                            onChange({...component, public: e.target.checked});
                        }}/>
                    </Col>
                </FormGroup>

                <FormGroup as={Row} controlId="displayClass">
                    <Form.Label column sm={2}>Класс для отображения на клиенте</Form.Label>
                    <Col sm={10}>
                        <Form.Control value={component.display_class || ''} placeholder="header1" onChange={e => {
                            onChange({...component, display_class: e.target.value});
                        }}/>
                    </Col>
                </FormGroup>

                <hr/>
                <CustomFieldsComponent customFields={component.custom_fields || {}} onChange={(newCustomFields) => {
                    onChange({...component, custom_fields: newCustomFields})
                }}/>
            </Card.Body>
            <Card.Footer>
                <ButtonGroup>
                    <Button variant="outline-secondary" onClick={() => onMoveUp(component)}>Вверх</Button>
                    <Button variant="outline-secondary" onClick={() => onMoveDown(component)}>Вниз</Button>
                    <Button variant="outline-danger" onClick={() => onDelete(component)}>Удалить</Button>
                </ButtonGroup>
            </Card.Footer>
        </Card>
    );
}