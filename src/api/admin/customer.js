import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAlert } from "components/Alert/Alert";
import { useAxiosWithAuth } from "Hooks/useAxiosWithAuth";


export const useCustomers = (perPage = 10, page = 1, name = "",) => {
    const api = useAxiosWithAuth();

    const getData = async ({ queryKey }) => {
        const [_key, perPage, page, name] = queryKey;

        const { data } = await api.get('customers', {
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
        queryKey: ['customers', perPage, page, name],
        queryFn: getData,
        enabled: true,
        retry: false,
    });
};


export const useCustomerById = (id) => {
    const api = useAxiosWithAuth();

    const getData = async ({ queryKey }) => {
        const [_key, id] = queryKey;
        const { data } = await api.get(`customers/${id}`);
        return data;
    };

    return useQuery({
        refetchOnWindowFocus: false,
        queryKey: ["customerById", id],
        queryFn: getData,
        enabled: !!id,
        retry: false,
    });
};

export const useAddCustomer = () => {
    const api = useAxiosWithAuth();
    const queryClient = useQueryClient();

    const addCustomer = async (formData) => {
        const { data } = await api.post(`customer`, formData);
        return data;
    };

    return useMutation({
        mutationFn: addCustomer,
        onSuccess: ({ type, message }) => {
            createAlert(type, message);
            setTimeout(() => queryClient.invalidateQueries(["customers"]), 50);
        },
        onError: (error) => {
            console.error("Error updating data:", error.message);
        },
        retry: false,
    });
};

export const useEditCustomer = (id) => {
    const api = useAxiosWithAuth();
    const queryClient = useQueryClient();

    const editCustomer = async (formData) => {
        const { data } = await api.post(`customer/${id}`, formData);
        return data;
    };

    return useMutation({
        mutationFn: editCustomer,
        onSuccess: ({ type, message }) => {
            createAlert(type, message);
            setTimeout(() => queryClient.invalidateQueries(["customers"]), 50)
        },
        onError: (error) => {
            console.error("Error updating data:", error.message);
        },
        enabled: !!id,
        retry: false,
    });
};

export const useDeleteCustomer = (id) => {
    const api = useAxiosWithAuth();
    const queryClient = useQueryClient();

    const deleteCustomer = async () => {
        const { data } = await api.delete(`customer/${id}`);
        return data;
    };

    return useMutation({
        mutationFn: deleteCustomer,
        onSuccess: ({ type, message }) => {
            createAlert(type, message);
            setTimeout(() => queryClient.invalidateQueries(["customers"]), 50)
        },
        onError: (error) => {
            console.error("Error delete data:", error.message);
        },
        enabled: !!id,
        retry: false,
    });
};

export const useTotalBalance = () => {
    const api = useAxiosWithAuth();

    const getData = async () => {
        const { data } = await api.get(`total`);
        return data;
    };

    return useQuery({
        refetchOnWindowFocus: false,
        queryKey: ["total-balance"],
        queryFn: getData,
        retry: false,
    });
};

export const useGeneratePass = () => {
    const api = useAxiosWithAuth();

    const addCustomer = async (formData) => {
        const { data } = await api.post(`generate-temp-password`, formData);
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

export const useDeleteAllTokens = () => {
    const api = useAxiosWithAuth();

    const addCustomer = async (formData) => {
        const { data } = await api.post(`remove-all-tokens`, formData);
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