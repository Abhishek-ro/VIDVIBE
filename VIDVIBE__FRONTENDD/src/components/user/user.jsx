import UserLibrary from "./UserLibrary.jsx"; // Import the new component
import UserData from "./UserData.jsx";
import { SideBar } from "../../components/SideBar/SideBar.jsx";

const User = ({ sideBar, category, setCategory }) => {
  return (
    <>
      <SideBar
        sideBar={sideBar}
        category={category}
        setCategory={setCategory}
      />
      <div className="user-container">
        <div>
          <UserData />
        </div>
        <div className="content">
          <UserLibrary />
        </div>
      </div>
    </>
  );
};

export default User;
