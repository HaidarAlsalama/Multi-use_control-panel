import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAlert } from "components/Alert/Alert";
import { useAxiosWithAuth } from "Hooks/useAxiosWithAuth";
import { useNavigate } from "react-router-dom";


export const useClientProduct = (productId) => {
    const api = useAxiosWithAuth();

    const getData = async ({ queryKey }) => {
        const [_key, productId] = queryKey;

        const { data } = await api.get(`user/product/${productId}`);
        return data;
    };

    return useQuery({
        refetchOnWindowFocus: false,
        queryKey: ['client-product', productId],
        queryFn: getData,
        enabled: !!productId,
        retry: false,
    });
};

export const useCreateOrder = (id) => {
    const api = useAxiosWithAuth();
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const _add = async (formData) => {
        const { data } = await api.post(`user/create-order/${id}`, formData);
        return data;
    };

    return useMutation({
        mutationFn: _add,
        onSuccess: ({ data, type, message }) => {
            createAlert(type, message);
            // navigate('/my-account/my-orders?orderId=' + data)
            queryClient.invalidateQueries({ queryKey: ["my-balance"], exact: true });
        },
        onError: (error) => {
            console.error("Error updating data:", error.message);
        },
        retry: false,
    });
}

export const useMyOrders = (perPage = 10, page = 1, name = "", state = "") => {
    const api = useAxiosWithAuth();

    const getData = async ({ queryKey }) => {
        const [_key, perPage, page, name, state] = queryKey;

        const { data } = await api.get('user/my-orders', {
            params: {
                perPage,
                page,
                name, state
            },
        });
        return data;
    };

    return useQuery({
        refetchOnWindowFocus: false,
        queryKey: ['my-orders', perPage, page, name, state],
        queryFn: getData,
        retry: false,
    });
};

export const useMyOrderById = (id) => {
    const api = useAxiosWithAuth();

    const getData = async ({ queryKey }) => {
        const [_key, id] = queryKey;

        const { data } = await api.get(`user/my-order/${id}`);
        return data;
    };

    return useQuery({
        refetchOnWindowFocus: false,
        queryKey: ['my-order-by-id', id],
        queryFn: getData,
        enabled: !!id,
        retry: false,
    });
};