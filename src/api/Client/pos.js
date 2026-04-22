import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAlert } from "components/Alert/Alert";
import { useAxiosWithAuth } from "Hooks/useAxiosWithAuth";
import { useNavigate } from "react-router-dom";


export const useClientPOS = () => {
    const api = useAxiosWithAuth();

    const getData = async () => {
        const { data } = await api.get(`user/pos`);

        return data?.data.reduce((acc, product) => {
            const tag = product.tag;

            if (!acc[tag]) {
                acc[tag] = [];
            }

            acc[tag].push(product);
            return acc;
        }, {}) || [];

    };

    return useQuery({
        refetchOnWindowFocus: false,
        queryKey: ['client-pos'],
        queryFn: getData,
        retry: false,
    });
};


export const useCreateOrderPos = () => {
    const api = useAxiosWithAuth();
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const _add = async (formData) => {
        const { data } = await api.post(`user/pos`, formData);
        return data;
    };

    return useMutation({
        mutationFn: _add,
        onSuccess: ({ data, type, message }) => {
            createAlert(type, message);
            // navigate('/my-account/my-orders?orderId=' + data)
            // queryClient.invalidateQueries({ queryKey: ["my-balance"], exact: true });
        },
        onError: (error) => {
            console.error("Error updating data:", error.message);
        },
        retry: false,
    });
}