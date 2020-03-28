import React, { useEffect } from "react";
import { IVariable } from "./graphql/graphql-types";

interface IProps {
  variable: IVariable;
}

const Variable = ({ variable }: IProps) => {
  let isNewVariable = false;
  useEffect(() => {
    // TODO: use setTimeout to flip to true and then back to false
  }, [variable.id]);

  // TODO: add classnames here that spin on new variable
  // TODO: learn about spin in css
  return <span>{variable.variableText}</span>;
};

export default Variable;
