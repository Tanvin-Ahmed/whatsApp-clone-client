import React, { useContext, useState } from "react";
import "./Home.css";

import { Link, Route, Switch, useRouteMatch } from "react-router-dom";
import Chat from "../Chat/Chat";
import ChatBar from "../ChatBar/ChatBar";
import { infoContext } from "../../App";
import AddNewChat from "../AddNewChat/AddNewChat";

const Home = () => {
  const { screenSize, AddFriend } = useContext(infoContext);
  const { path } = useRouteMatch();
  return (
    <div className="home ">
      {
        AddFriend && <AddNewChat />
      }
      <div className="row">
        <div className="col-md-4 col-sm-12 pr-0">
          <ChatBar />
        </div>
        <div className="col-md-8 col-sm-12 pl-0">
          {screenSize <= 767 ? (
            <Switch>
              <Route path="/chat/email">
                <Chat />
              </Route>
            </Switch>
          ) : (
            <Switch>
              <Route path={`${path}/chat/email`}>
                <Chat />
              </Route>
            </Switch>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
