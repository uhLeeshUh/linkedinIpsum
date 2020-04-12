import dotenv from "dotenv";
dotenv.config();
import Knex from "knex";
import knexConfig from "../server/knex/knexfile";
import { Model } from "objection";

interface IScriptRunnerConfig {
  scriptName: string;
}

const scriptRunner = (
  scriptFn: () => Promise<any>,
  scriptRunnerConfig: IScriptRunnerConfig,
): void => {
  const isTestEnv = process.env.NODE_ENV === "test";
  if (!isTestEnv) {
    const config = knexConfig[process.env.NODE_ENV || "development"];
    config.connection.application_name = scriptRunnerConfig.scriptName;

    const knex = Knex(config);
    Model.knex(knex);

    console.log(`Starting to run script ${scriptRunnerConfig.scriptName}`);

    scriptFn().then(
      (result) => {
        console.log(
          `Successfully ran script ${
            scriptRunnerConfig.scriptName
          } with result ${JSON.stringify(result)}`,
        );
        process.exit(0);
      },
      (err: Error) => {
        console.error(
          `ERROR running script ${scriptRunnerConfig.scriptName}: ${err}`,
        );
        process.exit(1);
      },
    );
  }
};

export default scriptRunner;
