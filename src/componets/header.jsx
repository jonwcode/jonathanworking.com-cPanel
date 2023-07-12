import React, { useContext } from "react";
import {
  AppBar,
  Toolbar,
  Tooltip,
  Box,
  Stack,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import UserContext from "../store/userContext";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import css from "./header.module.css";
import { ReactComponent as ProjectIcon } from "../assets/svg/project.svg";
import { ReactComponent as LogoutIcon } from "../assets/svg/logout.svg";
import { ReactComponent as AddNewIcon } from "../assets/svg/addNew.svg";
import { ReactComponent as HomeIcon } from "../assets/svg/home.svg";
import { ReactComponent as LinkIcon } from "../assets/svg/link.svg";

const Header = ({ title }) => {
  const userCtx = useContext(UserContext);

  return (
    <Stack>
      <AppBar>
        <Toolbar
          className={css.toolbar}
          sx={{
            display: "flex",
            flexDirection: { tiny: "column", tablet: "row" },
            justifyContent: "center",
            alignItem: "center",
          }}
          variant="dense"
        >
          <Box sx={{ padding: { tiny: 1 } }} className={css.dateContainer}>
            <Tooltip
              slotProps={{
                tooltip: { className: css.toolTip },
                arrow: { className: css.arrow },
              }}
              arrow={true}
              title="Last logged In"
              sx={{ display: "flex" }}
            >
              <Typography variant="body">
                <AccessTimeIcon sx={{ marginRight: 2 }} />
                {userCtx.last_logged_in}
              </Typography>
            </Tooltip>
          </Box>
          <Stack
            sx={{
              padding: { tiny: 1 },
              justifyContent: {
                tiny: "center",
                tablet: "flex-end",
              },
              "& a": {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                color: "#cccccc",
              },
              "& svg": {
                marginTop: "5px",
              },
              alignItems: "center",
              fontSize: { tiny: "1em" },
            }}
            className={css.linkContainer}
            flexDirection="row"
            alignItems="center"
          >
            <Link to="/">
              Home
              <HomeIcon />
            </Link>
            <Box sx={{ position: "relative" }}>
              <Box className={css.dropDownLink}>
                <Link className={css.addLinks}>
                  Add New
                  <Box component="span" className={css.dropMenu}>
                    <AddNewIcon />
                  </Box>
                </Link>
                <Box className={css.subMenu}>
                  <Link to="/addProjects">
                    Add Project <LinkIcon />
                  </Link>
                  <Link to="/addExperience">
                    Add Experience <LinkIcon />
                  </Link>
                </Box>
              </Box>
            </Box>
            <Link to="/projects">
              Projects
              <ProjectIcon />
            </Link>
            <Link to="/logout">
              Logout
              <LogoutIcon />
            </Link>
          </Stack>
        </Toolbar>
      </AppBar>
      {title && (
        <Box
          className={css.titleContainer}
          sx={{ marginTop: { tiny: "85px", tablet: "75px" } }}
        >
          <Typography variant="h4" color="#adaebb">
            {title}
          </Typography>
        </Box>
      )}
    </Stack>
  );
};

export default Header;
