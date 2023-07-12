import React, { useState, useContext, useEffect } from "react";
import UserContext from "./store/userContext";
import Logo from "./componets/logo";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import css from "./login.module.css";
import {
  Box,
  Input,
  TextField,
  FormControl,
  FormLabel,
  IconButton,
  Button,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import {
  Wrapper,
  GroupWrapper,
  FormContainer,
  LoginHeaderTitle,
  LinkContainer,
  useStyles,
  LoginError,
} from "./styles.login";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/");
  }, []);

  const userCtx = useContext(UserContext);

  const classes = useStyles();

  const [data, setData] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState(false);

  const handleChange = (evt) => {
    const name = evt.target.name;
    const val = evt.target.value;
    setData((prev) => {
      return { ...prev, [name]: val };
    });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    if (data.username.length >= 2 || data.password.length >= 8) {
      const req = await fetch("/api/v2/login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const res = await req.json();

      if (res.success === true) {
        userCtx.reCheckLoginStatus();
      } else {
        setLoginError(true);
      }
    } else {
      setLoginError(true);
    }
  };
  return (
    <Wrapper className={classes.fadeInAnimation}>
      <GroupWrapper>
        <Logo />
        <LoginHeaderTitle>Sign into cPanel</LoginHeaderTitle>
        {loginError && (
          <LoginError>
            Incorrect username or password{" "}
            <IconButton
              onClick={() => setLoginError(false)}
              className={classes.closeBtn}
              disableRipple
              variant="error"
            >
              <CloseIcon />
            </IconButton>
          </LoginError>
        )}
        <Box component="form" method="post" onSubmit={handleSubmit}>
          <FormContainer>
            <Typography>Username</Typography>
            <Input
              slotProps={{
                input: { className: css.inputOutline },
              }}
              variant="outlined"
              name="username"
              onChange={handleChange}
              color="primary"
              autoFocus
              id="username"
              placeholder="Username"
              autoComplete="username"
              disableUnderline={true}
            />
            <Typography>Password</Typography>

            <Input
              slotProps={{
                input: { className: css.inputOutline },
              }}
              name="password"
              onChange={handleChange}
              id="password"
              color="primary"
              placeholder="Password"
              type="password"
              disableUnderline={true}
            />

            <Button
              type="submit"
              disableFocusRipple
              disableRipple
              sx={{
                background: "#238636",
                color: "#ffffff",
                marginTop: 2,
                "&:hover": { background: "#2ea043;" },
              }}
              variant="contained"
            >
              Login
            </Button>
            <LinkContainer>
              <Link to="/passwordReset">forgot password?</Link>
            </LinkContainer>
          </FormContainer>
        </Box>
      </GroupWrapper>
    </Wrapper>
  );
};

export default Login;
