import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userId: "",
    firstname: "",
    lastname: "",
    email: "",
    age: "",
    gender: "",
    profilePic: "",
    coverImage: "",
    onlineUser: [],
}

export const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.userId = action.payload.id
            state.firstname = action.payload.firstname
            state.lastname = action.payload.lastname
            state.email = action.payload.email
            state.age = action.payload.age
            state.gender = action.payload.gender
            state.profilePic = action.payload.profilePic
            state.coverImage = action.payload.coverImage
        },
        logout: (state) => {
            state.userId = ""
            state.firstname = ""
            state.lastname = ""
            state.email = ""
            state.age = ""
            state.gender = ""
            state.profilePic = ""
            state.coverImage = ""
        },
        setOnlineUser: (state, action) => {
            state.onlineUser = action.payload
        },
    },
});

export const { setUser, logout, setOnlineUser } = userSlice.actions

export default userSlice.reducer;