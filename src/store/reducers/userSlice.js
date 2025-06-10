import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: null,
  userName: null,
  firstName: null,
  lastName: null,
  country: null,
  role: null,
  id: null,
  email: null,
  profileId: null,
  photo: null,
  gender: "male",
  maritalStatus: "Single",
  houseHold: "more-than-5",
  ownCar: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const userData = action.payload;
      return {
        ...state,
        ...userData,
      };
    },
    clearUser: () => initialState,
    updateUserField: (state, action) => {
      const { field, value } = action.payload;
      // Ensure we're creating a new state object for Redux to detect the change
      return {
        ...state,
        [field]: value,
      };
    },
  },
});

export const selectUser = (state) => state.user;

export const { setUser, clearUser, updateUserField } = userSlice.actions;
export default userSlice.reducer;
