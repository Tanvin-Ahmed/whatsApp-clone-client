import { Avatar, IconButton } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import SearchIcon from "@material-ui/icons/Search";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import "./Chat.css";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import { infoContext } from "../../App";
import Pusher from "pusher-js";
import ScrollToBottom from 'react-scroll-to-bottom';
import { css } from '@emotion/css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const ROOT_CSS = css({
  height: '100%',
  width: '100%',
});


const Chat = () => {
  const {
    screenSize,
    loggedInUser,
    chatListUpdate,
    chatDetail,
    visualMessage,
    setVisualMessage,
    getChatListFriendsDetails,
    controlSidebarRender,
    setControlChatForFirstRender,
  } = useContext(infoContext);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);



  const sendMessage = (e) => {
    e.preventDefault();

    const d = new Date();
    const time = d.toLocaleString();
    const newMessage = {
      senderEmail: loggedInUser?.email,
      receiverEmail: loggedInUser?.receiverEmail || chatDetail.email,
      message: input,
      timesTamp: time,
    };
    console.log(newMessage);
    if (loggedInUser?.receiverEmail || chatDetail.email) {
      fetch("https://secure-hamlet-09623.herokuapp.com/messages/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMessage),
      })
        .then((res) => {
          console.log("send successfully");
          chatListUpdate();
          setVisualMessage(false);
          controlSidebarRender && getChatListFriendsDetails();
          setControlChatForFirstRender(false);
        })
        .catch((err) => console.log(err));
    }

    setInput("");
  };

  // get specific conversation
  const specificChat = () => {
    if (chatDetail !== {}) {
      fetch(
        `https://secure-hamlet-09623.herokuapp.com/getSpecificConversation/${loggedInUser?.email}/${chatDetail?.email}`
      )
        .then((res) => res.json())
        .then((data) => {
          setMessages(data);
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    const pusher = new Pusher('9612bf90f1abfb61828b', {
      cluster: 'ap2'
    });
    const channel = pusher.subscribe('messages');
    channel.bind('inserted', (newMessages) => {
      specificChat();
      setMessages([...messages, newMessages])
    });
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    }
  }, [messages]);

  useEffect(() => {
    visualMessage && specificChat();
  }, [visualMessage, chatDetail]);

  return (
    <div className="chat">
      <div className="chat_header">
        <Avatar src={chatDetail.photoURL} />
        <div className="chat_headerInfo">
          <h6>{chatDetail.displayName}</h6>
          <p>Last seen at...</p>
        </div>
        <div className="chat_headerRight">
          <IconButton>
            <SearchIcon />
          </IconButton>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>

      <ScrollToBottom className={`${ROOT_CSS} chat_body`}>
        {messages.map((message) => (
          <p
            className={
              message.senderEmail === loggedInUser.email
                ? "chat_message chat_receiver"
                : "chat_message"
            }
          >
            <span className="chat_name">
              {message.senderEmail === loggedInUser.email
                ? loggedInUser.displayName
                : chatDetail.displayName}
            </span>
            {message.message}
            <span className="chat_timestamp">{message.timesTamp}</span>
          </p>
        ))}
      </ScrollToBottom>
      <div className="chat_footer">
        <IconButton>
          <InsertEmoticonIcon />
        </IconButton>
        <form className="d-flex align-items-center">
          <textarea
            cols="30"
            rows="2"
            className="form-control"
            id="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Type a message"
          ></textarea>
          <div>
            <button className="ml-2 btn btn-outline-success rounded-circle" onClick={sendMessage} type="button">
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>
        </form>
        <IconButton>
          <MicIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default Chat;
