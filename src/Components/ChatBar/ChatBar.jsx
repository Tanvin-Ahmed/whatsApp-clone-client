import "./ChatBar.css";
import { Avatar, IconButton } from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import MicIcon from "@material-ui/icons/Mic";
import SidebarChat from "../SidebarChat/SidebarChat";
import { useContext, useEffect, useState } from "react";
import { infoContext } from "../../App";
import UserMoreBtnDropdown from "../UserMoreBtnDropdown/UserMoreBtnDropdown";

const ChatBar = () => {
  const { loggedInUser, chatListUpdate } = useContext(infoContext);
  const [moreOption, setMoreOption] = useState(false);

  useEffect(() => {
    chatListUpdate();
  }, []);
 

  return (
    <div className="side_bar">
      <div className="side_bar_header pb-5 pl-2 pt-2">
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <Avatar src={loggedInUser.photoURL} />
          <div className="icons">
            <IconButton>
              <DonutLargeIcon />
            </IconButton>
            <IconButton>
              <ChatIcon />
            </IconButton>
            <div
              onClick={() => setMoreOption(!moreOption)}
              className="more_btn"
            >
              <IconButton>
                <MoreVertIcon />
              </IconButton>
            </div>
            {moreOption && (
              <div className="dropdown_menu rounded">
                <UserMoreBtnDropdown />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-center align-items-center side_bar_search">
        <div className="side_bar_search-box">
          <IconButton>
            <MicIcon />
          </IconButton>
          <input type="text" />
        </div>
      </div>
      <div className="py-5 px-2 friend_list">
        <SidebarChat addNewChat />

        <SidebarChat/>
      </div>
    </div>
  );
};

export default ChatBar;
