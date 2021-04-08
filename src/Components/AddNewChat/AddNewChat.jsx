import React, { useContext, useEffect, useState } from "react";
import "./AddNewChat.css";
import CloseIcon from "@material-ui/icons/Close";
import { Avatar, CardActionArea, IconButton } from "@material-ui/core";
import { infoContext } from "../../App";

const AddNewChat = () => {
  const {
    loggedInUser,
    setLoggedInUser,
    setAddFriend,
    loadingSpinner,
    setLoadingSpinner,
    setControlChatForFirstRender
  } = useContext(infoContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [userList, setUSerList] = useState([]);
  useEffect(() => {
    setLoadingSpinner(true);
    fetch("http://localhost:5000/getAllAccount")
      .then((res) => res.json())
      .then((accounts) => {
        const accountWithoutUser = accounts.filter(
          (account) => account.email !== loggedInUser.email
        );
        setUSerList(accountWithoutUser);
        setLoadingSpinner(false);
      })
      .catch((err) => console.log(err));
  }, [setLoadingSpinner, loggedInUser.email]);

  const receiverInfo = (receiverInfo) => {
    const receiverDetails = { ...loggedInUser };
    receiverDetails.receiverEmail = receiverInfo.email;
    receiverDetails.receiverName = receiverInfo.displayName;
    receiverDetails.receiverPhotoURL = receiverInfo.photoURL;
    console.log(receiverDetails);
    setLoggedInUser(receiverDetails);
  };

  return (
    <div className="new_chat">
      <div className="header mb-4">
        <div onClick={() => {
          setAddFriend(false);
          }} className="close_btn">
          <IconButton>
            <CloseIcon />
          </IconButton>
        </div>
        <h5 className="text-muted">Add New Friend</h5>
        <input
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control"
          type="text"
          placeholder="search Name"
        />
      </div>
      <div className="search_result">
        {loadingSpinner && "Load Data...."}
        {userList
          .filter((val) => {
            if (searchTerm === "") {
              return "";
            } else if (
              val.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
            ) {
              return val;
            }
          })
          .map((user) => (
            <CardActionArea>
              <div
                onClick={() => {
                  receiverInfo(user);
                  setControlChatForFirstRender(true);
                }}
                className="account"
              >
                <div className="avatar">
                  <Avatar src={user.photoURL} />
                </div>
                <div className="name ml-3">
                  <h6>{user.displayName}</h6>
                </div>
              </div>
            </CardActionArea>
          ))}
      </div>
    </div>
  );
};

export default AddNewChat;
