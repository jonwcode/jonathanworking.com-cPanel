import React, { useState, useEffect, useContext } from "react";
import Header from "./componets/header";
import FileInput from "./componets/fileInput";
import TagInput from "./componets/tagInput";
import TextEditor from "./componets/textEditor";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { Input, Stack, Box, Typography, Button } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Footer from "./componets/footer";
import SendIcon from "@mui/icons-material/Send";
import css from "./addProjects.module.css";
import { useNavigate } from "react-router-dom";
import UserContext from "./store/userContext";

const AddProjects = () => {
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([]);

  const userCtx = useContext(UserContext);

  let initialObject = {
    projectTitle: "",
    projectURL: "",
    gitHubURL: "",
    shortDes: "",
    file: null,
    base64Value: null,
    tags: [],
    orig_name: null,
  };

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
    projectTitle: {
      error: false,
      msg: "Please enter a title for the project. Minimum length is 5.",
    },
    gitHubURL: {
      error: false,
      msg: "Please enter a GitHub URL for the project.",
    },
    projectURL: {
      error: false,
      msg: "Must be a valid URL",
    },
    shortDes: {
      error: false,
      msg: "Must enter a short description of the project. Minium length is 30.",
    },
    file: {
      error: false,
      msg: "A image of the project is required.",
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
    console.log(tags);
    setData((prev) => {
      return { ...prev, tags: [...tags] };
    });
  }, [setTags, tags]);

  const validateInputs = () => {
    let errorObj = errorState;
    let valid = false;

    errorObj.projectTitle.error = data.projectTitle.length < 5 ? true : false;

    errorObj.gitHubURL.error = !data.gitHubURL.includes("https://")
      ? true
      : false;
    errorObj.projectURL.error =
      data.projectURL.length >= 1 && !data.projectURL.includes("https://")
        ? true
        : false;

    console.log(data.file.type);

    errorObj.shortDes.error = data.shortDes.length < 30 ? true : false;
    errorObj.tags.error = data.tags.length === 0 ? true : false;
    errorObj.file.error =
      data.file === null ||
      !["image/png", "image/jpeg", "image/gif"].includes(data.file.type)
        ? true
        : false;

    valid =
      !errorObj.projectTitle.error &&
      !errorObj.gitHubURL.error &&
      !errorObj.shortDes.error &&
      !errorObj.tags.error &&
      !errorObj.file.error;

    setErrorState((prev) => {
      return { ...prev, ...errorObj };
    });

    return valid;
  };

  const navigate = useNavigate();

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    console.log(data);

    if (!validateInputs()) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", data.file);
    data.orig_name && formData.append("orig_name", data.orig_name);
    // Upload the image to the server

    const reqFile = await fetch("/api/v2/uploadFile.php", {
      method: "POST",
      body: formData,
    });

    const resFile = await reqFile.json();

    // Update the file object with the file names
    let jsonData;

    if (resFile.error) {
      jsonData = { ...data, orig_name: resFile.orig_name };
    } else {
      jsonData = { ...data, base64Value: null, file: resFile };
    }

    const req = await fetch("/api/v2/addProject.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData),
    });

    const res = await req.json();

    if (res.error) {
      // Save headache of leaving everything that I might of just
      // filled in, lets store what I had inside of the localstorage
      // So when we log back in we can fill the form back in

      localStorage.setItem("jsonData", JSON.stringify(jsonData));

      // Now navigate back to the login
      userCtx.verifyLoginStatus();
      navigate("/");
      userCtx.notify("Your session has expired", "warning");
    }

    if (res.success) {
      // If there is a save session in the browser
      // Storage remove it

      localStorage.clear();

      navigate("/projects");
      userCtx.notify("Project has been successfully been added", "success");
    }
    setLoading(false);
  };

  return (
    <React.Fragment>
      <Header title="Add Projects" />
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
            <Stack
              sx={{
                width: "100%",
                justifyContent: "center",
                alignItems: "flex-end",
                paddingRight: 5,
              }}
            >
              <Box
                className={css.imageContainer}
                {...(errorState.file.error && {
                  className: [css.fileError, css.imageContainer],
                  error: errorState.file.msg,
                })}
              >
                <FileInput
                  base64Value={data.base64Value}
                  orig_name={data.orig_name}
                  setData={setData}
                  width={50}
                  icon={<AddPhotoAlternateIcon />}
                />
              </Box>
            </Stack>
            <Stack sx={{ width: "90%" }}>
              <Stack
                {...(errorState.projectTitle.error && {
                  className: css.inputError,
                  error: errorState.projectTitle.msg,
                })}
              >
                <Input
                  sx={{ order: 2, marginBottom: 0 }}
                  slotProps={{ input: { className: css.title } }}
                  disableUnderline={true}
                  fullWidth
                  name="projectTitle"
                  value={data.projectTitle}
                  onChange={handleChange}
                  placeholder="Project Title"
                />
                <Typography sx={{ order: 1 }} required variant="inputTitle">
                  Project Title
                </Typography>
              </Stack>
              <Stack
                {...(errorState.projectURL.error && {
                  className: css.inputError,
                  error: errorState.projectURL.msg,
                })}
              >
                <Input
                  sx={{ order: 2 }}
                  slotProps={{ input: { className: css.title } }}
                  disableUnderline={true}
                  fullWidth
                  name="projectURL"
                  value={data.projectURL}
                  placeholder="https://"
                  onChange={handleChange}
                />
                <Typography
                  sx={{ order: 1, marginTop: 3 }}
                  variant="inputTitle"
                >
                  Project URL
                </Typography>
              </Stack>
              <Stack
                {...(errorState.gitHubURL.error && {
                  className: css.inputError,
                  error: errorState.gitHubURL.msg,
                })}
              >
                <Input
                  sx={{ order: 2 }}
                  slotProps={{ input: { className: css.title } }}
                  disableUnderline={true}
                  fullWidth
                  name="gitHubURL"
                  value={data.gitHubURL}
                  placeholder="https://github.com/jonwcode/"
                  onChange={handleChange}
                />
                <Typography
                  sx={{ order: 1, marginTop: 3 }}
                  variant="inputTitle"
                  required
                >
                  GitHub URL
                </Typography>
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
                    "Add Project"
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

export default AddProjects;
