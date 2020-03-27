import { useQuery } from "@apollo/react-hooks";
import React from "react";
import { useParams } from "react-router-dom";
import getBioQuery from "./graphql/queries/get-bio.graphql";
import { IBioData, IBio } from "./graphql/graphql-types";

const Bio = () => {
  const { bioId } = useParams();
  const { data, loading, error } = useQuery<IBioData>(getBioQuery, {
    variables: { bioId },
  });

  if (loading) return null;
  if (error) {
    console.error(`Error loading bio: ${error}`);
  }

  return (
    <>
      <div>
        BIO FOR: {data && data.bio ? data.bio.name : "Business Professional"}
      </div>
      <div>
        BIO IS: {data && data.bio ? assembleBioText(data.bio) : "not defined"}
      </div>
    </>
  );
};

const assembleBioText = (bio: IBio) => {
  let bioText = "";
  bio.bioChunks.forEach(bioChunk => {
    const { templateChunk, followingVariable } = bioChunk;
    bioText += templateChunk.chunkText;
    if (followingVariable) {
      bioText += followingVariable.variableText;
    }
  });
  return bioText;
};

export default Bio;
