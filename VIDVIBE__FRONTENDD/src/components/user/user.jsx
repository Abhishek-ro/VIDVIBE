import React from "react";
import { SideBar } from "../SideBar/SideBar.jsx";
import UserLibrary from "./UserLibrary.jsx"; // Import the new component

const User = () => {
  return (
    <div className="user-container">
  
      <div className="content">
        <UserLibrary />
      </div>
    </div>
  );
};

export default User;
