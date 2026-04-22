import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAlert } from "components/Alert/Alert";
import { useAxiosWithAuth } from "Hooks/useAxiosWithAuth";


export const useMyCustomers = (name) => {
    const api = useAxiosWithAuth();

    const getData = async ({ queryKey }) => {
        const [_key, name] = queryKey;
        const { data } = await api.get('user/my-customers', {
            params: {
                name
            },
        });
        return data;
    };

    return useQuery({
        refetchOnWindowFocus: false,
        queryKey: ['my-customers', name],
        queryFn: getData,
        retry: false,
    });
};

export const useTransfer = () => {
    const api = useAxiosWithAuth();
    const queryClient = useQueryClient();

    const _add = async (formData) => {
        const { data } = await api.post(`user/add-charge-broker`, formData);
        return data;
    };

    return useMutation({
        mutationFn: _add,
        onSuccess: ({ type, message }) => {
            createAlert(type, message);
            setTimeout(() => queryClient.invalidateQueries({ queryKey: ["my-balance"], exact: true }), 50);
        },
        onError: (error) => {
            console.error("Error updating data:", error.message);
        },
        retry: false,
    });
}