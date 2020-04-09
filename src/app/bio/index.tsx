import { useQuery, useMutation } from "@apollo/react-hooks";
import React from "react";
import { useParams } from "react-router-dom";
import getBioQuery from "../graphql/queries/get-bio.graphql";
import bioOptimizeMutation from "../graphql/mutations/bio-optimize.graphql";
import { IBioData, IBio, IBioOptimizeData } from "../graphql/graphql-types";
import find from "lodash/find";
import { useHistory } from "react-router-dom";
import Variable from "../variable";
import styles from "./css/bio.css";
import classnames from "classnames";
import Button from "../button";

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

  const onClickOptimize = async () => {
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

  const onClickCreateNewBio = () => {
    history.push("/form");
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
      <Button buttonText="Optimize my bio!" onClick={onClickOptimize} />
    ) : null;
  };

  return (
    <>
      <div>
        <h2 className={styles.bioContent}>
          {data && data.bio ? data.bio.name : "Business Professional"}
        </h2>
      </div>
      <br />
      <div>
        <h3 className={styles.bioContent}>About</h3>
        <p className={classnames(styles.bioContent, styles.bioText)}>
          {data && data.bio ? assembleBioText(data.bio) : "not defined"}
        </p>
      </div>
      <br />
      {getOptimizeButtonHtml()}
      <br />
      <Button buttonText="Go home" onClick={onClickCreateNewBio} />
    </>
  );
};

const assembleBioText = (bio: IBio) => {
  const bioTextHtml: JSX.Element[] = [];
  bio.bioChunks.forEach((bioChunk) => {
    const { templateChunk, followingVariable } = bioChunk;
    bioTextHtml.push(<span>{templateChunk.chunkText}</span>);
    if (followingVariable) {
      bioTextHtml.push(<Variable variable={followingVariable} />);
    }
  });
  return bioTextHtml;
};

export default Bio;
