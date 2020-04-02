import React from "react";
import Header from "./header";
import "./css/main.css";

const Main: React.FunctionComponent = props => {
  return (
    <>
      <Header />
      {props.children}
      {/* error handling should go here */}
    </>
  );
};

export default Main;
