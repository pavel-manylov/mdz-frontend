import React, {useState} from "react";
import {Button, Col, FormControl, Row} from "react-bootstrap";

interface NewCustomFieldProps {
    onSubmit(name: string, value: string): void;
}

export function NewCustomField({onSubmit}: NewCustomFieldProps) {
    const [newFieldName, setNewFieldName] = useState<string>("");
    const [newFieldValue, setNewFieldValue] = useState<string>("");

    return (
        <Row>
            <Col sm={5}>
                <FormControl placeholder="Ключ" value={newFieldName} onChange={e => {
                    setNewFieldName(e.target.value);
                }}/>
            </Col>
            <Col sm={5}>
                <FormControl placeholder="Значение" value={newFieldValue} onChange={e => {
                    setNewFieldValue(e.target.value);
                }}/>
            </Col>
            <Col sm={2}>
                <Button variant="outline-secondary"
                        onClick={() => {
                            onSubmit(newFieldName, newFieldValue);
                            setNewFieldName("");
                            setNewFieldValue("");
                        }}
                        disabled={newFieldName === "" || newFieldValue === ""}>Добавить</Button>
            </Col>
        </Row>
    );
}