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
        <Route path="/buyer/home" element={<BuyerHomePage />} />
        <Route path="/buyer/cart" element={<BuyerCart />} />
        <Route path="/buyer/orders" element={<BuyerOrders />} />
        <Route path="/buyer/enquiries" element={<BuyerEnquiry />} />
        <Route path="/seller/home" element={<HomePage />} />
        <Route path="/seller/product" element={<Seller_product />} />
        <Route path="/seller/enquiries" element={<SellerEnquiry />} />
      </Routes>
    </>
  );
};

export default UserWrapper;
