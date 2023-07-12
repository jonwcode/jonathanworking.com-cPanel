import React, { useState, useRef, useEffect } from "react";
import { Stack, Box, Typography } from "@mui/material";
import css from "./tagInput.module.css";
import CloseIcon from "@mui/icons-material/Close";

const TagInput = ({
  tags,
  setTags,
  placeholder,
  sx,
  error,
  errorMsg,
  value,
}) => {
  //const [inputVal, setInputVal] = useState({ val: "" });
  const inputVal = useRef("");
  const tagInput = useRef("");
  const backspaceCount = useRef(0);
  const timeout = useRef(null);
  const blurTimeout = useRef(null);

  useEffect(() => {
    if (value) {
      setTags(value);
    }
  }, [value.length]);

  const handleChange = (evt) => {
    const val = evt.target.innerHTML.replace(/&nbsp;/g, "").trim();
    const maxInputLength = 30;
    const sel = window.getSelection();

    // handle backspace
    if (evt.key === "Backspace" || sel.toString()) {
      if (sel.toString()) {
        const stringNow = val.slice(0, -sel.toString().length);

        tagInput.current.innerHTML = stringNow;
        fixCaret();
        return;
      } else {
        //inputVal.current = tagInput.current;
      }
    }

    // Create a new tag                                     // 32 = spacebar
    if (evt.key === "Enter" || evt.key === "," || evt.keyCode === 32) {
      evt.preventDefault();

      if (val.length >= 1) {
        const tagArray = [...tags, val];

        setTags(tagArray);
      }

      // Clear input
      inputVal.current = "";
      tagInput.current.innerHTML = "";
      return;
    }

    if (inputVal.current.length >= maxInputLength) {
      evt.preventDefault(); // Stop it fron adding characters
      return;
    }

    inputVal.current = val;

    tagInput.current.innerHTML = val;
    fixCaret();
  };

  const handleInputFocus = (evt) => {
    clearTimeout(blurTimeout.current); // Prevent blinking
    if (!tagInput.current.hasAttribute("focus")) {
      tagInput.current.parentNode.setAttribute("focus", "");
      // tagInput.current.focus();
    }
  };

  const handleBlur = (evt) => {
    blurTimeout.current = setTimeout(() => {
      tagInput.current.parentNode.removeAttribute("focus", "");
    }, 200);
  };

  const fixCaret = () => {
    // Reset the caret to the end
    const sel = window.getSelection();
    sel.selectAllChildren(tagInput.current);
    sel.collapseToEnd();
  };

  const handleMouseDown = (evt) => {
    // Fix range selection

    var range = document.createRange();
    range.selectNodeContents(tagInput.current);
    var sel = window.getSelection();
    sel.removeAllRanges();
  };

  const handleRemoveTag = (index) => {
    const filtered = tags.filter((elem, elemIndex) => elemIndex !== index);
    setTags(filtered);
  };

  const doubleTapDelete = (evt) => {
    // Double tap backspace for delete last
    // one in array
    if (evt.key === "Backspace") {
      clearTimeout(timeout.current);
      backspaceCount.current++;

      // If rapid tap backscape twice, knock the last one off the array
      if (backspaceCount.current >= 2 && inputVal.current.length <= 0) {
        const tagsNow = [...tags];
        tagsNow.pop();
        setTags(tagsNow);
        backspaceCount.current = 0;
      }

      timeout.current = setTimeout(() => {
        backspaceCount.current = 0;
      }, 200);

      return;
    }
  };

  return (
    <Stack sx={{ ...sx }}>
      <Box
        sx={{ order: 2 }}
        className={css.inputContainer}
        onMouseDown={handleMouseDown}
        onClick={(evt) => handleInputFocus(evt)}
        {...(error && {
          className: [css.inputError, css.inputContainer],
          error: errorMsg,
        })}
      >
        {tags.map((tag, index) => (
          <Box data-tag={tag.toLowerCase()} key={index} className={css.tag}>
            {tag} <CloseIcon onClick={() => handleRemoveTag(index)} />
          </Box>
        ))}
        <Box
          ref={tagInput}
          onKeyDown={handleChange}
          onKeyUp={doubleTapDelete}
          onBlur={(evt) => handleBlur(evt)}
          onFocus={(evt) => handleInputFocus(evt)}
          component="span"
          sx={{
            minWidth: 50,
            margin: "10px",
            display: "inline-block",
            outline: "none",
          }}
          onChange={handleChange}
          contentEditable
          placeholder={placeholder}
        ></Box>
      </Box>
      <Typography sx={{ marginTop: 1 }} variant="inputTitle" required>
        Project Tags
      </Typography>
    </Stack>
  );
};

export default TagInput;
