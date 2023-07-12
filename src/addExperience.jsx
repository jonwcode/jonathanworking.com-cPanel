import React, { useState, useEffect, useContext } from "react";
import Header from "./componets/header";
import TagInput from "./componets/tagInput";
import DatePicker from "./componets/datePicker";
import TextEditor from "./componets/textEditor";
import { Input, Stack, Box, Typography, Button } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Footer from "./componets/footer";
import SendIcon from "@mui/icons-material/Send";
import css from "./addExperience.module.css";
import { useNavigate } from "react-router-dom";
import UserContext from "./store/userContext";

const AddExperience = () => {
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const [startDate, setStartDate] = useState({ month: "", year: "" });
  const [endDate, setEndDate] = useState({ month: "", year: "" });
  const userCtx = useContext(UserContext);

  let initialObject = {
    companyName: "",
    companyURL: "",
    startDate: { ...startDate },
    endDate: { ...endDate },
    shortDes: "",
    tags: [],
  };

  useEffect(() => {
    setData((prev) => {
      return { ...prev, startDate, endDate };
    });
  }, [startDate, endDate]);

  const [data, setData] = useState(initialObject);

  useEffect(() => {
    // On initial load, check to see if there is anything
    // Stored in the local storage

    setTimeout(() => {
      const jsonData = JSON.parse(window.localStorage.getItem("jsonData"));

      if (jsonData) {
        setData(jsonData);
      }
    }, 200);
  }, []);

  const initalErrorState = {
    companyName: {
      error: false,
      msg: "Please enter a valid company name.",
    },
    startDate: {
      error: false,
      msg: "Must select either a month or a year.",
    },
    endDate: {
      error: false,
      msg: "Must select either a month or a year or check present.",
    },
    shortDes: {
      error: false,
      msg: "Must enter a short description of the project. Minium length is 30.",
    },
    tags: {
      error: false,
      msg: "You need to add at least two tags.",
    },
  };

  const [errorState, setErrorState] = useState(initalErrorState);

  const handleChange = (evt) => {
    const name = evt.target.name;
    const val = evt.target.value;

    setData((prev) => {
      return { ...prev, [name]: val };
    });
  };

  useEffect(() => {
    setData((prev) => {
      return { ...prev, tags: [...tags] };
    });
  }, [setTags, tags]);

  const validateInputs = () => {
    let errorObj = errorState;
    let valid = false;

    errorObj.companyName.error = data.companyName.length < 5 ? true : false;

    errorObj.startDate.error =
      data.startDate.month.length === 0 && data.startDate.year.length === 0
        ? true
        : false;
    errorObj.endDate.error =
      data.endDate.month.length === 0 && data.endDate.year.length === 0
        ? true
        : false;
    errorObj.shortDes.error = data.shortDes.length < 30 ? true : false;
    errorObj.tags.error = data.tags.length === 0 ? true : false;

    valid =
      !errorObj.companyName.error &&
      !errorObj.shortDes.error &&
      !errorObj.startDate.error &&
      !errorObj.endDate.error &&
      !errorObj.tags.error;

    setErrorState((prev) => {
      return { ...prev, ...errorObj };
    });

    return valid;
  };

  const navigate = useNavigate();

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    if (validateInputs()) {
      let jsonData = { ...data };
      const req = await fetch("/api/v2/addExperience.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      });
      const res = await req.json();
      if (res.error) {
        userCtx.verifyLoginStatus();
        navigate("/");
        userCtx.notify("Your session has expired", "warning");
      }
      if (res.success) {
        // If there is a save session in the browser
        // Storage remove it
        navigate("/");
        userCtx.notify("Experience has been added successfully", "success");
      }
    }
    setLoading(false);
  };

  return (
    <React.Fragment>
      <Header title="Add Experience" />
      <Stack className={css.wrapper} direction="row">
        <Box
          component="form"
          method="post"
          sx={{ width: "100%", display: "flex", justifyContent: "center" }}
          onSubmit={handleSubmit}
        >
          <Stack
            sx={{
              width: {
                desktop: "900px",
                tablet: "800px",
                mobile: "90%",
                tiny: "90%",
              },
              justifyContent: "center",
              alignItems: "center",
            }}
            className={css.container}
          >
            <Stack sx={{ width: "90%" }}>
              <Stack
                {...(errorState.companyName.error && {
                  className: css.inputError,
                  error: errorState.companyName.msg,
                })}
              >
                <Input
                  sx={{ order: 2, marginBottom: 0 }}
                  slotProps={{ input: { className: css.title } }}
                  disableUnderline={true}
                  fullWidth
                  name="companyName"
                  value={data.companyName}
                  onChange={handleChange}
                  placeholder="Company Name"
                />
                <Typography
                  component="p"
                  sx={{ order: 1 }}
                  required
                  variant="inputTitle"
                >
                  Company Name
                </Typography>
              </Stack>
              <Stack>
                <Input
                  type="url"
                  sx={{ order: 2 }}
                  slotProps={{ input: { className: css.title } }}
                  disableUnderline={true}
                  fullWidth
                  name="companyURL"
                  value={data.companyURL}
                  placeholder="https://"
                  onChange={handleChange}
                />
                <Typography
                  component="p"
                  sx={{ order: 1, marginTop: 3 }}
                  variant="inputTitle"
                >
                  Company URL
                </Typography>
              </Stack>
              <Stack
                sx={{
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Stack
                  className={css.dateBox}
                  sx={{
                    flexDirection: { tablet: "row", tiny: "column" },
                    width: "100%",
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  <Stack
                    sx={{ width: "max-content" }}
                    {...(errorState.startDate.error && {
                      className: css.inputError,
                      error: errorState.startDate.msg,
                    })}
                  >
                    <DatePicker
                      order={2}
                      date={startDate}
                      setDate={setStartDate}
                      value={data.startDate}
                    />
                    <Typography
                      component="p"
                      sx={{ order: 1, marginTop: 3 }}
                      variant="inputTitle"
                      required
                    >
                      Start Date
                    </Typography>
                  </Stack>
                  <Stack
                    sx={{ width: "max-content" }}
                    {...(errorState.endDate.error && {
                      className: css.inputError,
                      error: errorState.endDate.msg,
                    })}
                  >
                    <DatePicker
                      order={2}
                      date={endDate}
                      setDate={setEndDate}
                      present={true}
                      value={data.endDate}
                    />
                    <Typography
                      component="p"
                      sx={{ order: 1, marginTop: 3 }}
                      variant="inputTitle"
                      required
                    >
                      End Date
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
              <Stack
                {...(errorState.shortDes.error && {
                  className: css.inputError,
                  error: errorState.shortDes.msg,
                })}
              >
                <TextEditor
                  name="shortDes"
                  value={data.shortDes}
                  onChange={handleChange}
                  order={2}
                  placeholder="Short Description"
                  setData={setData}
                />
                <Typography
                  component="p"
                  sx={{ order: 1, marginTop: 3 }}
                  variant="inputTitle"
                  required
                >
                  Short Description
                </Typography>
              </Stack>
              <TagInput
                error={errorState.tags.error}
                errorMsg={errorState.tags.msg}
                sx={{ order: 9, marginTop: 3 }}
                tags={tags}
                setTags={setTags}
                value={data.tags}
                placeholder="Project Tags"
              />
              <Box
                sx={{
                  marginTop: 5,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  order: 10,
                  width: "100%",
                }}
              >
                <Button
                  type="submit"
                  sx={{
                    color: "#ffffff",
                    backgroundColor: "#49b07e",
                    "&:hover": {
                      background: "#2f8159",
                    },
                    width: "50%",
                  }}
                  variant="contained"
                  color="success"
                  {...(!loading && {
                    endIcon: <SendIcon sx={{ color: "#a7cfb6" }} />,
                  })}
                >
                  {!loading ? (
                    "Add Experience"
                  ) : (
                    <CircularProgress
                      style={{ width: "25px", height: "25px" }}
                      sx={{ color: "#97ecbd" }}
                    />
                  )}
                </Button>
              </Box>
            </Stack>
          </Stack>
        </Box>
      </Stack>
      <Footer />
    </React.Fragment>
  );
};

export default AddExperience;
