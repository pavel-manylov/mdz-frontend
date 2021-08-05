import {Form} from "react-bootstrap";
import React from "react";

interface ComponentBooleanValueComponentProps {
    value: boolean;

    onChange(value: boolean): void;
}

export function ComponentBooleanValueComponent({value, onChange}: ComponentBooleanValueComponentProps) {
    return (
        <Form.Check checked={value} onChange={e => {
            onChange(e.target.checked);
        }}/>
    )
}