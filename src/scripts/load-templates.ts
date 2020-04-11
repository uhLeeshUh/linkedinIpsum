/*
USAGE:

This script loads new templates into the database.

ARG:
(1) name of typescript seed file with templates array

EXAMPLE: (for seed file templates-seed-1.ts)

npm run load-templates:dev templates-seed-1.ts
*/

import { transaction, Model, Transaction } from "objection";
import createTemplatesUtil from "../util/create-templates-util";
import fs from "fs";
import path from "path";
import scriptRunner from "./script-runner";

export const loadTemplates = async (
  templatesFileName: string,
  testTxn?: Transaction,
): Promise<void> => {
  try {
    await transaction(testTxn || Model.knex(), async (txn) => {
      const templatesFilePath = path.join(
        __dirname,
        "./templates",
        templatesFileName,
      );
      if (!fs.existsSync(templatesFilePath)) {
        return Promise.reject(
          `Cannot locate file at path ${templatesFilePath}`,
        );
      }

      const templatesArray = require(templatesFilePath).default;

      console.log(
        `[LOAD TEMPLATES]: Loaded templates array as ${JSON.stringify(
          templatesArray,
        )}`,
      );

      return createTemplatesUtil(templatesArray, txn);
    });
  } catch (err) {
    console.error(`[LOAD TEMPLATES ERROR]: ${err}`);
    return err;
  }
};

const main = async () => {
  const args = process.argv;
  return loadTemplates(args[2]);
};

scriptRunner(main, {
  scriptName: "load-new-templates",
});
