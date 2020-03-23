import { upperFirst } from "lodash";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import getIndustriesQuery from "./graphql/queries/get-industries.graphql";

interface IIndustry {
  id: string;
  name: string;
}

interface IGraphqlProps {
  loading: boolean;
  data: { industries: IIndustry[] };
}

const Form = () => {
  const [name, setName] = useState("");
  const [industryId, setIndustryId] = useState("");
  const history = useHistory();
  const { loading, error, data } = useQuery(getIndustriesQuery);

  const onSubmit = async () => {
    // make graphql request to create bio
  };

  if (loading) return null;

  const industryOptionsHtml = data.industries
    ? data.industries.map((industryOption: IIndustry) => (
        <option key={industryOption.id} value={industryOption.id}>
          {upperFirst(industryOption.name)}
        </option>
      ))
    : [];

  return (
    <div>
      <div>What is your first name?</div>
      <input
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setName(e.currentTarget.value)
        }
      />
      <div>In what industry do you conduct business?</div>
      <select
        onChange={e => setIndustryId(e.currentTarget.value)}
        defaultValue="default"
      >
        <option value="default" disabled>
          Select an industry
        </option>
        {industryOptionsHtml}
      </select>
      <button type="button" onClick={onSubmit}>
        Make my profile!
      </button>
    </div>
  );
};

export default Form;
