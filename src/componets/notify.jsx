import React, { useEffect, useState, useContext } from "react";
import { createPortal } from "react-dom";
import { Box, Alert, Portal } from "@mui/material";
import css from "./notify.module.css";
import UserContext from "../store/userContext";

function Notify() {
  const userCtx = useContext(UserContext);

  const [notifyState, setNotifyState] = useState(false);

  useEffect(() => {
    if (userCtx.notifySettings.msg.length >= 1) {
      setTimeout(() => {
        setNotifyState(true);
        setTimeout(() => {
          setNotifyState(false);
        }, 6000);
      }, 1000);
    }
  }, [userCtx.notifySettings.msg]);

  return (
    <Portal>
      {notifyState && (
        <Box
          sx={{
            width: "max-content",
            position: "sticky",
            left: "90%",
            top: "95%",
          }}
          className={css.container}
        >
          <Alert
            {...(userCtx.notifySettings.severity && {
              severity: userCtx.notifySettings.severity,
            })}
          >
            {userCtx.notifySettings.msg}
          </Alert>
        </Box>
      )}
    </Portal>
  );
}

export default Notify;
