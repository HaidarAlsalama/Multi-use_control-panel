import { useQuery } from "@tanstack/react-query";
import { useAxiosWithAuth } from "Hooks/useAxiosWithAuth";


export const useClientCategories = (parentId = null) => {
    const api = useAxiosWithAuth();

    const getData = async ({ queryKey }) => {
        const [_key, parentId] = queryKey;

        const { data } = await api.get(`user/categories/${parentId !== null ? parentId : ''}`);
        return data;
    };

    return useQuery({
        refetchOnWindowFocus: false,
        queryKey: ['client-categories', parentId],
        queryFn: getData,
        enabled: true,
        retry: false,
    });
};

export const useClientSearchCategories = (name) => {
    const api = useAxiosWithAuth();

    const getData = async ({ queryKey }) => {
        const [_key, name] = queryKey;

        const { data } = await api.get(`user/search`, {
            params: {
                name
            }
        });
        return data;
    };

    return useQuery({
        refetchOnWindowFocus: false,
        queryKey: ['client-search-categories', name],
        queryFn: getData,
        enabled: !!name,
        retry: false,
    });
};
