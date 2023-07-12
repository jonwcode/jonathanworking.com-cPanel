import React, { useEffect, useState, useRef } from "react";
import { Stack, Box } from "@mui/material";
import { ReactComponent as ExperienceIcon } from "./assets/svg/experience.svg";
import { ReactComponent as CloseX } from "./assets/svg/closeX.svg";
import { ReactComponent as SuitcaseIcon } from "./assets/svg/suitcase.svg";
import { ReactComponent as DeleteIcon } from "./assets/svg/delete.svg";
import { ReactComponent as EditIcon } from "./assets/svg/edit.svg";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import css from "./experience.module.css";
import { useNavigate } from "react-router-dom";
import Tooltip from "./componets/tooltip";
import Alert from "./componets/alert";

const Experience = () => {
  const initLoad = useRef(false);
  const navigate = useNavigate();

  const [modal, setModal] = useState(false);
  const [data, setData] = useState([]);
  const [alert, setAlert] = useState({
    open: false,
    handleConfirm: () => {},
    title: "",
    msg: "",
    button: "",
    confirm: "",
  });

  const handleToggle = () => {
    setModal((prev) => !prev);
  };

  useEffect(() => {
    if (initLoad.current === false) {
      grabExperience();
    }

    return () => {
      initLoad.current = true;
    };
  }, []);

  const grabExperience = async () => {
    const req = await fetch("/api/v2/experiences.php?grabData=true");
    const res = await req.json();

    setData(res);
  };

  const toggleVisility = async (id, vis) => {
    // Change the visiblility of this job

    const req = await fetch("/api/v2/experienceHandler.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "id=" + id + "&action=visibility",
    });

    const res = await req.text();

    // Lets update the state

    const expIndex = data.findIndex((exp) => exp.id === id);

    // Make a copy of the old state

    const expArray = [...data];

    expArray[expIndex].visible = !vis ? 1 : 0;

    setData(expArray);
  };

  const handleEdit = (id) => {
    navigate("/edit/experience/" + id);
  };
  const handleDelete = async (id) => {
    const req = await fetch("/api/v2/experienceHandler.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "id=" + id + "&action=delete",
    });

    // Now remove it from the state

    const expArray = [...data];

    const filtered = expArray.filter((exp) => exp.id !== id);

    setData(filtered);
  };

  return (
    <React.Fragment>
      <Stack
        sx={{
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <Stack
          sx={{
            background: "rgba(18, 22, 30, 0.78)",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            margin: 3,
            padding: 1,
            borderRadius: 3,
            border: "1px solid rgb(26, 32, 42)",
            color: "#B5B6B7",
            boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.19)",
            cursor: "pointer",
            userSelect: "none",
            "&:hover": {
              border: "1px solid rgba(86, 126, 172, 0.234)",
            },
            "&:active": {
              opacity: "0.7",
            },
          }}
          onClick={handleToggle}
        >
          <ExperienceIcon />
          <Box sx={{ marginLeft: 2 }}>Experiences</Box>
        </Stack>
      </Stack>
      {modal && (
        <Stack
          sx={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            backdropFilter: "blur(5px)",
            zIndex: 99999,
          }}
        >
          <Stack
            sx={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "100%",
              height: "100%",
              background: "rgba(14, 17, 23, 0.91)",
            }}
          >
            <Stack
              sx={{
                width: "100%",
                borderBottom: "1px solid rgba(46, 60, 77, 0.23)",
                flexDirection: "row",
                padding: 1,
              }}
            >
              <Stack
                sx={{
                  width: "50%",
                  justifyContent: "center",
                  color: "rgb(123, 123, 123)",
                  fontWeight: "bold",
                  fontSize: "1.5em",
                }}
              >
                Job Experiences
              </Stack>
              <Stack
                sx={{
                  width: "50%",
                  alignItems: "flex-end",
                  justifyContent: "center",
                }}
              >
                <Stack
                  sx={{
                    width: "max-content",
                  }}
                >
                  <CloseX onClick={handleToggle} className={css.closeX} />
                </Stack>
              </Stack>
            </Stack>
            <Stack>
              {data.map((exp, index) => (
                <Stack
                  key={index}
                  sx={{
                    flexDirection: "row",
                    background: "rgba(22, 24, 29, 0.69)",
                    borderTop: "1px solid rgba(27, 32, 42, 0.6)",
                    borderBottom: "1px solid rgba(30, 33, 40, 0.6)",
                    boxShadow: "0px 0px 3px 0px rgba(0,0,0,0.75)",
                    color: "#929292",
                    alignItems: "center",
                    marginBottom: 2,
                    marginTop: 2,
                    padding: 2,
                  }}
                >
                  <Box sx={{ width: "3%", minWidth: "30px" }}>
                    <SuitcaseIcon />
                  </Box>
                  <Box component="span" sx={{ width: "80%" }}>
                    {exp.name}
                  </Box>
                  <Stack
                    sx={{
                      width: "30%",
                      float: "right",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      justifyItems: "center",
                      flexDirection: "row",
                      "& svg": {
                        cursor: "pointer",
                      },
                      "& :not(:last-child) svg": {
                        marginRight: 2,
                      },
                    }}
                  >
                    <Tooltip title="Toggle visibility">
                      {!exp.visible ? (
                        <VisibilityOffIcon
                          onClick={() => toggleVisility(exp.id, exp.visible)}
                          sx={{
                            color: "rgba(244, 67, 54, 0.434)",
                            "&:hover": { color: "#009688" },
                          }}
                        />
                      ) : (
                        <VisibilityIcon
                          onClick={() => toggleVisility(exp.id, exp.visible)}
                          sx={{
                            color: "rgba(0, 150, 136, 0.434)",
                            "&:hover": { color: "rgba(244, 67, 54, 0.64)" },
                          }}
                        />
                      )}
                    </Tooltip>
                    <Tooltip title="Edit">
                      <EditIcon
                        onClick={() => handleEdit(exp.id)}
                        className={css.editSVG}
                      />
                    </Tooltip>
                    <Tooltip title="Delete">
                      <DeleteIcon
                        onClick={() =>
                          setAlert({
                            open: true,
                            title: "Delete this project?",
                            msg:
                              "You are about to delete <b style='font-size: 1.2em; color:#5b65ab'>" +
                              exp.name +
                              "</b>.<p>Are you sure you want to delete this?</p>",
                            confirm: () => handleDelete(exp.id),
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
                          })
                        }
                        className={css.deleteSVG}
                      />
                    </Tooltip>
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Stack>
      )}
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

export default Experience;
