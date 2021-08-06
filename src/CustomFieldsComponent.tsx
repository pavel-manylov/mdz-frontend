import React from "react";
import {Button, Col, FormControl, Row} from "react-bootstrap";
import {NewCustomField} from "./NewCustomField";

export type CustomFields = { [key: string]: string; };

interface CustomFieldsComponentProps {
    customFields: CustomFields;

    onChange(customFields: CustomFields): void;
}

export function CustomFieldsComponent({customFields, onChange}: CustomFieldsComponentProps) {
    function updateName(oldName: string, newName: string) {
        let updated: CustomFields = {...customFields};
        const value = updated[oldName];
        delete updated[oldName];
        updated[newName] = value;
        onChange(updated);
    }

    function updateValue(name: string, newValue: string) {
        let updated: CustomFields = {...customFields};
        updated[name] = newValue;
        onChange(updated);
    }

    function remove(name: string) {
        let updated: CustomFields = {...customFields};
        delete updated[name];
        onChange(updated);
    }

    function addNewField(newFieldName: string, newFieldValue: string) {
        let updated: CustomFields = {...customFields};
        updated[newFieldName] = newFieldValue;
        onChange(updated);
    }

    return (
        <div>
            {Object.keys(customFields).map((key, index) =>
                <Row key={index} className="mb-2">
                    <Col sm={5}>
                        <FormControl placeholder="Ключ" value={key} onChange={e => updateName(key, e.target.value)}/>
                    </Col>
                    <Col sm={5}>
                        <FormControl placeholder="Значение" value={customFields[key]}
                                     onChange={e => updateValue(key, e.target.value)}/>
                    </Col>
                    <Col sm={2}>
                        <Button variant="outline-danger" onClick={() => remove(key)}>Удалить</Button>
                    </Col>
                </Row>
            )}

            <NewCustomField onSubmit={addNewField}/>
        </div>
    );
}