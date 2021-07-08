import "./App.css";
import React from "react";

import { ConnectedRouter } from "connected-react-router";
import { history } from "../redux/configureStore";


import { Login, Signup, PostDetail, PostList, PostWrite, Notification } from "../pages";

import {Header} from "../components";
import { Grid, Button } from "../elements";

import { useDispatch } from "react-redux";
import { actionCreators as userActions } from "../redux/modules/user";

import { apiKey } from "./firebase";
import { Route } from "react-router-dom";

import Permit from "./Permit";

function App() {
  const dispatch = useDispatch();

  const _session_key = `firebase:authUser:${apiKey}:[DEFAULT]`;
  const is_session = sessionStorage.getItem(_session_key) ? true : false;

  React.useEffect(() => {
    if (is_session) {
      dispatch(userActions.loginCheckFB());
    }
  }, []);

  return (
    <React.Fragment>
      <Grid>
        <ConnectedRouter history={history}>

          <Header></Header>
          <Route path="/" exact component={PostList} />
          <Route path="/login" exact component={Login} />
          <Route path="/signup" exact component={Signup} />
          <Route path="/write" exact component={PostWrite} />
          <Route path="/write/:id" exact component={PostWrite} />
          <Route path="/post/:id" exact component={PostDetail} />
          <Route path="/noti" exact component={Notification} />

        </ConnectedRouter>
      </Grid>
      <Permit>
        <Button
          is_float
          _onClick={() => {
            history.push("/write");
          }}
        >
          +
        </Button>
      </Permit>
    </React.Fragment>
  );
}

export default App;
