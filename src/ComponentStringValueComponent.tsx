import {Form} from "react-bootstrap";
import React from "react";

interface ComponentStringValueComponentProps {
    value: string;

    onChange(value: string): void;
}

export function ComponentStringValueComponent({value, onChange}: ComponentStringValueComponentProps) {
    return (
        <Form.Control as="textarea" value={value} onChange={e => {
            onChange(e.target.value);
        }}/>
    )
}