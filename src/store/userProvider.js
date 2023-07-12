import React, { useEffect, useState } from "react";
import UserContext from "./userContext";
import { useReadCookie } from "../hooks/useReadCookie";

const UserProvider = ({ children }) => {
  const [initalCheck, setInitalCheck] = useState(false);

  const defaultUserObject = {
    username: null,
    token: null,
    last_logged_in: null,
    loginStatus: false,
  };

  const [user, setUser] = useState(defaultUserObject);
  const [notifySettings, setNotify] = useState({
    msg: "",
    severity: "",
  });

  const readCookie = useReadCookie;

  const notify = (msg, severity) => {
    setNotify({ msg, severity });
  };

  const verifyLoginStatus = () => {
    return new Promise(async (res, rej) => {
      // Here we can check to see if this user is
      // Logged in or not logged in

      // First see if we can get a token

      if (readCookie("token") && readCookie("token").length >= 1) {
        const req = await fetch("/api/v2/checkLoginStatus.php");

        const res = await req.json();

        if (res.success === true) {
          // The user is logged in

          setUser({
            username: res.username,
            permissions: res.permissions,
            last_logged_in: res.last_logged_in,
            loginStatus: true,
          });
        } else if (res.success === false) {
          setUser(defaultUserObject);
        }
      } else {
        setUser(defaultUserObject);
      }

      res();
    });
  };

  const logout = async () => {
    // Log the user out

    const req = await fetch("/api/v2/logout.php");

    const res = await req.json();

    if (res.success) {
      setUser(defaultUserObject);
    }
  };

  const reCheckLoginStatus = () => {
    setInitalCheck(false);
  };

  useEffect(() => {
    if (readCookie("token") && initalCheck === false) {
      Promise.allSettled([verifyLoginStatus()]).then((res) => {
        setInitalCheck(true);
      });
    } else {
      setInitalCheck(true);
    }
  }, [reCheckLoginStatus]);

  return (
    <React.Fragment>
      {initalCheck && (
        <UserContext.Provider
          value={{
            ...user,
            reCheckLoginStatus,
            logout,
            verifyLoginStatus,
            notifySettings,
            notify,
          }}
        >
          {children}
        </UserContext.Provider>
      )}
    </React.Fragment>
  );
};

export default UserProvider;
