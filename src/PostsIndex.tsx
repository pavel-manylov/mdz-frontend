import React, {useEffect, useState} from "react";
import {Alert, Button, ButtonGroup, Spinner, Table} from "react-bootstrap";
import {Link} from "react-router-dom";
import {Post} from "./api";
import Config from "./Config";

export function PostsIndex() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingError, setLoadingError] = useState<string | undefined>();
    const [deleteError, setDeleteError] = useState<string | undefined>();
    const [postsLoaded, setPostsLoaded] = useState<boolean>(false);

    useEffect(() => {
        // noinspection JSIgnoredPromiseFromCall
        load();
    }, []);

    async function load() {
        setLoading(true);
        setLoadingError(undefined);

        try {
            const postsResponse = await Config.postApi.indexPosts();
            setPosts(postsResponse.data);
            setPostsLoaded(true);
        } catch {
            setLoadingError('Произошла ошибка при загрузке публикаций');
        }

        setLoading(false);
    }

    async function deletePost(index: number, post: Post) {
        setDeleteError(undefined);

        try {
            await Config.postApi.deletePost(post.id as number);
            let postsWithoutDeleted = [...posts];
            postsWithoutDeleted.splice(index, 1);
            setPosts(postsWithoutDeleted);
        } catch {
            setDeleteError('Произошла ошибка при удалении публикации');
        }
    }


    return (
        <div>
            <h1>Список публикаций</h1>

            <Alert show={!!loadingError} variant="danger">
                <p>{loadingError}</p>
                <Button onClick={() => load()}>Повторить попытку</Button>
            </Alert>

            <Alert show={!!deleteError} variant="danger">
                <p>{deleteError}</p>
            </Alert>

            {loading ? <Spinner animation="border" variant="primary"/> : ''}

            {posts.length === 0 && postsLoaded ? <div>
                <p>Публикации отсутствуют</p>
                <Button href="/posts/create" variant="primary">Создать публикацию</Button>
            </div> : ''}
            {posts.length === 0 ? '' :
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>Идентификатор</th>
                        <th>Внутр. название</th>
                        <th>SEO URL</th>
                        <th>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {posts.map((post, i) =>
                        <tr key={i}>
                            <td><Link to={"/posts/" + post.id}>{post.id}</Link></td>
                            <td><Link to={"/posts/" + post.id}>{post.name}</Link></td>
                            <td>{post.seo_url}</td>
                            <td>
                                <ButtonGroup>
                                    <Button variant="outline-secondary"
                                            href={"/posts/" + post.id}>Редактировать</Button>
                                    <Button variant="outline-danger"
                                            onClick={() => deletePost(i, post)}>Удалить</Button>

                                </ButtonGroup>
                            </td>
                        </tr>
                    )}
                    </tbody>
                </Table>
            }
        </div>
    )
}