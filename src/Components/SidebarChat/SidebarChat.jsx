import { Avatar, CardActionArea } from "@material-ui/core";
import React, { memo, useContext, useEffect, useState } from "react";
import { useRouteMatch } from "react-router";
import { Link } from "react-router-dom";
import { infoContext } from "../../App";
import "./SidebarChat.css";
import AddIcon from "@material-ui/icons/Add";
import ChatForFirst from "../ChatForFirst/ChatForFirst";
import { Spinner } from "react-bootstrap";

const SidebarChat = ({ addNewChat }) => {
  const {
    screenSize,
    setAddFriend,
    chatList,
    setChatDetail,
    setVisualMessage,
    accountDetails,
    setAccountDetails,
    loadingSpinner,
  } = useContext(infoContext);
  const { url } = useRouteMatch();
  const [friendList, setFriendList] = useState([]);


  useEffect(() => {
    setAccountDetails([]);
  }, [chatList]);


  useEffect(() => {
    const removeDuplicate = [...new Set(accountDetails)];
    setFriendList(removeDuplicate);
  }, [accountDetails]);


  const handleClick = (details) => {
    // sessionStorage.setItem('friend', JSON.stringify(details));
    setVisualMessage(true);
    setChatDetail(details);
  }

  return !addNewChat ? (
    <div>
      <ChatForFirst />
      <hr />
      <hr />
      <small className="text-muted">Friend List</small>
      { loadingSpinner ? <div>
        <Spinner animation="grow" variant="primary" />{' '}
        <Spinner animation="grow" variant="secondary" />{' '}
        <Spinner animation="grow" variant="success" />
      </div>
        : <div>
          {friendList.map((details) => (
            <div
              onClick={() => handleClick(details)}
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
        </div>}
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
