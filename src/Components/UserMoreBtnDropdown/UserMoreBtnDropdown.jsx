import { CardActionArea } from "@material-ui/core";
import React, { useContext, useState } from "react";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import "./UserMoreBtnDropdown.css";
import { infoContext } from "../../App";

const UserMoreBtnDropdown = () => {
  const { setLoggedInUser } = useContext(infoContext);
  const handleLogOut = () => {
    localStorage.removeItem("whatsapp/user");
    setLoggedInUser({});
  };
  return (
    <div>
      <CardActionArea>
        <div
          onClick={handleLogOut}
          className="d-flex justify-content-around align-items-center p-1"
        >
          <h6>Log Out</h6>
          <ExitToAppIcon />
        </div>
      </CardActionArea>
    </div>
  );
};

export default UserMoreBtnDropdown;
