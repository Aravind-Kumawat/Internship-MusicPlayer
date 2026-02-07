import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    token: localStorage.getItem("token") || null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        //set loading state during API calls(login, register, fetchUser)
        setLodaing: (state, action) => {
            state.isLoading = action.payload;
            state.error = null;
        },
        //set user after successfull login/register/fetchuser
        //also store token in localStorage for persistance
        setUser : (state,action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true,
            state.isLoading = false;
            state.error = null;

            if(action.payload.token){
                localStorage.setItem("token",action.payload.token);
            }
        },
        setError  :(state,action) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        //logout : clear all state and remove token from localStorage
        logout : (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
            localStorage.removeItem("token");
        },
        updateFavourites : (state, action) => {
            if(state.user){
                state.user.favourites = action.payload;
            }
        },
        clearError : (state) => {
            state.error = null;
        }
    },
});

export const {setLodaing,setUser,setError,logout,updateFavourites,clearError} = authSlice.actions;

export default authSlice.reducer;