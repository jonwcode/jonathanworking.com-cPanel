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
import css from "./edit.module.css";
import { useNavigate, useParams } from "react-router-dom";
import UserContext from "./store/userContext";

const EditProject = () => {
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const { id } = useParams();

  const userCtx = useContext(UserContext);

  let initialObject = {
    projectTitle: "",
    projectURL: "",
    gitHubURL: "",
    shortDes: "",
    file: null,
    base64Value: null,
    tags: [],
    orig_name: false,
  };

  const [data, setData] = useState(initialObject);

  useEffect(() => {
    fetchProject();
  }, []);

  const fetchProject = async () => {
    const req = await fetch("/api/v2/editProject.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "action=grab&project_id=" + id,
    });

    const res = await req.json();

    setData({
      projectTitle: res.title,
      projectURL: res.url,
      gitHubURL: res.gitHub,
      shortDes: res.shortDes,
      tags: res.tags,
      orig_name: null,
      base64Value: null,
      file: res.file,
    });
  };

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
      data.projectURL &&
      data.projectURL.length >= 1 &&
      !data.projectURL.includes("https://")
        ? true
        : false;

    errorObj.shortDes.error = data.shortDes.length < 30 ? true : false;
    errorObj.tags.error = data.tags.length === 0 ? true : false;
    errorObj.file.error =
      data.file === null &&
      data.file &&
      !["image/png", "image/jpeg", "image/gif"].includes(data.file.type) &&
      !data.thumbnail.length
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

    let jsonData, fileNames;

    if (!validateInputs()) return;
    setLoading(true);

    if (data.file && data.file.size) {
      const formData = new FormData();
      formData.append("file", data.file);
      data.orig_name && formData.append("orig_name", data.orig_name);
      // Upload the image to the server

      const reqFile = await fetch("/api/v2/uploadFile.php", {
        method: "POST",
        body: formData,
      });

      const resFile = await reqFile.json();

      fileNames = resFile;
      // Update the file object with the file names
    }

    jsonData = {
      project_id: id,
      projectTitle: data.projectTitle,
      projectURL: data.projectURL,
      gitHubURL: data.gitHubURL,
      shortDes: data.shortDes,
      tags: data.tags,
      file: fileNames || data.file,
    };

    const req = await fetch("/api/v2/editProject.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData),
    });

    const res = await req.json();

    if (res.success) {
      navigate("/projects");
      userCtx.notify("Project has been successfully been updated", "success");
    }
  };

  return (
    <React.Fragment>
      <Header title="Edit Project" />
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
                  {...(data.file &&
                    data.file.thumbnail !== null && {
                      thumbnail: data.file.thumbnail,
                    })}
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
                    "Save Edit"
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

export default EditProject;
