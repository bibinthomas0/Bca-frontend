import React from "react";
import Login from "../Auth/Login";
import Register from "../Auth/Register";
import { Route,Routes } from "react-router-dom";
import LoginNav from "../../../Components/Navbar/LoginNav";
import OtpVerification from "../../InBoth/OtpVerification";
import UNavbar from "../UserNav/UNavbar";
import Interests from "../interfaceUi/Interests";
import HomePage from "../Home/HomePage";
import Seller_product from "../Home/Seller_product"
import BuyerHomePage from "../Buyer/BuyerHomePage"
import BuyerCart from "../Buyer/BuyerCart"
import BuyerOrders from "../Buyer/Buyerorders"
import BuyerEnquiry from "../Buyer/BuyerEnquiry"
import SellerEnquiry from "../Home/Sellerenquiry"
function UserWrapper() {
  return (
    <> 
      <LoginNav />
      <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="register" element={<Register/>}/> 
        <Route path="/buyer/home" element={<BuyerHomePage/>}/>
        <Route path="/buyer/cart" element={<BuyerCart/>}/>
        <Route path="/buyer/orders" element={<BuyerOrders/>}/>
        <Route path="/buyer/enquiries" element={<BuyerEnquiry/>}/>
        <Route path="/seller/home" element={<HomePage/>}/>
        <Route path="/seller/product" element={<Seller_product/>}/>
        <Route path="/seller/enquiries" element={<SellerEnquiry/>}/>
      </Routes>
     
    </>
  )
}

export default UserWrapper;
