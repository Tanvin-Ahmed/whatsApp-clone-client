import React, { useContext, useState } from "react";
import "./Login.css";
import logo from "../../img/logo/whatsapp.png";
import { initializationLoginFramework, signInWithGoogle } from "./LoginManager";
import { useHistory, useLocation } from "react-router";
import { infoContext } from "../../App";

const Login = () => {
  initializationLoginFramework();
  const { setLoggedInUser } = useContext(infoContext);
  const history = useHistory();
  const location = useLocation();
  const { from } = location.state || { from: { pathname: "/" } };

  // set userInfo in local storage
  const handleStoreData = (res) => {
    const USER = {
      email: res.email,
      displayName: res.displayName,
      photoURL: res.photoURL,
    };
    localStorage.setItem("whatsapp/user", JSON.stringify(USER));
  };

  const handleGoogleSignIn = () => {
    signInWithGoogle().then((res) => {
      isOlderUser(res);
      setLoggedInUser(res);
      handleStoreData(res);
      history.replace(from);
    });
  };

  // check is old user..?
  const isOlderUser = (res) => {
    fetch("http://localhost:5000/getAllAccount")
      .then((res) => res.json())
      .then((accounts) => {
        const olderUser = accounts.find(
          (account) => account.email === res.email
        );
        if (olderUser) {
          setLoggedInUser(olderUser);
          handleStoreData(olderUser);
          console.log("find older user");
        } else {
          addUserDatabase(res);
        }
      });
  };

  // add user in database
  const addUserDatabase = (res) => {
    const userData = {
      displayName: res.displayName,
      email: res.email,
      photoURL: res.photoURL,
    };
    fetch("http://localhost:5000/createAccount", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })
      .then((res) => console.log("User Created successfully"))
      .catch((err) => console.log(err));
  };

  return (
    <div className=" g_signIn text-center">
      <img className="welcome_img" src={logo} alt="" />
      <h4 className="text-muted">Created by Tanvin Ahmed</h4>
      <p className="text-success mb-3">I believe in Privacy</p>
      <br />
      <button
        type="submit"
        onClick={handleGoogleSignIn}
        className="btn btn-outline-success"
      >
        SignIn with Google
      </button>
    </div>
  );
};

export default Login;
