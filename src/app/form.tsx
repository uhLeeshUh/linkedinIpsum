import { upperFirst } from "lodash";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";

const Form = (props: any) => {
  const { industries } = props;
  const [name, setName] = useState("");
  const [industryId, setIndustryId] = useState("");
  const history = useHistory();

  const onSubmit = async () => {
    // make graphql request to create bio
  };

  const renderIndustryOptions = industries
    ? industries.map((industryOption: any) => (
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
        {renderIndustryOptions}
      </select>
      <button type="button" onClick={onSubmit}>
        Make my profile!
      </button>
    </div>
  );
};

export default Form;
