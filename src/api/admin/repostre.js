import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAlert } from "components/Alert/Alert";
import { useAxiosWithAuth } from "Hooks/useAxiosWithAuth";


export const useRepository = (productId, name = "", perPage = 10, page = 1) => {
    const api = useAxiosWithAuth();

    const getData = async ({ queryKey }) => {
        const [_key, productId, name, perPage, page] = queryKey;

        const { data } = await api.get('repository/' + productId, {
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
        queryKey: ['repository', productId, name, perPage, page],
        queryFn: getData,
        enabled: true,
        retry: false,
    });
};


export const useAddRepo = (productId) => {
    const api = useAxiosWithAuth();
    const queryClient = useQueryClient();

    const _create = async (formData) => {
        const { data } = await api.post(`repository/` + productId, formData, {
            headers: { "Content-Type": "application/json" }
        });
        return data;
    };

    return useMutation({
        mutationFn: _create,
        onSettled: () => {
            setTimeout(() => queryClient.invalidateQueries(["repository"]), 50);
        },
        onSuccess: ({ status, message }) => {
            createAlert(status, message);
        },
        onError: (error) => {
            error?.response?.data?.duplicates.forEach(element => {
                createAlert('error', `${element}`);
            });
            createAlert('error', `${error?.response?.data?.message}`);

        },
        retry: false,
    });
};


export const useDeleteRepo = (id) => {
    const api = useAxiosWithAuth();
    const queryClient = useQueryClient();

    const _delete = async () => {
        const { data } = await api.delete(`delete-code/${id}`);
        return data;
    };

    return useMutation({
        mutationFn: _delete,
        onSuccess: ({ status, message }) => {
            createAlert(status, message);
            setTimeout(() => queryClient.invalidateQueries(["repository"]), 50)
        },
        onError: (error) => {
            console.error("Error delete data:", error.message);
        },
        enabled: !!id,
        retry: false,
    });
};