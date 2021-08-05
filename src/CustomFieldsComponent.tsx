import React, {useEffect, useState} from "react";
import {Button, Col, FormControl, Row} from "react-bootstrap";

export type CustomFields = { [key: string]: string; };

interface CustomFieldsComponentProps {
    customFields: CustomFields;

    onChange(customFields: CustomFields): void;
}

export function CustomFieldsComponent({customFields, onChange}: CustomFieldsComponentProps) {
    const [updatedCustomFields, setUpdatedCustomFields] = useState<CustomFields>(customFields);
    const [newFieldName, setNewFieldName] = useState<string>("");
    const [newFieldValue, setNewFieldValue] = useState<string>("");

    function updateName(oldName: string, newName: string) {
        let updated: CustomFields = Object.assign({}, updatedCustomFields);
        const value = updated[oldName];
        delete updated[oldName];
        updated[newName] = value;
        setUpdatedCustomFields(updated);
    }

    function updateValue(name: string, newValue: string) {
        let updated: CustomFields = Object.assign({}, updatedCustomFields);
        updated[name] = newValue;
        setUpdatedCustomFields(updated);
    }

    function remove(name: string) {
        let updated: CustomFields = Object.assign({}, updatedCustomFields);
        delete updated[name];
        setUpdatedCustomFields(updated);
    }

    function addNewField() {
        let updated: CustomFields = Object.assign({}, updatedCustomFields);
        updated[newFieldName] = newFieldValue;
        setUpdatedCustomFields(updated);

        setNewFieldName("");
        setNewFieldValue("");
    }

    useEffect(() => {
        onChange(updatedCustomFields);
    });

    return (
        <div>
            {Object.keys(updatedCustomFields).map((key, index) =>
                <Row key={index}>
                    <Col>
                        <FormControl placeholder="Ключ" value={key} onChange={e => updateName(key, e.target.value)}/>
                    </Col>
                    <Col>
                        <FormControl placeholder="Значение" value={updatedCustomFields[key]}
                                     onChange={e => updateValue(key, e.target.value)}/>
                    </Col>
                    <Col>
                        <Button variant="secondary" onClick={e => remove(key)}>Удалить</Button>
                    </Col>
                </Row>
            )}

            <h4>Новое поле</h4>
            <Row>
                <Col>
                    <FormControl placeholder="Ключ" value={newFieldName} onChange={e => {
                        setNewFieldName(e.target.value);
                    }}/>
                </Col>
                <Col>
                    <FormControl placeholder="Значение" value={newFieldValue} onChange={e => {
                        setNewFieldValue(e.target.value);
                    }}/>
                </Col>
                <Col>
                    <Button variant="secondary" onClick={addNewField} disabled={newFieldName === "" || newFieldValue === ""}>Добавить</Button>
                </Col>
            </Row>
        </div>
    );
}