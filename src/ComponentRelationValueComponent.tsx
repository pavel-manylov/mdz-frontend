import {Form} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {PostReference} from "./api";

interface ComponentRelationValueComponentProps {
    value: PostReference[];

    onChange(value: PostReference[]): void;
}

export function ComponentRelationValueComponent({value: valueProp, onChange}: ComponentRelationValueComponentProps) {
    const [stringValue, setStringValue] = useState<string>('');
    const [referencesValue, setReferencesValue] = useState<PostReference[]>([]);

    useEffect(() => {
        // Синхронизировать, только если извне пришли отличающиеся идентификаторы,
        // таким образом поддерживаем ситуацию неполного ввода от пользователя (висящая запятая)
        if (referencesValue.length === valueProp.length &&
            referencesValue.every((reference, index) => reference.post_id === valueProp[index].post_id)
        ) return;

        setStringValue(valueProp.map(r => r.post_id).join(','));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [valueProp]);

    function update(rawValue: string) {
        const postReferences: PostReference[] = [];

        rawValue.split(",").forEach((id) => {
            const postId = parseInt(id);
            if (isNaN(postId)) {
                return null;
            }

            postReferences.push({post_id: postId});
        });

        setStringValue(rawValue);
        setReferencesValue(postReferences);

        onChange(postReferences);
    }

    return (
        <Form.Control value={stringValue}
                      placeholder="идентификаторы публикаций через запятую"
                      onChange={e => {update(e.target.value);}}
        />
    )
}