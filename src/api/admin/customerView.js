import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAlert } from "components/Alert/Alert";
import { useAxiosWithAuth } from "Hooks/useAxiosWithAuth";

export const useCustomerViewSate = () => {
    const api = useAxiosWithAuth();

    const getData = async () => {
        const { data } = await api.get(`user-api/maintenance`);
        return data;
    };

    return useQuery({
        refetchOnWindowFocus: false,
        queryKey: ["customer-view"],
        queryFn: getData,
        retry: false,
    });
};

export const useCustomerViewToggle = () => {
    const api = useAxiosWithAuth();
    const queryClient = useQueryClient();

    const _toggle = async (formData) => {
        const { data } = await api.post(`user-api/maintenance`, formData);
        return data;
    };

    return useMutation({
        mutationFn: _toggle,
        onSuccess: ({ type, message }) => {
            createAlert(type, message);
            setTimeout(() => queryClient.invalidateQueries(["customer-view"]), 50);
        },
        onError: (error) => {
            console.error("Error updating data:", error.message);
        },
        retry: false,
    });
};


