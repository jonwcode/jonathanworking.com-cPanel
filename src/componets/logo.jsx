import React from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
const Logo = () => {
  const LogoContainer = styled(Box)(({ theme }) => ({
    padding: 0,
    transition: "all 200ms ease-in-out",
    transform: "scale(0.7)",
    position: "relative",
    zIndex: "999",
    width: "max-content",
    height: "min-content",
    userSelect: "none",
    "&:hover": {
      transform: "scale(0.7)",
    },
    display: {
      medium: "none",
      mobile: "none",
      tablet: "none",
      desktop: "inline-block",
    },
  }));

  return (
    <LogoContainer>
      <Typography
        sx={{ padding: 0, margin: 0, textShadow: "#FC0 1px 0 6px" }}
        variant="logo"
      >
        j&#8901;w
      </Typography>
    </LogoContainer>
  );
};

export default Logo;
