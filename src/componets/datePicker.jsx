import React, { useState, useRef, useEffect } from "react";
import { Box, Stack, Checkbox } from "@mui/material";
import css from "./datePicker.module.css";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const DatePicker = ({ order, present = false, month, year, date, setDate }) => {
  const [showMonthOptions, setShowMonthOptions] = useState(false);
  const [showYearOptions, setShowYearOptions] = useState(false);
  const [isPresent, setIsPresent] = useState(false);
  const initLoad = useRef(false);
  const dateLoaded = useRef(false);
  const years = useRef([]);

  useEffect(() => {
    setDate((prev) => {
      return { ...prev, month, year };
    });
  }, [month, year]);

  const handleToggleMonthOptions = (evt) => {
    if (evt) {
      evt.stopPropagation();
      setShowMonthOptions((prev) => !prev);
    }
  };

  const handleToggleYearOptions = (evt) => {
    if (evt) {
      evt.stopPropagation();
      setShowYearOptions((prev) => !prev);
    }
  };

  const selectMonth = (evt, month) => {
    evt.stopPropagation();
    setDate((prev) => {
      return { ...prev, month };
    });

    setShowMonthOptions(false);
    setIsPresent(false);
  };

  const selectYear = (evt, year) => {
    if (evt) {
      evt.stopPropagation();
      setDate((prev) => {
        return { ...prev, year };
      });
      setIsPresent(false);
      setShowYearOptions(false);
    }
  };

  useEffect(() => {
    if (initLoad.current === false) {
      generateYears();

      const listener = document.addEventListener("click", (evt) => {
        setShowMonthOptions((prev) => (prev ? false : false));
        setShowYearOptions((prev) => (prev ? false : false));
      });

      return () => {
        document.removeEventListener("click", listener);
        initLoad.current = true;
      };
    }
  }, []);

  const generateYears = () => {
    const currYear = new Date().getFullYear();

    for (let i = currYear; i >= 1900; i--) {
      years.current.push(i);
    }
  };

  const handleCheck = (evt) => {
    if (evt.target.checked) {
      setIsPresent(true);
      setDate(() => {
        return { month: "N/A", year: "N/A" };
      });
    } else {
      setIsPresent(false);
      setDate({ month: "", year: "" });
    }
  };

  return (
    <React.Fragment>
      <Stack className={css.dateInput} sx={{ order, flexDirection: "row" }}>
        <Stack className={css.month}>
          <Stack
            className={css.monthInput}
            sx={{
              justifyContent: "center",
              alignContent: "center",
              flexDirection: "row",
            }}
            onClick={handleToggleMonthOptions}
            tabIndex={0}
          >
            <Box sx={{ order: 1 }}>Month</Box>
            <Box
              sx={{
                order: 3,
                margin: 0,
                height: "18px",
                borderBottom: "1px dashed #373737",
                minWidth: "50px",
                marginLeft: 1,
                display: "inline-block",
                textAlign: "center",
                letterSpacing: "3px",
                paddingBottom: "20px",
                color: "#b8b8b8",
                fontWeight: "100",
              }}
            >
              {date.month ? date.month : "---"}
            </Box>
            <CalendarMonthIcon sx={{ order: 2 }} />
          </Stack>
        </Stack>
        {showMonthOptions && (
          <Stack
            sx={{
              zIndex: 99999,
              position: "absolute",
              left: "0",
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(0, 0, 0, 0.81)",
              backdropFilter: "blur(4px)",
              maxHeight: "220px",
              overflowY: "scroll",
              borderRadius: "5px",
              userSelect: "none",
              "& span": {
                marginBottom: "2px",
                background: "rgba(16, 20, 24, 0.66)",
                padding: "10px",
                cursor: "pointer",
              },
              "& span:hover": {
                color: "rgb(127, 225, 255)",
              },
            }}
            tabIndex={0}
          >
            <span onClick={(evt) => selectMonth(evt, "Jan")}>January</span>
            <span onClick={(evt) => selectMonth(evt, "Feb")}>Febuary</span>
            <span onClick={(evt) => selectMonth(evt, "Mar")}>March</span>
            <span onClick={(evt) => selectMonth(evt, "Apr")}>April</span>
            <span onClick={(evt) => selectMonth(evt, "May")}>May</span>
            <span onClick={(evt) => selectMonth(evt, "Jun")}>June</span>
            <span onClick={(evt) => selectMonth(evt, "July")}>July</span>
            <span onClick={(evt) => selectMonth(evt, "Aug")}>August</span>
            <span onClick={(evt) => selectMonth(evt, "Sep")}>September</span>
            <span onClick={(evt) => selectMonth(evt, "Oct")}>October</span>
            <span onClick={(evt) => selectMonth(evt, "Nov")}>November</span>
            <span onClick={(evt) => selectMonth(evt, "Dec")}>December</span>
          </Stack>
        )}
        <Box sx={{ position: "relative" }} onClick={handleToggleYearOptions}>
          <Stack className={css.year} sx={{ order: 1 }}>
            <Box tabIndex={0}>Year</Box>
            <Box
              sx={{
                padding: 0,
                margin: 0,
                height: "18px",
                borderBottom: "1px dashed #373737",
                minWidth: "60px",
                marginLeft: 1,
                display: "inline-block",
                textAlign: "center",
                letterSpacing: "2px",
                paddingBottom: "20px",
                position: "relative",
                order: 3,
              }}
            >
              {date.year ? date.year : "----"}
            </Box>
            <CalendarMonthIcon sx={{ order: 2 }} />
          </Stack>
          {showYearOptions && (
            <Stack
              sx={{
                zIndex: 99999,
                position: "absolute",
                right: "0",
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(0, 0, 0, 0.81)",
                backdropFilter: "blur(4px)",
                maxHeight: "220px",
                overflowY: "scroll",
                borderRadius: "5px",
                userSelect: "none",
                "& span": {
                  marginBottom: "2px",
                  background: "rgba(16, 20, 24, 0.66)",
                  padding: "10px 20px 10px 20px",
                  cursor: "pointer",
                },
                "& span:hover": {
                  color: "rgb(127, 225, 255)",
                },
              }}
              tabIndex={0}
            >
              {years.current.map((year, index) => (
                <Box
                  onClick={(evt) => selectYear(evt, year)}
                  key={index}
                  component="span"
                >
                  {year}
                </Box>
              ))}
            </Stack>
          )}
        </Box>
        {present && (
          <Box
            sx={{
              zIndex: 999,
              position: "absolute",
              top: "-60%",
              transform: "translateY(-60%)",
              right: 0,
              fontSize: "14px",
              color: "rgb(70, 75, 80)",
            }}
          >
            <label htmlFor="present">
              Present{" "}
              <Checkbox
                id="present"
                type="checkbox"
                sx={{
                  color: "rgba(46, 46, 46, 0.45)",
                  width: "10px",
                  height: "10px",
                  "&.Mui-checked": {
                    color: "rgba(75, 135, 177, 0.45)",
                  },
                }}
                checked={isPresent}
                disableRipple
                onChange={handleCheck}
              />
            </label>
          </Box>
        )}
      </Stack>
    </React.Fragment>
  );
};

export default DatePicker;
