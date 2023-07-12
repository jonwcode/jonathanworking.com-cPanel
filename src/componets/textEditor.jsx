import React, { useEffect, useRef, useState } from "react";
import { Box, IconButton } from "@mui/material";
import css from "./textEditor.module.css";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";

const TextEditor = (props) => {
  const [formats, setFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    insertUnorderedList: false,
  });

  const [preLoadText, setPreLoadText] = useState("");
  const userInput = useRef(false);
  const [activeFormat, setActiveFormat] = useState(null);

  (function trackActiveElement() {
    document.lastActiveElement = undefined;

    document.addEventListener("focusout", function (focusEvent) {
      var target = focusEvent.target.nodeName;
      document.lastActiveElement = target;
    });
  })();

  useEffect(() => {
    if (!userInput.current) {
      setPreLoadText(props.value);
    }
  }, [props.value.length]);

  const editor = useRef();

  const handleExecute = (cmd) => {
    setActiveFormat(cmd);

    document.execCommand(cmd);

    setFormats((prev) => {
      return { ...prev, [cmd]: document.queryCommandState(cmd) };
    });

    setTimeout(() => {
      editor.current.focus();
    }, 200);
  };

  const handleChange = (evt) => {
    userInput.current = true;
    if (activeFormat !== null) {
      setFormats((prev) => {
        return {
          ...prev,
          [activeFormat]: document.queryCommandState(activeFormat),
        };
      });
    }

    if (evt.type === "paste") {
      // If there is a selected portion of text, delete it
      if (window.getSelection().toString()) {
        window.getSelection().deleteFromDocument();
      }

      evt.preventDefault();
      const text = evt.clipboardData.getData("text/plain");

      props.setData((prev) => {
        return { ...prev, [props.name]: text };
      });

      editor.current.innerText += text;
      handleFocus();
    }

    props.setData((prev) => {
      return { ...prev, [props.name]: evt.target.innerHTML };
    });
  };

  const handleFocus = (evt) => {
    if (document.lastActiveElement !== "BUTTON") {
      const sel = window.getSelection();
      sel.selectAllChildren(editor.current);
      sel.collapseToEnd();
    }
  };

  return (
    <React.Fragment>
      <Box
        sx={{
          position: "relative",
          display: "inline-block",
          width: "99%",
          height: "100%",
          boxSizing: "border-box",
          order: props.order,
          ...props.parentSx,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            width: "max-content",
            right: 0,
            top: 0,
            transform: "translateY(-100%)",
          }}
        >
          <IconButton
            onClick={() => handleExecute("bold")}
            disableFocusRipple
            disableRipple
            tabIndex={-1}
          >
            <FormatBoldIcon
              style={{
                color: "rgb(90, 93, 102)",
                ...(formats.bold && {
                  color: "#bbdefb",
                }),
              }}
            />
          </IconButton>
          <IconButton
            onClick={() => handleExecute("underline")}
            disableFocusRipple
            disableRipple
            tabIndex={-1}
          >
            <FormatUnderlinedIcon
              style={{
                color: "rgb(90, 93, 102)",
                ...(formats.underline && {
                  color: "#bbdefb",
                }),
              }}
            />
          </IconButton>
          <IconButton
            disableFocusRipple
            disableRipple
            onClick={() => handleExecute("italic")}
            tabIndex={-1}
          >
            <FormatItalicIcon
              style={{
                color: "rgb(90, 93, 102)",
                ...(formats.italic && {
                  color: "#bbdefb",
                }),
              }}
            />
          </IconButton>
          <IconButton
            disableFocusRipple
            disableRipple
            onClick={() => handleExecute("insertUnorderedList")}
            tabIndex={-1}
          >
            <FormatListBulletedIcon
              style={{
                color: "rgb(90, 93, 102)",
                ...(formats.insertUnorderedList && {
                  color: "#bbdefb",
                }),
              }}
            />
          </IconButton>
        </Box>
        <Box
          ref={editor}
          suppressContentEditableWarning={true}
          className={css.editor}
          sx={{
            display: "inline-block",
            overflowY: "auto",
            maxHeight: props.maxHeight,
          }}
          contentEditable="true"
          placeholder={props.placeholder}
          onKeyUp={(evt) => handleChange(evt)}
          dangerouslySetInnerHTML={{ __html: preLoadText }}
          role="textbox"
          aria-multiline="true"
          onFocus={handleFocus}
          onPaste={(evt) => handleChange(evt)}
        />
      </Box>
    </React.Fragment>
  );
};

export default TextEditor;
