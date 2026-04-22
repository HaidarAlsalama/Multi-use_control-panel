import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAlert } from "components/Alert/Alert";
import { useAxiosWithAuth } from "Hooks/useAxiosWithAuth";


export const useAgents = (name = "", perPage = 10, page = 1) => {
    const api = useAxiosWithAuth();

    const getData = async ({ queryKey }) => {
        const [_key, perPage, page, name] = queryKey;

        const { data } = await api.get('agents', {
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
        queryKey: ['agents', perPage, page, name],
        queryFn: getData,
        enabled: true,
        retry: false,
    });
};


export const useAgentById = (id) => {
    const api = useAxiosWithAuth();

    const getData = async ({ queryKey }) => {
        const [_key, id] = queryKey;
        const { data } = await api.get(`agents/${id}`);
        return data;
    };

    return useQuery({
        refetchOnWindowFocus: false,
        queryKey: ["agentsById", id],
        queryFn: getData,
        enabled: !!id,
        retry: false,
    });
};

export const useAddAgent = () => {
    const api = useAxiosWithAuth();
    const queryClient = useQueryClient();

    const addAgent = async (categoryForm) => {
        const { data } = await api.post(`agent`, categoryForm);
        return data;
    };

    return useMutation({
        mutationFn: addAgent,
        onSuccess: ({ type, message }) => {
            createAlert(type, message);
            setTimeout(() => queryClient.invalidateQueries(["agents"]), 50);
        },
        onError: (error) => {
            console.error("Error updating data:", error.message);
        },
        retry: false,
    });
};



export const useEditAgent = (id) => {
    const api = useAxiosWithAuth();
    const queryClient = useQueryClient();

    const editAgent = async (formData) => {
        const { data } = await api.post(`agent/${id}`, formData);
        return data;
    };

    return useMutation({
        mutationFn: editAgent,
        onSuccess: ({ type, message }) => {
            createAlert(type, message);
            setTimeout(() => queryClient.invalidateQueries(["agents"]), 50)
        },
        onError: (error) => {
            console.error("Error updating data:", error.message);
        },
        enabled: !!id,
        retry: false,
    });
};

export const useDeleteAgent = (id) => {
    const api = useAxiosWithAuth();
    const queryClient = useQueryClient();

    const deleteAgent = async () => {
        const { data } = await api.delete(`agent/${id}`);
        return data;
    };

    return useMutation({
        mutationFn: deleteAgent,
        onSuccess: ({ type, message }) => {
            createAlert(type, message);
            setTimeout(() => queryClient.invalidateQueries(["agents"]), 50)
        },
        onError: (error) => {
            console.error("Error delete data:", error.message);
        },
        enabled: !!id,
        retry: false,
    });
};