import { useQuery } from "@tanstack/react-query";
import { useAxiosWithAuth } from "Hooks/useAxiosWithAuth";


export const useClientAds = () => {
    const api = useAxiosWithAuth();

    const getData = async () => {
        const { data } = await api.get('user/advertisements');
        return data;
    };

    return useQuery({
        refetchOnWindowFocus: false,
        queryKey: ['client-ads'],
        queryFn: getData,
        retry: false,
    });
};
