import React from "react";
import About from "./about";
import Experience from "./experience";
import Header from "./componets/header";

const CPanel = () => {
  return (
    <React.Fragment>
      <Header title="Home" />
      <Experience />
      <About />
    </React.Fragment>
  );
};

export default CPanel;
