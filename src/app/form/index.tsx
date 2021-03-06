import upperFirst from "lodash/upperFirst";
import React, { useState, useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import getIndustriesQuery from "../graphql/queries/get-industries.graphql";
import { IIndustry, IIndustriesData } from "../graphql/graphql-types";
import styles from "./css/form.css";
import Button from "../button";
import useCreateBio from "../custom-hooks/use-create-bio";
import classnames from "classnames";
import { SessionContext } from "../session-context";

const Form = () => {
  const [name, setName] = useState("");
  const [industryId, setIndustryId] = useState("");
  const { sessionId } = useContext(SessionContext);
  const { loading, error, data } = useQuery<IIndustriesData>(
    getIndustriesQuery,
  );
  const onSubmit = useCreateBio({ name, industryId, sessionId });

  if (loading) return null;
  if (error) {
    console.error(`Error loading industries: ${error}`);
    return null;
  }

  const industryOptionsHtml = data
    ? data.industries.map((industryOption: IIndustry) => (
        <option key={industryOption.id} value={industryOption.id}>
          {upperFirst(industryOption.name)}
        </option>
      ))
    : [];

  return (
    <div>
      <div className={classnames(styles.formTitle, styles.formItem)}>
        What is your name?
      </div>
      <input
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setName(e.currentTarget.value)
        }
      />
      <br />
      <br />
      <div className={classnames(styles.formTitle, styles.formItem)}>
        In what industry do you conduct business?
      </div>
      <select
        onChange={(e) => setIndustryId(e.currentTarget.value)}
        defaultValue="default"
        className={classnames(styles.select, styles.formItem)}
      >
        <option value="default" disabled>
          Select an industry
        </option>
        {industryOptionsHtml}
      </select>
      <br />
      <br />
      <Button buttonText="Make my bio!" onClick={onSubmit} />
    </div>
  );
};

export default Form;
