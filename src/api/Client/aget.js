import { useQuery } from "@tanstack/react-query";
import { useAxiosWithAuth } from "Hooks/useAxiosWithAuth";


export const useClientAgents = (name = "") => {
    const api = useAxiosWithAuth();

    const getData = async ({ queryKey }) => {
        const [_key, name] = queryKey;

        const { data } = await api.get('user/agents', {
            params: { name },
        });
        return data;
    };

    return useQuery({
        refetchOnWindowFocus: false,
        queryKey: ['client-agents', name],
        queryFn: getData,
        retry: false,
    });
};
