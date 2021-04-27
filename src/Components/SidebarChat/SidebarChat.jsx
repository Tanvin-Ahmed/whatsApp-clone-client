import { Avatar, CardActionArea } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { useRouteMatch } from "react-router";
import { Link } from "react-router-dom";
import { infoContext } from "../../App";
import "./SidebarChat.css";
import AddIcon from "@material-ui/icons/Add";
import ChatForFirst from "../ChatForFirst/ChatForFirst";
import MicIcon from "@material-ui/icons/Mic";
import { IconButton } from "@material-ui/core";

const SidebarChat = ({ addNewChat }) => {
  const {
    screenSize,
    setAddFriend,
    chatList,
    visualMessage,
    setVisualMessage,
    accountDetails,
    setAccountDetails,
  } = useContext(infoContext);
  const { url } = useRouteMatch();
  const [friendList, setFriendList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');


  useEffect(() => {
    setAccountDetails([]);
  }, [chatList]);


  useEffect(() => {
    const removeDuplicate = [...new Set(accountDetails)];
    setFriendList(removeDuplicate);
  }, [accountDetails]);


  const handleClick = (details) => {
    sessionStorage.setItem('friend', JSON.stringify(details));
    setVisualMessage(!visualMessage);
  }

  return !addNewChat ? (
    <div>
      <ChatForFirst />
      <hr />
      <div className="d-flex justify-content-center align-items-center side_bar_search">
        <div className="side_bar_search-box">
          <IconButton>
            <MicIcon />
          </IconButton>
          <input onChange={(e) => setSearchTerm(e.target.value)} className="text-muted" type="text" placeholder="Find friend...." />
        </div>
      </div>
      <hr />
      <small className="text-muted">Friend List</small>
      <div>
          {friendList.filter((val) => {
                if (searchTerm === "") {
                  return val;
                } else if (
                  val.displayName.toLowerCase().includes(searchTerm.toLowerCase())
                ) {
                  return val;
                }
              }).map((details) => (
            <div
              onClick={() => handleClick(details)}
            >
              <CardActionArea>
                <Link
                  to={screenSize > 767 ? `${url}/chat/email` : "/chat/email"}
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
