import React from "react";
import { Link } from "react-router-dom";
import "./Welcome.css";
import logo from "../../img/logo/whatsapp.png";

const Welcome = () => {
  return (
    <div className="welcome text-center">
      <img className="welcome_img" src={logo} alt="" />
      <h2 className="welcome_text">Welcome to WhatsApp Clone</h2>
      <h5 className="authority">Created by Tanvin Ahmed</h5>
      <Link to="/home" className="btn btn-outline-success">
        Start Now
      </Link>
    </div>
  );
};

export default Welcome;
