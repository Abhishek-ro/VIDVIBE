import { createContext, useContext, useState, useEffect } from "react";
import { getUserId, getSubscribedChannels } from "../API/index.js";
import { useSnackbar } from "notistack";
const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [userData, setUserData] = useState([]);
  const [sideBar, setSideBar] = useState(true);
  const [category, setCategory] = useState(0);
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserId();
        const userList = await getSubscribedChannels(data?.data?.data?._id);
        setUserData(userList?.data?.data?.subscribedChannels);
      } catch (error) {
        enqueueSnackbar("Error fetching subscribed channels", {
          variant: "error",
        });
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
