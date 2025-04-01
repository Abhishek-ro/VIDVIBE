import { createContext, useContext, useState, useEffect } from "react";
import { getUserId, getSubscribedChannels } from "../API/index.js";

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [userData, setUserData] = useState([]);
  const [sideBar, setSideBar] = useState(true);
  const [category, setCategory] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserId();
        const userList = await getSubscribedChannels(data?.data?.data?._id);
        setUserData(userList?.data?.data?.subscribedChannels);
      } catch (error) {
        console.error("Error fetching subscribed channels:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <SidebarContext.Provider
      value={{ sideBar, setSideBar, category, setCategory, userData }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export default function useSidebar() {
  return useContext(SidebarContext);
}
