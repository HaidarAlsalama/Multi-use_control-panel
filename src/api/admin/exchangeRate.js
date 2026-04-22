import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAlert } from "components/Alert/Alert";
import { useAxiosWithAuth } from "Hooks/useAxiosWithAuth";


export const useExchangeRate = () => {
    const api = useAxiosWithAuth();

    const getData = async () => {
        const { data } = await api.get('exchangeRate/1');
        return data;
    };

    return useQuery({
        refetchOnWindowFocus: false,
        queryKey: ['exchangeRate'],
        queryFn: getData,
        enabled: true,
        retry: false,
    });
};

export const useAddExchangeRate = () => {
    const api = useAxiosWithAuth();
    const queryClient = useQueryClient();

    const _add = async (formData) => {
        const { data } = await api.post(`add-exchangeRate`, formData);
        return data;
    };

    return useMutation({
        mutationFn: _add,
        onSuccess: ({ type, message }) => {
            createAlert(type, message);
            setTimeout(() => queryClient.invalidateQueries(["exchangeRate"]), 50);
        },
        onError: (error) => {
            console.error("Error updating data:", error.message);
        },
        retry: false,
    });
};

export const useEditExchangeRate = () => {
    const api = useAxiosWithAuth();
    const queryClient = useQueryClient();

    const _edit = async (formData) => {
        const { data } = await api.post(`update-exchangeRate/1`, formData);
        return data;
    };

    return useMutation({
        mutationFn: _edit,
        onSuccess: ({ type, message }) => {
            createAlert(type, message);
            setTimeout(() => queryClient.invalidateQueries(["exchangeRate"]), 50);
        },
        onError: (error) => {
            console.error("Error updating data:", error.message);
        },
        retry: false,
    });
};