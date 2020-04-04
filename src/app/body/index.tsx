import React from "react";
import styles from "./css/body.css";

const Body: React.FunctionComponent = props => {
  return (
    <>
      <div className={styles.bodyContainer}>{props.children}</div>
      {/* error handling should go here */}
    </>
  );
};

export default Body;
