import {Form} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {PostReference} from "./api";

interface ComponentRelationValueComponentProps {
    value: PostReference[];

    onChange(value: PostReference[]): void;
}

export function ComponentRelationValueComponent({value, onChange}: ComponentRelationValueComponentProps) {
    const initialValue: string = value.map(r => r.post_id).join(',');
    const [stringValue, setStringValue] = useState<string>(initialValue);

    useEffect(() => {
        const postReferences: PostReference[] = [];

        stringValue.split(",").forEach((id) => {
            const postId = parseInt(id);
            if(isNaN(postId)) {
                return null;
            }

            postReferences.push({post_id: postId});
        });

        onChange(postReferences);
    }, [stringValue, onChange])

    return (
        <Form.Control value={stringValue} placeholder="идентификаторы публикаций через запятую" onChange={e => {
            setStringValue(e.target.value);
        }}/>
    )
}