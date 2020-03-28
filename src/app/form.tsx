import { upperFirst } from "lodash";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/react-hooks";
import getIndustriesQuery from "./graphql/queries/get-industries.graphql";
import bioCreateMutation from "./graphql/mutations/bio-create.graphql";
import {
  IIndustry,
  IIndustriesData,
  IBioCreateData,
} from "./graphql/graphql-types";

const Form = () => {
  const [name, setName] = useState("");
  const [industryId, setIndustryId] = useState("");
  const history = useHistory();
  const { loading, error, data } = useQuery<IIndustriesData>(
    getIndustriesQuery,
  );
  const [createBio] = useMutation<IBioCreateData>(bioCreateMutation);

  const onSubmit = async () => {
    try {
      const result = await createBio({
        variables: { industryId, name },
      });

      if (result.data) {
        history.push(`/bio/${result.data.bioCreate.id}`);
      }
    } catch (err) {
      console.error(`ERROR creating bio: ${err}`);
    }
  };

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
      <div>What is your name?</div>
      <input
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setName(e.currentTarget.value)
        }
      />
      <br />
      <br />
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
      <br />
      <br />
      <button type="button" onClick={onSubmit}>
        Make my profile!
      </button>
    </div>
  );
};

export default Form;
