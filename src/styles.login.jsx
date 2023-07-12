import { styled, Stack, Form, Typography, Box } from "@mui/material";
import { grey } from "@mui/material/colors";
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles({
  '@keyframes fadeIn': {
    '0%': {
      opacity: 0,
    },
    '100%': {
      opacity: 1,
    },
  },
  fadeInAnimation: {
    animation: '$fadeIn 1s',
  },

  closeBtn: {
    "&.Mui-hover .MuiIconButton-root": {
      fill: "green",
    },
  },
});

export const Wrapper = styled(Stack)({
  width: "100%",
  height: "100vh",
  justifyContent: "flex-start",
  alignItems: "center",
  paddingTop: 20,
});

export const FormContainer = styled(Stack)(({ Theme }) => ({
  display: "flex",
  background: "rgb(22, 27, 34)",
  border: "1px solid rgb(33, 38, 45)",
  borderRadius: 5,
  width: "300px",
  padding: 10,
  height: 300,
  justifyContent: "space-around",
}));

export const LoginHeaderTitle = styled(Typography)({
  color: grey[50],
  fontFamily: "Inter",
  fontSize: "1.3em",
  marginBottom: 15,
});

export const GroupWrapper = styled(Stack)({
  justifyContent: "center",
  alignItems: "center",
});

export const LinkContainer = styled(Box)({
  width: "100%",
  textAlign: "center",
  padding: 10,
  a: {
    textDecoration: "none",
    color: "#2f81f7",
    fontSize: "1em",
  },
  "a:hover": {
    textDecoration: "underline",
  },
});

export const LoginError = styled(Box)({
  padding: 15,
  borderRadius: 5,
  marginBottom: 15,
  backgroundImage: "linear-gradient(rgba(248,81,73,0.1),rgba(248,81,73,0.1))",
  border: "1px solid rgba(248,81,73,0.4)",
  svg: {
    fill: "rgba(248, 82, 73, 0.69)",
  },
  "& svg:hover": {
    fill: "rgba(218, 37, 27, 0.69)",
  },
});
