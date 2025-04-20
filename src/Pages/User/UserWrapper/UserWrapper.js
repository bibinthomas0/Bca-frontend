import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Login from "../Auth/Login";
import Register from "../Auth/Register";
import { Route, Routes } from "react-router-dom";
import LoginNav from "../../../Components/Navbar/LoginNav";
import OtpVerification from "../../InBoth/OtpVerification";
import HomePage from "../Home/HomePage";
import Seller_product from "../Home/Seller_product";
import BuyerHomePage from "../Buyer/BuyerHomePage";
import BuyerCart from "../Buyer/BuyerCart";
import BuyerOrders from "../Buyer/Buyerorders";
import BuyerEnquiry from "../Buyer/BuyerEnquiry";
import SellerEnquiry from "../Home/Sellerenquiry";
import apiClient from "../Auth/AxiosInstance"
import Adminsellers from "../Admin/AdminSellers"
import AdminBuyers from "../Admin/Adminbuyers";
import Profile from "../Home/ProfilePage"
import BuyerProfile from "../Buyer/BuyerProfile";
import BuyerHelpAndSupport from "../Buyer/BuyerHelpAndSupport";
import HelpAndSupport from "../Home/HelpAndSupport";
import AdminHelpAndSupport from "../Admin/AdminHelpAndSupport";
import BuyerWishlist from "../Buyer/BuyerWishlist";

const UserWrapper = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/");
        return;
      }

      try {
        await apiClient.get("http://127.0.0.1:8000/api/validate-token/", );
      } catch (error) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh");
        navigate("/");
      }
    };

    validateToken();
  }, [navigate]);

  return (
    <>
      <LoginNav />
      <Routes>
      <Route path="/buyer/profile" element={<BuyerProfile />} />
      <Route path="/seller/profile" element={<Profile />} />
        <Route path="/buyer/home" element={<BuyerHomePage />} />
        <Route path="/buyer/cart" element={<BuyerCart />} />
        <Route path="/buyer/orders" element={<BuyerOrders />} />
        <Route path="/admin/home" element={<Adminsellers />} />
        <Route path="/admin/buyers" element={<AdminBuyers />} />
        <Route path="/buyer/enquiries" element={<BuyerEnquiry />} />
        <Route path="/seller/home" element={<HomePage />} />
        <Route path="/seller/product" element={<Seller_product />} />
        <Route path="/seller/enquiries" element={<SellerEnquiry />} />
        <Route path="/buyer/help" element={<BuyerHelpAndSupport />} />
        <Route path="/seller/help" element={<HelpAndSupport />} />
        <Route path="/admin/help" element={<AdminHelpAndSupport />} />
        <Route path="/buyer/wishlist" element={<BuyerWishlist />} />
      </Routes>
    </>
  );
};

export default UserWrapper;
