import axios from "axios";
import useSWR from "swr";

const getUsers = async (_, trainerId) => {
  const { data } = await axios.get(`/user?trainer=${trainerId}`);
  return data;
};

export default function useUsers(trainerId) {
  const { data, error } = useSWR(trainerId ? ["/getUsers", trainerId] : null, getUsers);

  return { loading: !data && !error, data, error };
}
