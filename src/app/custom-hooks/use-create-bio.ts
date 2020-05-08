import bioCreateMutation from "../graphql/mutations/bio-create.graphql";
import { IBioCreateData, IBioCreateVariables } from "../graphql/graphql-types";
import { useHistory } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import noop from "lodash/noop";

const useCreateBio = (props: IBioCreateVariables | undefined) => {
  const [createBio] = useMutation<IBioCreateData, IBioCreateVariables>(
    bioCreateMutation,
  );
  const history = useHistory();

  if (!props) return noop;

  return async () => {
    try {
      const result = await createBio({
        variables: props,
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
