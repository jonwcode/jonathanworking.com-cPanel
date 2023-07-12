import React, { useEffect } from "react";
import { Box } from "@mui/material";
import css from "./tooltip.module.css";

const Tooltip = ({ children, title, position = "bottom" }) => {
  return (
    <Box data-position={position} className={css.tooltip} data-tooltip={title}>
      {children}
    </Box>
  );
};

export default Tooltip;
<Box></Box>;
