import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import routes from "./routes";

const App = () => {
  return <BrowserRouter>{routes}</BrowserRouter>;
};

document.addEventListener("DOMContentLoaded", () => {
  const rootEl = document.getElementById("root");
  ReactDOM.render(<App />, rootEl);
});
