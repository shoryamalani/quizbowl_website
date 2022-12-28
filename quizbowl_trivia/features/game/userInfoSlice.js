import { createSlice } from "@reduxjs/toolkit";

export const userInfo = createSlice({
    name: "userInfo",
    initialState: {
        name: null,
        userToken: null,
        userId: null,
    },
    reducers: {
        setName: (state, action) => {
            state.name = action.payload;
        },
        setUserToken: (state, action) => {
            state.userToken = action.payload;
        },
        setUserID: (state, action) => {
            state.userId = action.payload;
        },
        resetUser(state){
            state.name = null;
            state.userToken = null;
            state.userId = null;
        }
    }
});

export const { setName,setUserToken,setUserID,resetUser } = userInfo.actions;