import React, { useEffect, useState, useRef } from "react";
import { Box, Stack, Typography, Input, Button, Alert } from "@mui/material";
import css from "./about.module.css";
import TextEditor from "./componets/textEditor";

const About = () => {
  const loading = useRef("true");
  const [alertSuccess, setAlertSuccess] = useState(false);
  const [about, setAbout] = useState({ text: "", last_updated: "" });

  useEffect(() => {
    loadAbout();
  }, [loading]);

  const handleChange = (evt) => {
    const val = evt.target.value;
    setAbout((prev) => {
      return { ...prev, text: val };
    });
  };

  const showSuccess = () => {
    setAlertSuccess(true);
    setTimeout(() => {
      setAlertSuccess(false);
    }, 6000);
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    const req = await fetch("/api/v2/about.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "text=" + about.text,
    });

    // Send a Notification that it's been updated
    showSuccess();
  };

  const loadAbout = async () => {
    const req = await fetch("/api/v2/about.php?getData=true");
    const res = await req.json();

    setAbout((prev) => {
      return { ...prev, text: res.text, last_updated: res.last_updated };
    });
  };

  return (
    <React.Fragment>
      <Stack flexDirection="column" justifyContent="center" alignItems="center">
        <Box sx={{ marginTop: 10 }}>
          <Typography>About Description</Typography>
        </Box>
        <Box
          component="form"
          method="post"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: { desktop: "800px", mobile: "600px", tiny: "90%" },
          }}
        >
          <TextEditor
            name="text"
            value={about.text}
            onChange={handleChange}
            placeholder="About me..."
            setData={setAbout}
            maxHeight="300px"
          />
          <Button type="submit" sx={{ width: "max-content" }} disableRipple>
            Update About
          </Button>
        </Box>
      </Stack>
      {alertSuccess && (
        <Box className={css.alertSuccess}>
          <Alert variant="filled" sx={{ color: "#a1ffb4", opacity: "0.8" }}>
            About has successfully been updated
          </Alert>
        </Box>
      )}
    </React.Fragment>
  );
};

export default About;
