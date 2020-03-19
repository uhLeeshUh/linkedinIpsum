import React from "react";

const Main: React.FunctionComponent = props => {
  return (
    <>
      <h1>LinkedIn Ipsum</h1>
      {props.children}
      {/* error handling should go here */}
    </>
  );
};

export default Main;
