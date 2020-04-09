import bioCreateMutation from "../graphql/mutations/bio-create.graphql";
import { IBioCreateData } from "../graphql/graphql-types";
import { useHistory } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";

interface ICreateBioProps {
  name: string;
  industryId: string;
}

const useCreateBio = ({ name, industryId }: ICreateBioProps) => {
  const [createBio] = useMutation<IBioCreateData>(bioCreateMutation);
  const history = useHistory();

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
