import React from 'react';
import './App.css';
import {Route, Switch} from "react-router-dom";
import {CreatePost} from "./CreatePost";
import {PostsIndex} from "./PostsIndex";
import {Home} from "./Home";
import {Post} from "./Post";
import {Container, Nav, Navbar} from 'react-bootstrap';

function App() {
    return (
        <Container fluid>
            <Navbar bg="light" expand="lg">
                <Navbar.Brand href="/">Тестовое задание Медузы</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/posts/create">Новая публикация</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>

            <Switch>
                <Route exact path="/posts/create">
                    <CreatePost/>
                </Route>
                <Route path="/posts/:id">
                    <Post/>
                </Route>
                <Route exact path="/posts">
                    <PostsIndex/>
                </Route>
                <Route path="/">
                    <Home/>
                </Route>
            </Switch>
        </Container>
    );
}

export default App;
