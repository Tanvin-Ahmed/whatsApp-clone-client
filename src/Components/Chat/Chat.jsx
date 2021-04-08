import { Avatar, IconButton } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import SearchIcon from "@material-ui/icons/Search";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import "./Chat.css";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import { infoContext } from "../../App";

const Chat = () => {
  const {
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
    const time = d.toLocaleTimeString();
    const date = d.toLocaleDateString();
    const exactTime = time + " " + date;
    const newMessage = {
      senderEmail: loggedInUser?.email,
      receiverEmail: loggedInUser?.receiverEmail || chatDetail.email,
      message: input,
      timesTamp: exactTime,
    };
    console.log(newMessage);
    if (loggedInUser?.receiverEmail || chatDetail.email) {
      fetch("http://localhost:5000/messages/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMessage),
      })
        .then((res) => {
          console.log("send successfully");
          chatListUpdate();
          specificChat();
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
        `http://localhost:5000/getSpecificConversation/${loggedInUser?.email}/${chatDetail?.email}`
      )
        .then((res) => res.json())
        .then((data) => {
          setMessages(data);
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    visualMessage && specificChat();
  }, [visualMessage]);

  return (
    <div className="chat">
      <div className="chat_header">
        <Avatar src={chatDetail.photoURL} />
        <div className="chat_headerInfo">
          <h3>{chatDetail.displayName}</h3>
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

      <div className="chat_body">
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
      </div>
      <div className="chat_footer">
        <IconButton>
          <InsertEmoticonIcon />
        </IconButton>
        <form>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Type a message"
          />
          <button onClick={sendMessage} type="submit">
            send a message
          </button>
        </form>
        <IconButton>
          <MicIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default Chat;