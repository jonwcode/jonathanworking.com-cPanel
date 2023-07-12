import { createTheme } from "@mui/material/styles";
import { orange } from "@mui/material/colors";

let Theme = createTheme({
  palette: {
    mode: "dark",
  },
});

Theme = createTheme({
  breakpoints: {
    values: {
      tiny: 0,
      mobile: 600,
      tablet: 900,
      desktop: 1200,
      uhd: 1536,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          overflowX: "hidden",
          background: "rgb(14,17,23)",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "transparent",
          },
        },
        input: {
          "&:-webkit-autofill": {
            WebkitBoxShadow: "0 0 0 100px rgb(14,17,23) inset",
          },

          padding: "3px 3px 3px 10px",
          border: "3px solid rgb(30, 37, 51)",
        },

        notchedOutline: {
          borderWidth: 0,
          borderColor: "transparent",
        },
      },
    },
  },
  typography: {
    logo: {
      fontFamily: "AcmeRegular",
      fontSize: "4em",
      color: orange[500],
      cursor: "pointer",
    },
    inputTitle: {
      paddingLeft: "15px",
      paddingBottom: "10px",
      color: "rgb(90, 93, 102)",
    },
    h4: {
      fontFamily: "InterRegular",
      color: "#dddddd",
    },
    projectTitle: {
      fontSize: "1.5em",
      fontFamily: "InterRegular",
      color: "#a2a2a2",
    },
  },
  palette: {
    mode: "dark",
  },
});

export default Theme;
