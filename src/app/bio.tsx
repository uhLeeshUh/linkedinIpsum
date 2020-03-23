import { useQuery } from "@apollo/react-hooks";
import React from "react";
import { useParams } from "react-router-dom";
import getBioQuery from "./graphql/queries/get-bio.graphql";

interface IBio {
  id: string;
  name: string;
  bioText: string;
}

interface IBioResult {
  bio: IBio;
}

const Bio = () => {
  const { bioId } = useParams();
  const { data, loading } = useQuery<IBioResult>(getBioQuery, {
    variables: { bioId },
  });
  if (loading) return null;
  return (
    <>
      <div>BIO FOR: {data && data.bio ? data.bio.name : "no name"}</div>
      <div>BIO IS: {data && data.bio ? data.bio.bioText : "not defined"}</div>
    </>
  );
};

export default Bio;
