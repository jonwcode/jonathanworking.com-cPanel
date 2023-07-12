import React, { useEffect } from "react";
import { Box, Button, Stack } from "@mui/material";
import css from "./alert.module.css";

const Alert = (props) => {
  const { setAlert, open, msg, title, button, confirm } = props;

  const handleClose = () => {
    setAlert((prev) => {
      return { ...prev, open: false };
    });
  };

  const handleConfirm = () => {
    confirm();
    handleClose();
  };

  useEffect(() => {
    if (!open) {
      document.body.removeAttribute("style");
    } else {
      document.body.style.cssText = "overflow:hidden;";
    }
  }, [setAlert, open]);

  return (
    <React.Fragment>
      {open && (
        <Box className={css.alertContainer}>
          <Box className={css.alertBox}>
            <Box
              component="span"
              sx={{ fontSize: "1.5em" }}
              className={css.title}
            >
              {title}
            </Box>
            <Box
              component="span"
              className={css.msg}
              dangerouslySetInnerHTML={{ __html: msg }}
            ></Box>
            <Stack
              flexDirection="row"
              justifyContent="flex-end"
              sx={{ width: "100%" }}
            >
              <Button onClick={handleClose} sx={{ color: button.close.color }}>
                {button.close.title}
              </Button>
              <Button
                onClick={handleConfirm}
                sx={{ color: button.confirm.color }}
              >
                {button.confirm.title}
              </Button>
            </Stack>
          </Box>
        </Box>
      )}
    </React.Fragment>
  );
};

export default Alert;
