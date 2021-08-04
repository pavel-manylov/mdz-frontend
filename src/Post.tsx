import React from "react";
import {useParams} from "react-router-dom";

export function Post() {
    let {id}: any = useParams();

    return (
        <div>Просмотр публикации №{id}</div>
    );
}