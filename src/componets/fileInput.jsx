import React, { useState, useEffect } from "react";
import { IconButton, Box } from "@mui/material";

const IconFile = (props) => {
  const [imgSrc, setImgSrc] = useState(false);

  const handleChange = (evt) => {
    const file = evt.target.files[0];

    // Make sure this is a image file

    if (["image/png", "image/jpeg", "image/gif"].includes(file.type)) {
      props.setData((prev) => {
        return { ...prev, file: file };
      });

      if (file) {
        const fileReader = new FileReader();

        fileReader.addEventListener("load", () => {
          setImgSrc(fileReader.result);

          props.setData((prev) => {
            return { ...prev, base64Value: fileReader.result, thumbnail: null };
          });
        });
        fileReader.readAsDataURL(file);
      }
    }
  };

  const reloadImage = async () => {
    if (props.base64Value && props.base64Value.length >= 1 && props.orig_name) {
      // Convert the base64 string into a binary file

      const req = await fetch(props.base64Value);

      const blob = await req.blob();

      // Include the name inside of the blob

      props.setData((prev) => {
        return { ...prev, file: blob, orig_name: props.orig_name };
      });

      setImgSrc(props.base64Value);
    }

    // For edit projects

    if (props.thumbnail && props.thumbnail.length >= 1) {
      setImgSrc("/api/v2/images/thumbnails/" + props.thumbnail);
    }
  };

  useEffect(() => {
    reloadImage();
  }, [props.base64Value, props.thumbnail]);

  return (
    <Box>
      {imgSrc && (
        <Box sx={{ position: "absolute", top: 0, left: 0, zIndex: 2 }}>
          <img src={imgSrc} />
        </Box>
      )}
      <IconButton
        sx={{
          width: "max-content",
          position: "relative",
          zIndex: 3,
          ...props.sx,
          "& svg": {
            width: props.width,
            ...(props.height
              ? { height: props.height }
              : { height: props.width }),
          },
        }}
        size="large"
      >
        <input
          onChange={handleChange}
          type="file"
          style={{
            position: "absolute",
            zIndex: 9,
            opacity: 0,
            display: "block",
            width: `calc(${props.width}px + 20px)`,
            height: `calc(${props.width}px + 15px)`,
          }}
        />
        {props.icon}
      </IconButton>
    </Box>
  );
};

export default IconFile;
