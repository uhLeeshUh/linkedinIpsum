import upperFirst from "lodash/upperFirst";
import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import getIndustriesQuery from "../graphql/queries/get-industries.graphql";
import { IIndustry, IIndustriesData } from "../graphql/graphql-types";
import styles from "./css/form.css";
import Button from "../button";
import useCreateBio from "../custom-hooks/use-create-bio";

const Form = () => {
  const [name, setName] = useState("");
  const [industryId, setIndustryId] = useState("");
  const { loading, error, data } = useQuery<IIndustriesData>(
    getIndustriesQuery,
  );
  const onSubmit = useCreateBio({ name, industryId });

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
      <div className={styles.formTitle}>What is your name?</div>
      <input
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setName(e.currentTarget.value)
        }
      />
      <br />
      <br />
      <div className={styles.formTitle}>
        In what industry do you conduct business?
      </div>
      <select
        onChange={(e) => setIndustryId(e.currentTarget.value)}
        defaultValue="default"
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
