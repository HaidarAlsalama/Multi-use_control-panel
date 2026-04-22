import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAlert } from "components/Alert/Alert";
import { useAxiosWithAuth } from "Hooks/useAxiosWithAuth";


export const useRole = (id = null) => {
    const api = useAxiosWithAuth();

    const getData = async ({ queryKey }) => {
        const [_key, id] = queryKey;

        const { data } = await api.get(`roles${id ? `/${id}` : ''}`);
        return data;
    };

    return useQuery({
        refetchOnWindowFocus: false,
        queryKey: ['Roles', id],
        queryFn: getData,
        enabled: true,
        retry: false,
    });
};

export const usePermission = () => {
    const api = useAxiosWithAuth();

    const getData = async () => {
        const { data } = await api.get(`perm`);
        return data;
    };

    return useQuery({
        refetchOnWindowFocus: false,
        queryKey: ['Permissions'],
        queryFn: getData,
        enabled: true,
        retry: false,
    });
};

export const useAddRole = () => {
    const api = useAxiosWithAuth();
    const queryClient = useQueryClient();

    const addCategory = async (categoryForm) => {
        const { data } = await api.post(`roles`, categoryForm);
        return data;
    };

    return useMutation({
        mutationFn: addCategory,
        onSuccess: ({ type, message }) => {
            createAlert(type, message);
            setTimeout(() => queryClient.invalidateQueries(["Roles"]), 50)
        },
        onError: (error) => {
            console.error("Error updating data:", error.message);
        },
        // enabled: !!false,
        retry: false,
    });
};
export const useEdditRole = (id) => {
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
            setTimeout(() => queryClient.invalidateQueries(["Roles"]), 50)
        },
        onError: (error) => {
            console.error("Error updating data:", error.message);
        },
        enabled: !!id,
        retry: false,
    });
};

export const useDeleteRole = (id) => {
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
            setTimeout(() => queryClient.invalidateQueries(["Roles"]), 50)
        },
        onError: (error) => {
            console.error("Error delete data:", error.message);
        },
        enabled: !!id,
        retry: false,
    });
};

export const useAllCateoriesCustomize = (enabled) => {
    const api = useAxiosWithAuth();

    const getData = async () => {
        const { data } = await api.get(`all-cateories-customize`);
        return data;
    };

    return useQuery({
        refetchOnWindowFocus: false,
        queryKey: ['all-cateories-customize'],
        queryFn: getData,
        enabled: enabled,
        retry: false,
    });
};