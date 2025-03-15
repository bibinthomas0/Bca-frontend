import React from "react";
import LoginNav from "../../../Components/Navbar/LoginNav";
import { Route,Routes } from "react-router-dom";
import AdminLogin from "../AdminLogin";
import Adminregister from "../Adminregister";
import UserList from "../AdminUsers/UserList";


function AdminWrapper() {
  return (
    <>
    <LoginNav/>
    <Routes>
    <Route path="login" element={<AdminLogin/>}/>
    <Route path="signup" element={<Adminregister/>}/>
    <Route path="users" element={<UserList/>}/>
    </Routes>
</>
  );
}

export default AdminWrapper;
