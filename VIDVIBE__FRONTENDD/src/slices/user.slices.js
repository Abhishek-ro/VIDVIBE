import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  _id: "",
  username: "",
  email: "",
  fullName: "",
  isAuth: false,
};

const useSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { _id, username, fullName, email } = action.payload;
      state._id = _id;
      state.username = username;
      state.email = email;
      state.fullName = fullName;
      state.isAuth = true;
    },
    removeUser: (state) => {
      state._id = ""
      state.username = ""
      state.email = ""
      state.fullName = ""
      state.isAuth = false;
    },
  },
});


export const {setUser,removeUser}= useSlice.action
export default useSlice.reducer