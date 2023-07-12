import React, { useContext } from "react";
import UserContext from "./store/userContext";
import { CssBaseline, StyledEngineProvider } from "@mui/material";
import Theme from "./theme";
import { ThemeProvider } from "@mui/material/styles";
import Login from "./login";
import CPanel from "./CPanel";
import AddProjects from "./addProjects";
import EditProject from "./edit";
import EditExperience from "./editExperience";
import AddExperience from "./addExperience";
import Projects from "./projects";
import Logout from "./logout";
import ForgotPassword from "./forgotpassword";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Notify from "./componets/notify";

function App() {
  const userCtx = useContext(UserContext);

  const router = createBrowserRouter([
    {
      path: "/",
      element: userCtx.loginStatus ? <CPanel /> : <Login />,
      errorElement: <h2> can't find page</h2>,
    },
    {
      path: "/projects",
      element: userCtx.loginStatus ? <Projects /> : <Login />,
    },
    {
      path: "/addProjects",
      element: userCtx.loginStatus ? <AddProjects /> : <Login />,
    },
    {
      path: "/addExperience",
      element: userCtx.loginStatus ? <AddExperience /> : <Login />,
    },
    {
      path: "/edit/project/:id",
      element: userCtx.loginStatus ? <EditProject /> : <Login />,
    },
    {
      path: "/edit/experience/:id",
      element: userCtx.loginStatus ? <EditExperience /> : <Login />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/logout",
      element: <Logout />,
    },
    {
      path: "/passwordReset",
      element: <ForgotPassword />,
    },
  ]);

  return (
    <React.Fragment>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={Theme}>
          <CssBaseline />
          <RouterProvider router={router} />
          <Notify />
        </ThemeProvider>
      </StyledEngineProvider>
    </React.Fragment>
  );
}

export default App;
