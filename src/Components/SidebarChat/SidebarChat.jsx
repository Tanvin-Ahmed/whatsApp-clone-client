import { Avatar, CardActionArea } from "@material-ui/core";
import React, { useContext, useEffect } from "react";
import { useRouteMatch } from "react-router";
import { Link } from "react-router-dom";
import { infoContext } from "../../App";
import "./SidebarChat.css";
import AddIcon from "@material-ui/icons/Add";
import ChatForFirst from "../ChatForFirst/ChatForFirst";

const SidebarChat = ({ addNewChat }) => {
  const {
    screenSize,
    setAddFriend,
    chatListUpdate,
    chatList,
    setChatDetail,
    setVisualMessage,
    accountDetails,
    getChatListFriendsDetails,
    setAccountDetails,
  } = useContext(infoContext);
  const { url } = useRouteMatch();

  useEffect(() => {
    setAccountDetails([]);
    chatListUpdate();
    getChatListFriendsDetails();
  }, [chatList[0]]);

  return !addNewChat ? (
    <div>
      <ChatForFirst />
      <hr />
      <hr />
      <small className="text-muted">Friend List</small>
      {accountDetails
        .filter((c, index) => {
          return accountDetails.indexOf(c) === index;
        })
        .map((details) => (
          <div
            onClick={() => {
              setChatDetail(details);
              setVisualMessage(true);
            }}
          >
            {console.log(details)}
            <CardActionArea>
              <Link
                to={screenSize >= 767 ? `${url}/chat/email` : "/chat/email"}
                className="link"
              >
                <div className="friend py-2 d-flex align-items-center">
                  <Avatar src={details.photoURL} />
                  <div className="detail">
                    <h5>{details.displayName}</h5>
                    <h6 className="text-muted">Last message.....</h6>
                  </div>
                </div>
              </Link>
            </CardActionArea>
            <hr />
          </div>
        ))}
    </div>
  ) : (
    <CardActionArea>
      <div onClick={() => setAddFriend(true)} className="sidebarChat">
        <h3>
          <AddIcon />
          Add New Chat
        </h3>
      </div>
    </CardActionArea>
  );
};

export default SidebarChat;
