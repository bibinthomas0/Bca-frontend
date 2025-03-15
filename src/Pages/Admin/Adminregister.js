import React, { useEffect, useState } from "react";
import AdminCreation from "./AdminCreation";
import AdminOtpVerification from "./AdminOtp";
import { useSelector } from "react-redux";

function Adminregister() {
  const [childData, setChildData] = useState(false);

  const handleChildData = (data) => {
    setChildData(data);
  };
  
  
  return (
    <div>
      {childData ? (
        <AdminOtpVerification />
      ) : (
        <AdminCreation onChildData={handleChildData}  />
      )}
    </div>
  );
}

export default Adminregister;