import { Avatar, CardActionArea } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { Link, useRouteMatch } from "react-router-dom";
import { infoContext } from "../../App";
import "./ChatForFirst.css";

const ChatForFirst = () => {
  const { url } = useRouteMatch();
  const {
    screenSize,
    loggedInUser,
    setChatDetail,
    setControlSidebarRender
  } = useContext(infoContext);

  // get new friend info
  const newChatDetails = (user) => {
    const userInfo = {
      displayName: user.receiverName,
      photoURL: user.receiverPhotoURL,
      email: user.receiverEmail
    };
    setChatDetail(userInfo);
  }


  // handle click
  const handleClick = () => {
    newChatDetails(loggedInUser);
    setControlSidebarRender(true);
  }

  return (
    <div>
      <CardActionArea>
        <Link
          onClick={handleClick}
          to={screenSize >= 767 ? `${url}/chat/email` : "/chat/email"}
          className="link"
        >
          <div className="friend py-2 d-flex align-items-center">
            <Avatar src={loggedInUser.receiverPhotoURL} />
            <div className="detail">
              <h5>{loggedInUser.receiverName || <small className="text-muted">chosen id name</small>}</h5>
            </div>
          </div>
        </Link>
      </CardActionArea>
    </div>
  );
};

export default ChatForFirst;
