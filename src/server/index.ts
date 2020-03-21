import path from "path";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import schema from "./graphql/make-executable-schema";

const app = express();
const DIST_DIR = path.resolve(__dirname, "..", "./app", "dist");
const HTML_FILE = path.join(DIST_DIR, "index.html");

app.use(express.static(DIST_DIR));

app.get("*", (req: express.Request, res: express.Response) => {
  res.sendFile(HTML_FILE);
});

const server = new ApolloServer(schema);
server.applyMiddleware({ app });

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 App listening to ${PORT}....`);
  console.log("Press Ctrl+C to quit.");
});
