import { useMutation, useQuery } from "@tanstack/react-query";
import { createAlert } from "components/Alert/Alert";
import { useAxiosWithAuth } from "Hooks/useAxiosWithAuth";


export const useContactUs = () => {
    const api = useAxiosWithAuth();

    const getData = async () => {

        const { data } = await api.get('contact-message');
        return data[0];
    };

    return useQuery({
        refetchOnWindowFocus: false,
        queryKey: ['contact-us',],
        queryFn: getData,
        enabled: true,
        retry: false,
    });
};

export const useAddContactUs = () => {
    const api = useAxiosWithAuth();

    const addCustomer = async (formData) => {
        const { data } = await api.post(`message-create`, formData);
        return data;
    };

    return useMutation({
        mutationFn: addCustomer,
        onSuccess: ({ type, message }) => {
            createAlert(type, message);
        },
        onError: (error) => {
            console.error("Error updating data:", error.message);
        },
        retry: false,
    });
};