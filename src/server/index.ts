import path from "path";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import schema from "./graphql/make-executable-schema";
import knexConfig from "./knex/db";
import Knex from "knex";
import { Model } from "objection";

const app = express();

const DIST_DIR = path.resolve(__dirname, "..", "./app", "dist");
const HTML_FILE = path.join(DIST_DIR, "index.html");

// compiled static asset bundle (javascript, css) to run in client browser
app.use(express.static(DIST_DIR));

// serve HTML file for React to plug into
app.get("*", (req: express.Request, res: express.Response) => {
  res.sendFile(HTML_FILE);
});

// wire up connection to the database
const knex = Knex(knexConfig);

// wire up Objection to database connection
Model.knex(knex);

const server = new ApolloServer(schema);
server.applyMiddleware({ app });

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 App listening to ${PORT}....`);
  console.log("Press Ctrl+C to quit.");
});
