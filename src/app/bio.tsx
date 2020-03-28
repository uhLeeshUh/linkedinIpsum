import { useQuery, useMutation } from "@apollo/react-hooks";
import React from "react";
import { useParams } from "react-router-dom";
import getBioQuery from "./graphql/queries/get-bio.graphql";
import bioOptimizeMutation from "./graphql/mutations/bio-optimize.graphql";
import { IBioData, IBio, IBioOptimizeData } from "./graphql/graphql-types";
import { find } from "lodash";
import { useHistory } from "react-router-dom";
import Variable from "./variable";

const Bio = () => {
  const { bioId } = useParams();
  const history = useHistory();
  const { data, loading, error } = useQuery<IBioData>(getBioQuery, {
    variables: { bioId },
  });
  const [optimizeBio] = useMutation<IBioOptimizeData>(bioOptimizeMutation);

  if (loading && !data) return null;
  if (error) {
    console.error(`Error loading bio: ${error}`);
    return null;
  }

  const onClick = async () => {
    if (data) {
      try {
        const result = await optimizeBio({
          variables: { bioId, name: data.bio.name },
        });

        if (result.data) {
          history.push(`/bio/${result.data.bioOptimize.id}`);
        }
      } catch (err) {
        console.error(`ERROR optimizing bio: ${err}`);
      }
    }
  };

  const getOptimizeButtonHtml = () => {
    let bioChunkWithVariable;
    if (data) {
      const {
        bio: { bioChunks },
      } = data;
      bioChunkWithVariable = find(bioChunks, "followingVariable");
    }
    return bioChunkWithVariable ? (
      <button onClick={onClick}>Optimize!</button>
    ) : null;
  };

  return (
    <>
      <div>
        <h2>{data && data.bio ? data.bio.name : "Business Professional"}</h2>
      </div>
      <div>{data && data.bio ? assembleBioText(data.bio) : "not defined"}</div>
      <br />
      {getOptimizeButtonHtml()}
    </>
  );
};

const assembleBioText = (bio: IBio) => {
  const bioTextHtml: JSX.Element[] = [];
  bio.bioChunks.forEach(bioChunk => {
    const { templateChunk, followingVariable } = bioChunk;
    bioTextHtml.push(<span>{templateChunk.chunkText}</span>);
    if (followingVariable) {
      bioTextHtml.push(<Variable variable={followingVariable} />);
    }
  });
  return bioTextHtml;
};

export default Bio;
