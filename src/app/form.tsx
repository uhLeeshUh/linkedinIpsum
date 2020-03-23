import { upperFirst } from "lodash";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/react-hooks";
import getIndustriesQuery from "./graphql/queries/get-industries.graphql";
import bioCreateMutation from "./graphql/mutations/bio-create.graphql";

interface IIndustry {
  id: string;
  name: string;
}

interface IIndustriesResult {
  industries: IIndustry[];
}

interface IBioCreateResult {
  data: {
    bioCreate: {
      id: string;
      name: string;
      bioText: string;
    };
  };
}

const Form = () => {
  const [name, setName] = useState("");
  const [industryId, setIndustryId] = useState("");
  const history = useHistory();
  const { loading, error, data } = useQuery<IIndustriesResult>(
    getIndustriesQuery,
  );
  const [createBio] = useMutation(bioCreateMutation);

  const onSubmit = async () => {
    try {
      const result = (await createBio({
        variables: { industryId, name },
      })) as IBioCreateResult;
      console.log("RESULT!", result);

      if (result.data) {
        history.push(`/bio/${result.data.bioCreate.id}`);
      }
    } catch (err) {
      console.error(`ERROR: ${err}`);
    }
  };

  if (loading) return null;

  const industryOptionsHtml = data
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
