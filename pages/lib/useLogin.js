import axios from "axios";
import useSWR from "swr";

const getUserData = async (url, loginuser) => {
  const { data } = await axios.post("/login", {
    loginuser,
  });
  return data[0];
};

export default function useUser(id) {
  const { data, error } = useSWR(["getUser", id], getUserData, {
    revalidateOnFocus: false,
    dedupingInterval: 1000 * 60,
  });

  const loading = !data && !error;

  if (data) {
    return { user: data, loading };
  }

  return { user: null, loading: false };
}
