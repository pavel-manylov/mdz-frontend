import React from "react";
import { Link } from "react-router-dom";

export function Home() {
    return (
        <ul>
            <li><Link to="/posts/create">Создать новую публикацию</Link></li>
            <li><Link to="/posts">Список публикаций</Link></li>
        </ul>
    );
}