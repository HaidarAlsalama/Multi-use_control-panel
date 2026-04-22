import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAlert } from "components/Alert/Alert";
import { useAxiosWithAuth } from "Hooks/useAxiosWithAuth";


export const useAds = (name = "", perPage = 10, page = 1) => {
    const api = useAxiosWithAuth();

    const getData = async ({ queryKey }) => {
        const [_key, perPage, page, name] = queryKey;

        const { data } = await api.get('advertisements', {
            params: {
                perPage,
                page,
                name
            },
        });
        return data;
    };

    return useQuery({
        refetchOnWindowFocus: false,
        queryKey: ['ads', perPage, page, name],
        queryFn: getData,
        enabled: true,
        retry: false,
    });
};


export const useAdsById = (id) => {
    const api = useAxiosWithAuth();

    const getData = async ({ queryKey }) => {
        const [_key, id] = queryKey;
        const { data } = await api.get(`advertisements/${id}`);
        return data;
    };

    return useQuery({
        refetchOnWindowFocus: false,
        queryKey: ["adsById", id],
        queryFn: getData,
        enabled: !!id,
        retry: false,
    });
};

export const useAddAds = () => {
    const api = useAxiosWithAuth();
    const queryClient = useQueryClient();

    const addAds = async (categoryForm) => {
        const { data } = await api.post(`advertisement`, categoryForm);
        return data;
    };

    return useMutation({
        mutationFn: addAds,
        onSuccess: ({ type, message }) => {
            createAlert(type, message);
            setTimeout(() => queryClient.invalidateQueries(["ads"]), 50);
        },
        onError: (error) => {
            console.error("Error updating data:", error.message);
        },
        retry: false,
    });
};



export const useEditAds = (id) => {
    const api = useAxiosWithAuth();
    const queryClient = useQueryClient();

    const editAds = async (formData) => {
        const { data } = await api.post(`advertisement/${id}`, formData);
        return data;
    };

    return useMutation({
        mutationFn: editAds,
        onSuccess: ({ type, message }) => {
            createAlert(type, message);
            setTimeout(() => queryClient.invalidateQueries(["ads"]), 50)
        },
        onError: (error) => {
            console.error("Error updating data:", error.message);
        },
        enabled: !!id,
        retry: false,
    });
};

export const useDeleteAds = (id) => {
    const api = useAxiosWithAuth();
    const queryClient = useQueryClient();

    const deleteAds = async () => {
        const { data } = await api.delete(`advertisement/${id}`);
        return data;
    };

    return useMutation({
        mutationFn: deleteAds,
        onSuccess: ({ type, message }) => {
            createAlert(type, message);
            setTimeout(() => queryClient.invalidateQueries(["ads"]), 50)
        },
        onError: (error) => {
            console.error("Error delete data:", error.message);
        },
        enabled: !!id,
        retry: false,
    });
};