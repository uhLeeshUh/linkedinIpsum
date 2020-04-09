import bioCreateMutation from "../graphql/mutations/bio-create.graphql";
import { IBioCreateData, IBioCreateVariables } from "../graphql/graphql-types";
import { useHistory } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import noop from "lodash/noop";

interface ICreateBioProps {
  bio: IBioCreateVariables;
}

const useCreateBio = (props: ICreateBioProps | undefined) => {
  const [createBio] = useMutation<IBioCreateData, IBioCreateVariables>(
    bioCreateMutation,
  );
  const history = useHistory();

  if (!props) return noop;
  const { industryId, name } = props.bio;

  return async () => {
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
};

export default useCreateBio;
