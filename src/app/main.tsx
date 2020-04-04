import React from "react";
import Header from "./header";
import Body from "./body";
import "./css/main.css";

const Main: React.FunctionComponent = props => {
  return (
    <>
      <Header />
      <Body>{props.children}</Body>
    </>
  );
};

export default Main;
