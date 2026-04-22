import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAlert } from "components/Alert/Alert";
import { useAxiosWithAuth } from "Hooks/useAxiosWithAuth";


export const useSuppliers = (name = "", perPage = 10, page = 1) => {
    const api = useAxiosWithAuth();

    const getData = async ({ queryKey }) => {
        const [_key, perPage, page, name] = queryKey;

        const { data } = await api.get('suppliers', {
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
        queryKey: ['suppliers', perPage, page, name],
        queryFn: getData,
        enabled: true,
        retry: false,
    });
};


export const useSupplierById = (id) => {
    const api = useAxiosWithAuth();

    const getData = async ({ queryKey }) => {
        const [_key, id] = queryKey;
        const { data } = await api.get(`suppliers/${id}`);
        return data;
    };

    return useQuery({
        refetchOnWindowFocus: false,
        queryKey: ["suppliersById", id],
        queryFn: getData,
        enabled: !!id,
        retry: false,
    });
};

export const useAddSupplier = () => {
    const api = useAxiosWithAuth();
    const queryClient = useQueryClient();

    const addSupplier = async (categoryForm) => {
        const { data } = await api.post(`suppliers`, categoryForm);
        return data;
    };

    return useMutation({
        mutationFn: addSupplier,
        onSuccess: ({ type, message }) => {
            createAlert(type, message);
            setTimeout(() => queryClient.invalidateQueries(["suppliers"]), 50);
        },
        onError: (error) => {
            console.error("Error updating data:", error.message);
        },
        retry: false,
    });
};

export const useTransferToSupplier = () => {
    const api = useAxiosWithAuth();
    const queryClient = useQueryClient();

    const addSupplier = async (categoryForm) => {
        const { data } = await api.post(`suppliers/transfer`, categoryForm);
        return data;
    };

    return useMutation({
        mutationFn: addSupplier,
        onSuccess: ({ type, message }) => {
            createAlert(type, message);
            setTimeout(() => queryClient.invalidateQueries(["suppliers", 'suppliersById']), 50);
        },
        onError: (error) => {
            console.error("Error updating data:", error.message);
        },
        retry: false,
    });
};



export const useEditSupplier = (id) => {
    const api = useAxiosWithAuth();
    const queryClient = useQueryClient();

    const editSupplier = async (formData) => {
        const { data } = await api.post(`suppliers/${id}`, formData);
        return data;
    };

    return useMutation({
        mutationFn: editSupplier,
        onSuccess: ({ type, message }) => {
            createAlert(type, message);
            setTimeout(() => queryClient.invalidateQueries(["suppliers"]), 50)
        },
        onError: (error) => {
            console.error("Error updating data:", error.message);
        },
        enabled: !!id,
        retry: false,
    });
};

export const useDeleteSupplier = (id) => {
    const api = useAxiosWithAuth();
    const queryClient = useQueryClient();

    const deleteSupplier = async () => {
        const { data } = await api.delete(`suppliers/${id}`);
        return data;
    };

    return useMutation({
        mutationFn: deleteSupplier,
        onSuccess: ({ type, message }) => {
            createAlert(type, message);
            setTimeout(() => queryClient.invalidateQueries(["suppliers"]), 50)
        },
        onError: (error) => {
            console.error("Error delete data:", error.message);
        },
        enabled: !!id,
        retry: false,
    });
};



/************************************************************** */

export const useBalances = (name = "", perPage = 10, page = 1) => {
    const api = useAxiosWithAuth();

    const getData = async ({ queryKey }) => {
        const [_key, perPage, page, name] = queryKey;

        const { data } = await api.get('cashboxes/balances/all', {
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
        queryKey: ['balances', perPage, page, name],
        queryFn: getData,
        enabled: true,
        retry: false,
    });
};