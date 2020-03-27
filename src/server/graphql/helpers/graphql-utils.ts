import express from "express";
import { Transaction, transaction, Model } from "objection";
import { isArray } from "lodash";

interface IExpressArgs {
  req: express.Request;
  res: express.Response;
}

export interface IGraphQLContext {
  getDatabaseTransaction<T>(
    testTransaction: Transaction | undefined,
    cb: (txn: Transaction) => Promise<T>,
  ): Promise<T>;
  testTransaction?: Transaction;
}

export const getGraphQLContext = async ({ req, res }: IExpressArgs) => {
  const getDatabaseTransaction = async <T>(
    testTransaction: Transaction | undefined,
    cb: (txn: Transaction) => Promise<T>,
  ): Promise<T> => {
    try {
      if (testTransaction) {
        return cb(testTransaction);
      } else if (req) {
        return cb(await transaction.start(Model.knex()));
      }
    } catch (err) {
      console.error(
        `ERROR Cannot get database txn for GraphQL context: ${err}`,
      );
    }
    return transaction(Model.knex(), cb);
  };

  if (req) {
    logGraphQLRequest(req);
  }

  return { getDatabaseTransaction };
};

const logGraphQLRequest = (req: express.Request) => {
  const { variables } = req.body;

  const requests = isArray(req.body) ? req.body : [req.body];
  requests.forEach(request => {
    const formattedQuery =
      request && request.query
        ? request.query.replace(/\s*\n\s*/g, " ")
        : "no query";
    const formattedVariables = JSON.stringify(variables);
    const operationName = request.operationName;

    console.log(
      `GRAPHQL REQUEST:\noperationName: ${operationName}\nquery: ${formattedQuery}\nvariables: ${formattedVariables}\n`,
    );
  });
};
