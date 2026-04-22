import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAlert } from "components/Alert/Alert";
import { useAxiosWithAuth } from "Hooks/useAxiosWithAuth";


export const useServicesOrders = (perPage = 10, page = 1, name = "", status = "", from = "", to = "") => {
    const api = useAxiosWithAuth();

    const getData = async ({ queryKey }) => {
        const [_key, perPage, page, name, status, from, to] = queryKey;

        const { data } = await api.get(`orders`, {
            params: {
                perPage,
                page,
                name, status, from, to
            },
        });
        return data;
    };

    return useQuery({
        refetchOnWindowFocus: false,
        queryKey: ['orders', perPage, page, name, status, from, to],
        queryFn: getData,

        retry: false,
    });
};

export const useServiceOrderById = (id) => {
    const api = useAxiosWithAuth();

    const getData = async ({ queryKey }) => {
        const [_key, id] = queryKey;

        const { data } = await api.get(`order-detail/${id}`);
        return data;
    };

    return useQuery({
        refetchOnWindowFocus: false,
        queryKey: ['order-by-id', id],
        queryFn: getData,
        enabled: !!id,
        retry: false,
    });
};


export const useChangeStateOrder = (id) => {
    const api = useAxiosWithAuth();
    const queryClient = useQueryClient();

    const _edit = async (formData) => {
        const { data } = await api.post(`change-state-order/${id}`, formData);
        return data;
    };

    return useMutation({
        mutationFn: _edit,
        onSuccess: ({ type, message }) => {
            createAlert(type, message);
            setTimeout(() => queryClient.invalidateQueries(["orders"]), 50);
        },
        onError: (error) => {
            console.error("Error updating data:", error.message);
        },
        retry: false,
    });
};