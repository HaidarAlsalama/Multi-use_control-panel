import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAlert } from "components/Alert/Alert";
import { useAxiosWithAuth } from "Hooks/useAxiosWithAuth";


export const useCustomerGroup = (id = null) => {
    const api = useAxiosWithAuth();

    const getData = async ({ queryKey }) => {
        const [_key, id] = queryKey;

        const { data } = await api.get(`customer-group${id ? `/${id}` : ''}`);
        return data;
    };

    return useQuery({
        refetchOnWindowFocus: false,
        queryKey: ['customer-group', id],
        queryFn: getData,
        enabled: true,
        retry: false,
    });
};

export const useDefaultCustomerGroup = () => {
    const api = useAxiosWithAuth();

    const getData = async () => {
        const { data } = await api.get(`default-role`);
        return data;
    };

    return useQuery({
        refetchOnWindowFocus: false,
        queryKey: ['default-customer-group'],
        queryFn: getData,
        enabled: true,
        retry: false,
    });
};

export const useSetDefaultCustomerGroup = () => {
    const api = useAxiosWithAuth();
    const queryClient = useQueryClient();

    const _edit = async (formData) => {
        const { data } = await api.post(`set-default-role`, formData);
        return data;
    };

    return useMutation({
        mutationFn: _edit,
        onSuccess: ({ type, message }) => {
            createAlert(type, message);
            setTimeout(() => queryClient.invalidateQueries(["default-customer-group", 'customer-group']), 50)
        },
        onError: (error) => {
            console.error("Error updating data:", error.message);
        },
        // enabled: !!false,
        retry: false,
    });
};

export const useAddGroup = () => {
    const api = useAxiosWithAuth();
    const queryClient = useQueryClient();

    const addCategory = async (categoryForm) => {
        const { data } = await api.post(`customer-group`, categoryForm);
        return data;
    };

    return useMutation({
        mutationFn: addCategory,
        onSuccess: ({ type, message }) => {
            createAlert(type, message);
            setTimeout(() => queryClient.invalidateQueries(["customer-group"]), 50)
        },
        onError: (error) => {
            console.error("Error updating data:", error.message);
        },
        // enabled: !!false,
        retry: false,
    });
};

export const useDeleteGroup = (id) => {
    const api = useAxiosWithAuth();
    const queryClient = useQueryClient();

    const deleteCategory = async () => {
        const { data } = await api.delete(`roles/${id}`);
        return data;
    };

    return useMutation({
        mutationFn: deleteCategory,
        onSuccess: ({ type, message }) => {
            createAlert(type, message);
            setTimeout(() => queryClient.invalidateQueries(["customer-group"]), 50)
        },
        onError: (error) => {
            console.error("Error delete data:", error.message);
        },
        enabled: !!id,
        retry: false,
    });
};

export const useEdditGroup = (id) => {
    const api = useAxiosWithAuth();
    const queryClient = useQueryClient();

    const addCategory = async (categoryForm) => {
        const { data } = await api.post(`roles/${id}`, categoryForm);
        return data;
    };

    return useMutation({
        mutationFn: addCategory,
        onSuccess: ({ type, message }) => {
            createAlert(type, message);
            setTimeout(() => queryClient.invalidateQueries(["customer-group"]), 50)
        },
        onError: (error) => {
            console.error("Error updating data:", error.message);
        },
        enabled: !!id,
        retry: false,
    });
};