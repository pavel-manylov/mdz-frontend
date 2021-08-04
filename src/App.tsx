import React from 'react';
import './App.css';
import {Route, Switch} from "react-router-dom";
import {CreatePost} from "./CreatePost";
import {PostsIndex} from "./PostsIndex";
import {Home} from "./Home";
import {Post} from "./Post";

function App() {
  return (
    <div>
      <Switch>
        <Route exact path="/posts/create">
          <CreatePost />
        </Route>
        <Route path="/posts/:id">
          <Post/>
        </Route>
        <Route exact path="/posts">
          <PostsIndex />
        </Route>
        <Route path="/">
          <Home/>
        </Route>
      </Switch>
    </div>
  );
}

export default App;
