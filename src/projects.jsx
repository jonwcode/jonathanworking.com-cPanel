import React, { useEffect, useState } from "react";
import Header from "./componets/header";
import { useNavigate } from "react-router-dom";
import { Box, Stack, Typography } from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import TitleIcon from "@mui/icons-material/Title";
import GitHubIcon from "@mui/icons-material/GitHub";
import Alert from "./componets/alert";
import Footer from "./componets/footer";
import css from "./project.module.css";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import DateRangeIcon from "@mui/icons-material/DateRange";
import EditIcon from "@mui/icons-material/Edit";
import { ReactComponent as EditSVG } from "./assets/svg/edit.svg";
import { ReactComponent as DeleteSVG } from "./assets/svg/delete.svg";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Tooltip from "./componets/tooltip";

const Projects = () => {
  // Load the current projects

  const navigate = useNavigate();

  const [projectsData, setProjectsData] = useState([]);
  const [alert, setAlert] = useState({
    open: false,
    msg: null,
    title: null,
    confirm: null,
    button: {
      close: { title: "", color: "" },
      confirm: { title: "", color: "" },
    },
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const req = await fetch("/api/v2/projectList.php");

    const res = await req.json();

    if (res.error === true) {
      navigate("/");
      return;
    }

    setProjectsData([...res]);
  };

  const toggleShowText = (projectID) => {
    const project = [...projectsData]; // Make a copy

    project[projectID].toggleState = project[projectID].toggleState
      ? false
      : true;

    setProjectsData([...project]);
  };

  const handleDelete = async (projectID) => {
    const req = await fetch("/api/v2/projectHandler.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "action=delete&project_id=" + projectID,
    });

    const res = await req.text();

    // Now lets also remove it from the state

    const filteredProjectData = [
      ...projectsData.filter((project) => project.id !== projectID),
    ];

    setProjectsData(filteredProjectData);
  };

  const handleEdit = async (projectID) => {
    navigate("/edit/project/" + projectID);
  };

  // Change the project visibility

  const toggleVisility = async (projectID, vis) => {
    const req = await fetch("/api/v2/projectHandler.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "action=visibility&project_id=" + projectID,
    });

    const res = await req.text();

    // Update the state to reflect the changes made
    const index = projectsData.findIndex(
      (projects) => projects.id === projectID
    ); // Find the project inside the the project array

    // Make a copy of project array

    const projectArray = [...projectsData];

    // Change the visibility...

    projectArray[index].visibility = !vis ? 1 : 0;

    // Now update the state

    setProjectsData(projectArray);
  };

  return (
    <React.Fragment>
      <Header title="Projects" />
      <Stack
        sx={{
          marginTop: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {projectsData.map((project, index) => (
          <Stack
            sx={{
              flexDirection: {
                medium: "column",
                tablet: "row",
              },
            }}
            key={project.id}
            className={css.container}
          >
            <Box
              sx={{ marginBottom: { mobile: "20px", tiny: "20px" } }}
              className={css.imageContainer}
            >
              <img
                width="200"
                loading="eager"
                decoding="sync"
                src={`https://jonathanworking.com/api/v2/images/thumbnails/${project.thumbnail}`}
              />

              <Stack
                flexDirection="row"
                justifyContent="space-around"
                alignItems="center"
                sx={{ width: "100%", padding: "5px", cursor: "pointer" }}
              >
                <Tooltip title="Edit">
                  <EditSVG
                    onClick={() => handleEdit(project.id)}
                    className={css.editSVG}
                  />
                </Tooltip>
                <Tooltip title="Delete Project">
                  <DeleteSVG
                    onClick={() => {
                      setAlert({
                        open: true,
                        title: "Delete this project?",
                        msg:
                          "You are about to delete <b style='font-size: 1.2em; color:#5b65ab'>" +
                          project.title +
                          "</b>.<p>Are you sure you want to delete this?</p>",
                        confirm: () => handleDelete(project.id),
                        button: {
                          close: {
                            title: "close",
                            color: "#29b6f6",
                          },
                          confirm: {
                            title: "Delete",
                            color: "#f44336",
                          },
                        },
                      });
                    }}
                    className={css.deleteSVG}
                  />
                </Tooltip>

                <Tooltip title="Toggle visibility">
                  {!project.visibility ? (
                    <VisibilityOffIcon
                      onClick={() =>
                        toggleVisility(project.id, project.visibility)
                      }
                      sx={{
                        color: "rgba(244, 67, 54, 0.434)",
                        "&:hover": { color: "#009688" },
                      }}
                    />
                  ) : (
                    <VisibilityIcon
                      onClick={() =>
                        toggleVisility(project.id, project.visibility)
                      }
                      sx={{
                        color: "rgba(0, 150, 136, 0.434)",
                        "&:hover": { color: "rgba(244, 67, 54, 0.64)" },
                      }}
                    />
                  )}
                </Tooltip>
              </Stack>
            </Box>
            <Stack
              flexDirection="column"
              sx={{ width: "100%", paddingLeft: 3 }}
            >
              <Stack flexDirection="row" alignItems="center">
                <Typography sx={{ order: 2 }} variant="projectTitle">
                  {project.title}
                </Typography>
                <TitleIcon
                  sx={{ color: "#222834", marginRight: 2, order: 1 }}
                />
              </Stack>
              <Stack
                flexDirection="row"
                alignItems="center"
                sx={{ marginTop: 2, marginRight: 2 }}
              >
                <a target="_blank" style={{ order: 2 }} href={project.url}>
                  {project.url}
                </a>
                <LinkIcon sx={{ color: "#222834", marginRight: 2, order: 1 }} />
              </Stack>
              <Stack
                flexDirection="row"
                alignItems="center"
                sx={{ marginTop: 2, marginRight: 2 }}
              >
                <a target="_blank" style={{ order: 2 }} href={project.gitHub}>
                  {project.gitHub}
                </a>
                <GitHubIcon
                  sx={{ color: "#222834", marginRight: 2, order: 1 }}
                />
              </Stack>
              <Stack
                sx={{
                  justifyContent: "flex-start",
                  alignItems: "flex-end",
                  flexDirection: "row",
                }}
                className={css.tagContainer}
              >
                {project.tags.map((tag, index) => (
                  <Box
                    key={index}
                    data-tag={tag.toLowerCase()}
                    title={tag.toLowerCase()}
                    className={css.tag}
                  >
                    {tag}
                  </Box>
                ))}
              </Stack>
              <Box className={css.shortDes}>
                <Box
                  component="p"
                  className={css.shortDesText}
                  style={{
                    ...(project.toggleState && {
                      display: "inline-block",
                      overflowY: "auto",
                      height: "250px",
                    }),
                  }}
                >
                  <Box
                    component="span"
                    dangerouslySetInnerHTML={{
                      __html: project.shortDes,
                    }}
                  ></Box>
                </Box>
                <Stack flexDirection="row" sx={{ width: "100%" }}>
                  {project.shortDes.length > 270 && (
                    <Box component="span">
                      {project.toggleState ? (
                        <Stack
                          onClick={() => toggleShowText(index)}
                          className={css.toggleButton}
                        >
                          Collapse <ExpandLessIcon />
                        </Stack>
                      ) : (
                        <Stack
                          onClick={() => toggleShowText(index)}
                          className={css.toggleButton}
                        >
                          Expand <ExpandMoreIcon />
                        </Stack>
                      )}
                    </Box>
                  )}
                  <Stack
                    sx={{
                      width: "100%",
                      alignItems: "flex-end",
                      justifyContent: "center",
                    }}
                  >
                    {project.updatedAt && (
                      <Tooltip position="top" title="Last Edited">
                        <Stack
                          flexDirection="row"
                          alignItems="center"
                          justifyContent="center"
                          sx={{
                            fontSize: "0.7em",
                            color: "rgb(115, 124, 142)",
                          }}
                        >
                          <EditIcon
                            sx={{ width: "18px", marginRight: "5px" }}
                          />
                          {project.updatedAt}
                        </Stack>
                      </Tooltip>
                    )}

                    <Tooltip title="Date created">
                      <Stack
                        flexDirection="row"
                        alignItems="center"
                        justifyContent="center"
                        sx={{
                          fontSize: "0.7em",
                          color: "rgb(115, 124, 142)",
                        }}
                      >
                        <DateRangeIcon
                          sx={{ width: "18px", marginRight: "5px" }}
                        />
                        {project.createdAt}
                      </Stack>
                    </Tooltip>
                  </Stack>
                </Stack>
              </Box>
            </Stack>
          </Stack>
        ))}
        {projectsData.length === 0 && (
          <Typography
            variant="h4"
            sx={{
              color: "rgba(133, 133, 133, 0.53)",
              textShadow: "1px 1px 1px rgb(99, 116, 127)",
            }}
          >
            Currently no project available
          </Typography>
        )}
      </Stack>
      <Footer />
      <Alert
        setAlert={setAlert}
        open={alert.open}
        handleConfirm={alert.confirm}
        title={alert.title}
        msg={alert.msg}
        button={alert.button}
        confirm={alert.confirm}
      />
    </React.Fragment>
  );
};

export default Projects;
