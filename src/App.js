import './App.css';
import Home from './Components/Home/Home';
import { BrowserRouter as Router, Switch, Route, useHistory, useLocation } from "react-router-dom";
import NoMatch from './Components/NoMatch/NoMatch';
import Chat from './Components/Chat/Chat';
import Welcome from './Components/Welcome/Welcome';
import { createContext, useEffect, useState } from 'react';
import Login from './Components/Login/Login';
import PrivateRoute from "./Components/PrivateRoute/PrivateRoute";

export const infoContext = createContext();

function App() {
  const [loggedInUser, setLoggedInUser] = useState({});
  const [screenSize, setScreenSize] = useState(null);
  const [AddFriend, setAddFriend] = useState(false);
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [chatList, setChatList] = useState([]);
  const [chatDetail, setChatDetail] = useState({});
  const [visualMessage, setVisualMessage] = useState(false);
  const [accountDetails, setAccountDetails] = useState([]);
  const [controlSidebarRender, setControlSidebarRender] = useState(false);
  const [controlChatForFirstRender, setControlChatForFirstRender] = useState(false);

  const getUserInfoFromLocalStorage = () => {
    const userInfo = localStorage.getItem("whatsapp/user") || JSON.stringify({ "user": "name" });
    setLoggedInUser(JSON.parse(userInfo));
  }
  useEffect(() => {
    setScreenSize(window.innerWidth);
    getUserInfoFromLocalStorage();
  }, []);

  // fetch for chat list
  const chatListUpdate = () => {
    fetch(`http://localhost:5000/getSpecificChatMessages/${loggedInUser.email}`)
      .then(res => res.json())
      .then(data => {
        setChatList(data);
      })
      .catch(err => console.log(err));
  }

  const getChatListFriendsDetails = () => {
    chatList.map((email) => {
      fetch(`http://localhost:5000/getOneAccount/${email}`)
        .then((res) => res.json())
        .then((details) => {
          setAccountDetails([...accountDetails, details]);
        })
        .catch((err) => console.log(err));
    });
  };
  return (
    <div className="App">
      <infoContext.Provider value={{
        screenSize, loggedInUser,
        setLoggedInUser, AddFriend,
        setAddFriend, loadingSpinner,
        setLoadingSpinner, getUserInfoFromLocalStorage,
        chatListUpdate, chatList,
        chatDetail, setChatDetail,
        visualMessage, setVisualMessage,
        accountDetails, setAccountDetails,
        getChatListFriendsDetails,
        controlSidebarRender, setControlSidebarRender,
        controlChatForFirstRender, setControlChatForFirstRender
      }}>
        <Router>
          {
            screenSize >= 767 ?
              (<Switch>
                <PrivateRoute exact path="/">
                  <Welcome />
                </PrivateRoute>
                <Route path="/login">
                  <Login />
                </Route>
                <PrivateRoute path="/home">
                  <Home />
                </PrivateRoute>
                <Route path="*">
                  <NoMatch />
                </Route>
              </Switch>) : (<Switch>
                <PrivateRoute exact path="/">
                  <Home />
                </PrivateRoute>
                <Route path="/login">
                  <Login />
                </Route>
                <PrivateRoute path="/chat/email">
                  <Chat />
                </PrivateRoute>
                <Route path="*">
                  <NoMatch />
                </Route>
              </Switch>)
          }
        </Router>
      </infoContext.Provider>
    </div>
  );
}

export default App;
