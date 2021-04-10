import { Avatar, CardActionArea } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
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
    chatList,
    setChatDetail,
    setVisualMessage,
    accountDetails,
    getChatListFriendsDetails,
    setAccountDetails,
  } = useContext(infoContext);
  const { url } = useRouteMatch();
  const [friendList, setFriendList] = useState([]);


  useEffect(() => {
    setAccountDetails([]);
    getChatListFriendsDetails();
  }, [chatList[0]]);

  useEffect(() => {
    const removeDuplicate = [...new Set(accountDetails)];
    setFriendList(removeDuplicate);
  }, [accountDetails]);

  console.log(friendList);

  return !addNewChat ? (
    <div>
      <ChatForFirst />
      <hr />
      <hr />
      <small className="text-muted">Friend List</small>
      {friendList.map((details) => (
        <div
          onClick={() => {
            setChatDetail(details);
            setVisualMessage(true);
          }}
        >
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
