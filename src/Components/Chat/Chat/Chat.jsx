import { Avatar, CardActionArea, IconButton } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import SearchIcon from "@material-ui/icons/Search";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import "./Chat.css";
import MicIcon from "@material-ui/icons/Mic";
import { infoContext } from "../../../App";
import Pusher from "pusher-js";
import ScrollToBottom from 'react-scroll-to-bottom';
import { css } from '@emotion/css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import InputEmoji from "react-input-emoji";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { Spinner } from "react-bootstrap";
import { useHistory } from "react-router";
import CloseIcon from '@material-ui/icons/Close';

const ROOT_CSS = css({
  height: '100%',
  width: '100%',
});


const Chat = () => {
  const {
    screenSize,
    loggedInUser,
    chatListUpdate,
    visualMessage,
    setVisualMessage,
    controlSidebarRender,
    setControlSidebarRender
  } = useContext(infoContext);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [btnOpen, setBtnOpen] = useState(false);
  const [deleteSpinner, setDeleteSpinner] = useState(false);
  const [chatDetail, setChatDetail] = useState({});
  const history = useHistory();
  const [openSearchField, setOpenSearchField] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const friendData = JSON.parse(sessionStorage.getItem('friend'));
    setChatDetail(friendData);
    if (friendData?.email !== chatDetail?.email) {
      setVisualMessage(!visualMessage);
    } else {
      specificChat();
    }
    console.log(visualMessage)
  }, [visualMessage]);

  useEffect(() => {
    setVisualMessage(!visualMessage);
  }, [])

  // send message
  const sendMessage = () => {
    const d = new Date();
    const time = d.toLocaleString();
    const newMessage = {
      senderEmail: loggedInUser?.email,
      receiverEmail: loggedInUser?.receiverEmail || chatDetail?.email,
      message: input,
      timesTamp: time,
    };
    if (loggedInUser?.receiverEmail || chatDetail?.email) {
      fetch("https://secure-hamlet-09623.herokuapp.com/messages/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMessage),
      })
        .then((res) => {

          setVisualMessage(false);

        })
        .catch((err) => console.log(err));
    }
    setInput("");
  };

  // get specific conversation
  const specificChat = () => {
    console.log(chatDetail)
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

  // get update messages using pusher
  useEffect(() => {
    const pusher = new Pusher('9612bf90f1abfb61828b', {
      cluster: 'ap2'
    });
    const channel = pusher.subscribe('messages');
    channel.bind('inserted', (newMessages) => {
      specificChat();
      setMessages([...messages, newMessages]);
      console.log(controlSidebarRender)
      controlSidebarRender && chatListUpdate();
      setControlSidebarRender(false);
    });
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    }
  }, [messages]);


  // delete conversation
  const handleConversationDelete = (userEmail, friendEmail) => {
    if (friendEmail) {
      setDeleteSpinner(true);
      const conversation = {
        userEmail: userEmail,
        friendEmail: friendEmail
      }
      fetch('https://secure-hamlet-09623.herokuapp.com/clearConversation', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation })
      })
        .then(res => res.json())
        .then(data => {
          alert('Conversation deleted');
          chatListUpdate();
          setDeleteSpinner(false);
          specificChat();
          setChatDetail({})
          screenSize > 767 ? history.push('/home/chat') : history.push('/')
        })
        .catch(err => {
          alert('Delete was not successful. Please try again');
          setDeleteSpinner(false);
        });
    } else {
      alert('Please select Conversation');
    }
  }

  return (
    <div className="chat">
      <div className="chat_header">
        <Avatar src={chatDetail?.photoURL} />
        <div className="chat_headerInfo">
          <h6>{chatDetail?.displayName}</h6>
          <p>Last seen at...</p>
        </div>
        <div className="chat_headerRight d-flex align-items-center flex-wrap">
          <div className="chat_search">
            <IconButton onClick={() => setOpenSearchField(true)}>
              <SearchIcon />
            </IconButton>
            {openSearchField && (<div className="chat_searchBox d-flex align-items-center justify-between">
              <input onChange={(e) => setSearchTerm(e.target.value)} type="text" placeholder="Search message" />
              <div onClick={() => setOpenSearchField(false)} className="close_btn">
                <IconButton>
                  <CloseIcon />
                </IconButton>
              </div>
            </div>)
            }
          </div>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <div onClick={() => setBtnOpen(!btnOpen)} className="chat_more_btn">
            <IconButton>
              <MoreVertIcon />
            </IconButton>
            {btnOpen && <div className="options">
              <div onClick={() => handleConversationDelete(loggedInUser?.email, chatDetail?.email)} className="delete">
                <CardActionArea>
                  <div className="d-flex align-items-center justify-content-around p-2 text-danger">
                    <h6>Delete Conversation</h6>
                    <DeleteForeverIcon />
                  </div>
                </CardActionArea>
              </div>
            </div>}
          </div>
        </div>
      </div>


      <ScrollToBottom className={`${ROOT_CSS} chat_body`}>

        {messages.filter((val) => {
          if (searchTerm === "") {
            return val;
          } else if (
            val.message.toLowerCase().includes(searchTerm.toLowerCase())
          ) {
            return val;
          }
        }).map((message) => (
          <p
            className={
              message.senderEmail === loggedInUser?.email
                ? "chat_message chat_receiver"
                : "chat_message"
            }
          >
            <span className="chat_name">
              {message.senderEmail === loggedInUser?.email
                ? loggedInUser?.displayName
                : chatDetail?.displayName}
            </span>
            {message.message}
            <span className="chat_timestamp">{message.timesTamp}</span>
          </p>
        ))}
      </ScrollToBottom>

      {
        deleteSpinner && <div className="text-center">
          <Spinner animation="grow" variant="danger" size="sm" /> {' '}
          <Spinner animation="grow" variant="danger" size="sm" /> {' '}
          <Spinner animation="grow" variant="danger" size="sm" /> {' '}
        </div>
      }

      <div className="chat_footer">
        <div className="form d-flex align-items-center">
          {screenSize > 767 ?
            <InputEmoji
              value={input}
              onChange={setInput}
              cleanOnEnter
              onEnter={sendMessage}
              placeholder="Type a message"
            /> : <InputEmoji
              value={input}
              onChange={setInput}
              placeholder="Type a message"
            />
          }
          <div>
            {input && <button className="ml-2 btn btn-outline-success rounded-circle" onClick={sendMessage} type="button">
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>}
          </div>
        </div>
        <IconButton>
          <MicIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default Chat;