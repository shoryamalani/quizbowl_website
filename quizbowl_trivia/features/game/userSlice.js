
import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: "user",
    initialState: {
        name: null,
        userToken: null,
    },
    reducers: {
        setName: (state, action) => {
            state.name = action.payload;
        },
        setUserToken: (state, action) => {
            state.userToken = action.payload;
        },
        resetUser(state){
            state.name = null;
            state.userToken = null;
        }
    }
});

export const { setName,setUserToken,resetUser } = userSlice.actions;

export default userSlice.reducer;