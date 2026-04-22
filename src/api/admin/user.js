import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAlert } from "components/Alert/Alert";
import { useAxiosWithAuth } from "Hooks/useAxiosWithAuth";


export const useUsers = (name = '', perPage = 10, page = 1) => {
    const api = useAxiosWithAuth();

    const getData = async ({ queryKey }) => {
        const [_key, name, perPage, page] = queryKey;

        const { data } = await api.get(`users`, {
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
        queryKey: ['users', name, perPage, page],
        queryFn: getData,
        enabled: true,
        retry: false,
    });
};
export const useUserById = (id = null) => {
    const api = useAxiosWithAuth();

    const getData = async ({ queryKey }) => {
        const [_key, id] = queryKey;

        const { data } = await api.get(`users/${id}`);
        return data;
    };

    return useQuery({
        refetchOnWindowFocus: false,
        queryKey: ['user', id],
        queryFn: getData,
        enabled: !!id,
        retry: false,
    });
};

export const useAddUser = () => {
    const api = useAxiosWithAuth();
    const queryClient = useQueryClient();

    const addCategory = async (formData) => {
        const { data } = await api.post(`users`, formData);
        return data;
    };

    return useMutation({
        mutationFn: addCategory,
        onSuccess: ({ type, message }) => {
            createAlert(type, message);
            setTimeout(() => queryClient.invalidateQueries(["users"]), 50)
        },
        onError: (error) => {
            console.error("Error updating data:", error.message);
        },
        // enabled: !!false,
        retry: false,
    });
};

export const useEditUser = (id) => {
    const api = useAxiosWithAuth();
    const queryClient = useQueryClient();

    const addCategory = async (formData) => {
        const { data } = await api.patch(`users/${id}`, formData);
        return data;
    };

    return useMutation({
        mutationFn: addCategory,
        onSuccess: ({ type, message }) => {
            createAlert(type, message);
            setTimeout(() => queryClient.invalidateQueries(["users"]), 50)
        },
        onError: (error) => {
            console.error("Error updating data:", error.message);
        },
        // enabled: !!false,
        retry: false,
    });
};
export const useDeleteUser = (id) => {
    const api = useAxiosWithAuth();
    const queryClient = useQueryClient();

    const deleteUser = async () => {
        const { data } = await api.delete(`users/${id}`);
        return data;
    };

    return useMutation({
        mutationFn: deleteUser,
        onSuccess: ({ type, message }) => {
            createAlert(type, message);
            setTimeout(() => queryClient.invalidateQueries(["users"]), 50)
        },
        onError: (error) => {
            console.error("Error updating data:", error.message);
        },
        // enabled: !!false,
        retry: false,
    });
};
