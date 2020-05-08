import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import routes from "./routes";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import { v4 as uuid } from "uuid";
import { SessionContext } from "./session-context";

const client = new ApolloClient();

const App = () => {
  return (
    <ApolloProvider client={client}>
      <SessionContext.Provider value={{ sessionId: uuid() }}>
        <BrowserRouter>{routes}</BrowserRouter>
      </SessionContext.Provider>
    </ApolloProvider>
  );
};

document.addEventListener("DOMContentLoaded", () => {
  const rootEl = document.getElementById("root");
  ReactDOM.render(<App />, rootEl);
});
