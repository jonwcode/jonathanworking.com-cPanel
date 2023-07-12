import React, { useContext, useEffect } from "react";
import UserContext from "./store/userContext";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  const userCtx = useContext(UserContext);

  useEffect(() => {
    if (userCtx.loginStatus) {
      userCtx.logout();
    } else {
      navigate("/");
    }
  }, [userCtx.loginStatus]);

  return <p>Loading...</p>;
};

export default Logout;
