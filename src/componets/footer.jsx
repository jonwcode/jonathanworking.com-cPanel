import React from "react";
import { Box } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        position: "sticky",
        zIndex: "-99999",
        bottom: 0,
        width: "100%",
        height: "100px",
      }}
    ></Box>
  );
};

export default Footer;
