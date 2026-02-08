import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import uiReducer from "./slices/uiSlice.js"
const store = configureStore( {
    reducer: {
        auth : authReducer,
        ui : uiReducer,
    }
});

export default store;