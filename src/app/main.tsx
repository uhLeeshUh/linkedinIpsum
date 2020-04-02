import React from "react";
import Header from "./header";

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
