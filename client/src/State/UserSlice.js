import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    onlineUser: [],
    chatUsers: [],
    groupChats: [],
}

export const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
        logout: (state) => {
            state.user = null;
        },
        setOnlineUser: (state, action) => {
            state.onlineUser = action.payload
        },
        updateProfilePic: (state, action) => { 
            if (state.user) { 
                state.user.profilePic = action.payload; 
            } 
        },
        updateCoverPhoto: (state, action) => { 
            if (state.user) { 
                state.user.coverImage = action.payload; 
            } 
        },
        updateProfilez: (state, action) => { 
            if (state.user) { 
                state.user.firstname = action.payload.firstname;
                state.user.lastname = action.payload.lastname; 
                state.user.gender = action.payload.gender; 
                state.user.age = action.payload.age; 
            } 
        },
        setChatUsers: (state, action) => { 
            // Add this reducer 
            state.chatUsers = action.payload; 
        },
        setGroupChats: (state, action) => { 
            state.groupChats = action.payload; // Add this reducer 
        },
    },
});

export const { setUser, setGroupChats, logout, setChatUsers, setOnlineUser, updateProfilePic, updateCoverPhoto, updateProfilez } = userSlice.actions

export default userSlice.reducer;