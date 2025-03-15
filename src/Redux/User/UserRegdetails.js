import {createSlice} from '@reduxjs/toolkit'


export const UserRegDetailsSlice = createSlice(

    {
        name:"user_registration",
        initialState:{
            name:null,
            username:null,
            email:null,
            dob:null,
            password:null,
            otp:null
        },
        reducers:{
            setUser_registration: (state,action)=>{
                state.name = action.payload.name;
                state.username = action.payload.username;
                state.email = action.payload.email;
                state.dob = action.payload.dob;
                state.password = action.payload.password;
                state.otp = action.payload.otp
            }
        }



    }
)

export const {setUser_registration} =  UserRegDetailsSlice.actions

export default UserRegDetailsSlice.reducer