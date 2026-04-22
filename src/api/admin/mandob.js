import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAlert } from "components/Alert/Alert";
import { useAxiosWithAuth } from "Hooks/useAxiosWithAuth";


export const useCustomersHaventHolder = () => {
    const api = useAxiosWithAuth();

    const getData = async () => {
        const { data } = await api.get('mandob/customerHaventHolder');
        return data;
    };

    return useQuery({
        refetchOnWindowFocus: false,
        queryKey: ['customerHaventHolder'],
        queryFn: getData,
        enabled: true,
        retry: false,
    });
};

export const useBrokers = () => {
    const api = useAxiosWithAuth();

    const getData = async () => {
        const { data } = await api.get('mandob/allBrokers');
        return data;
    };

    return useQuery({
        refetchOnWindowFocus: false,
        queryKey: ['brokers'],
        queryFn: getData,
        enabled: true,
        retry: false,
    });
};

export const useAddOrJointoBroker = (custId) => {
    const api = useAxiosWithAuth();
    const queryClient = useQueryClient();

    const addCustomer = async (formData) => {
        const { data } = await api.post(`mandob/moveToBroker/${custId}`, formData);
        return data;
    };

    return useMutation({
        mutationFn: addCustomer,
        onSuccess: ({ type, message }) => {
            createAlert(type, message);
            // setTimeout(() => queryClient.invalidateQueries([""]), 50);
        },
        onError: (error) => {
            console.error("Error updating data:", error.message);
        },
        retry: false,
    });
};
