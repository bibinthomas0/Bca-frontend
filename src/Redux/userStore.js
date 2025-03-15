import UserRegdetails from "./User/UserRegdetails";
import { configureStore } from "@reduxjs/toolkit";
import authenticationSliceReducer from "./Authentication/AuthenticationSlice"


export default configureStore({
    reducer:{
        User_registration:UserRegdetails,
        authentication_user:authenticationSliceReducer,
    }
})