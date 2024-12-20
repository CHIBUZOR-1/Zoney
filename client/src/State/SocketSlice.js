import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    socketId: null,
}

export const socketSlice = createSlice({
    name: 'socket',
    initialState,
    reducers: {
        close: (state) => {
            state.socketId = null
        },
        setSocketId: (state, action) => {
            state.socketId = action.payload
        },
    },
});

export const { setSocketId, close } = socketSlice.actions

export default socketSlice.reducer;