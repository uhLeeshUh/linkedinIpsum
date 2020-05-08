import { useQuery, useMutation } from "@apollo/react-hooks";
import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import getBioQuery from "../graphql/queries/get-bio.graphql";
import bioOptimizeMutation from "../graphql/mutations/bio-optimize.graphql";
import {
  IBioData,
  IBio,
  IBioOptimizeData,
  IBioOptimizeVariables,
  IBioResolveVariables,
} from "../graphql/graphql-types";
import find from "lodash/find";
import { useHistory } from "react-router-dom";
import Variable from "../variable";
import styles from "./css/bio.css";
import classnames from "classnames";
import Button from "../button";
import useCreateBio from "../custom-hooks/use-create-bio";
import profileBannerImagePath from "../assets/banner.jpg";
import { SessionContext } from "../session-context";

const Bio = () => {
  const { bioId } = useParams();
  const history = useHistory();
  const { sessionId } = useContext(SessionContext);
  const { data, loading, error } = useQuery<IBioData, IBioResolveVariables>(
    getBioQuery,
    {
      variables: { bioId: bioId! },
    },
  );
  const [optimizeBio] = useMutation<IBioOptimizeData, IBioOptimizeVariables>(
    bioOptimizeMutation,
  );
  const onClickCreateNewBio = useCreateBio(
    data
      ? { name: data.bio.name, industryId: data.bio.industryId, sessionId }
      : undefined,
  );

  if (loading && !data) return null;
  if (error) {
    console.error(`Error loading bio: ${error}`);
    return null;
  }

  const onClickOptimize = async () => {
    if (data) {
      try {
        const result = await optimizeBio({
          variables: { bioId: data.bio.id, sessionId },
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
      <Button buttonText="Optimize my bio!" onClick={onClickOptimize} />
    ) : null;
  };

  return (
    <div className={styles.bioContainer}>
      <section
        className={classnames(styles.bioSection, styles.bioIntroContainer)}
      >
        <div className={styles.profilePicContainer} />
        <div className={classnames(styles.bioIntroContainerItem)}>
          <img
            className={styles.bioBannerImage}
            src={profileBannerImagePath}
            alt="Profile Banner"
          />
        </div>
        <div
          className={classnames(
            styles.bioIntroContainerItem,
            styles.bioIntroContent,
          )}
        >
          <div className={styles.bioButtons}>
            {getOptimizeButtonHtml()}
            <Button buttonText="New bio" onClick={onClickCreateNewBio} />
          </div>
          <h2 className={styles.bioContent}>
            {data && data.bio ? data.bio.name : "Business Professional"}
          </h2>
          <h3 className={classnames(styles.bioContent)}>My dope title here!</h3>
          <h6
            className={classnames(
              styles.bioContent,
              styles.bioIntroContentFooterText,
            )}
          >
            500+ connections &middot; Contact info
          </h6>
        </div>
      </section>

      <section
        className={classnames(styles.bioSection, styles.bioAboutContainer)}
      >
        <h3 className={styles.bioContent}>About</h3>
        <p className={classnames(styles.bioContent, styles.bioText)}>
          {data && data.bio ? assembleBioText(data.bio) : "not defined"}
        </p>
      </section>
    </div>
  );
};

const assembleBioText = (bio: IBio) => {
  const bioTextHtml: JSX.Element[] = [];
  bio.bioChunks.forEach((bioChunk, i) => {
    const { id, templateChunk, followingVariable } = bioChunk;
    bioTextHtml.push(<span key={id}>{templateChunk.chunkText}</span>);
    if (followingVariable) {
      bioTextHtml.push(<Variable key={i} variable={followingVariable} />);
    }
  });
  return bioTextHtml;
};

export default Bio;
