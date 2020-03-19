import React from "react";
import ReactDOM from "react-dom";

const App = () => {
  return <div>Hellow Werld</div>;
};

document.addEventListener("DOMContentLoaded", () => {
  const rootEl = document.getElementById("root");
  ReactDOM.render(<App />, rootEl);
});
