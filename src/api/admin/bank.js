import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAlert } from "components/Alert/Alert";
import { useAxiosWithAuth } from "Hooks/useAxiosWithAuth";


export const useBanks = (name = "", perPage = 10, page = 1) => {
    const api = useAxiosWithAuth();

    const getData = async ({ queryKey }) => {
        const [_key, perPage, page, name] = queryKey;

        const { data } = await api.get('banks', {
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
        queryKey: ['banks', perPage, page, name],
        queryFn: getData,
        enabled: true,
        retry: false,
    });
};


export const useBankById = (id) => {
    const api = useAxiosWithAuth();

    const getData = async ({ queryKey }) => {
        const [_key, id] = queryKey;
        const { data } = await api.get(`banks/${id}`);
        return data;
    };

    return useQuery({
        refetchOnWindowFocus: false,
        queryKey: ["bankById", id],
        queryFn: getData,
        enabled: !!id,
        retry: false,
    });
};

export const useAddBank = (onProgress) => {
    const api = useAxiosWithAuth();
    const queryClient = useQueryClient();

    const addBnak = async (categoryForm) => {
        const { data } = await api.post(`bank`, categoryForm, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
            onUploadProgress: (progressEvent) => {
                const progress = Math.round(
                    (progressEvent.loaded / progressEvent.total) * 100
                );
                onProgress(progress);
            },
        });
        return data;
    };

    return useMutation({
        mutationFn: addBnak,
        onSuccess: ({ type, message }) => {
            createAlert(type, message);
            setTimeout(() => queryClient.invalidateQueries(["banks"]), 50);
        },
        onError: (error) => {
            console.error("Error updating data:", error.message);
        },
        retry: false,
    });
};



export const useEditBank = (id, onProgress) => {
    const api = useAxiosWithAuth();
    const queryClient = useQueryClient();

    const editBnak = async (formData) => {
        const { data } = await api.post(`bank/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
            onUploadProgress: (progressEvent) => {
                const progress = Math.round(
                    (progressEvent.loaded / progressEvent.total) * 100
                );
                onProgress(progress);
            },
        });
        return data;
    };

    return useMutation({
        mutationFn: editBnak,
        onSuccess: ({ type, message }) => {
            createAlert(type, message);
            setTimeout(() => queryClient.invalidateQueries(["banks"]), 50)
        },
        onError: (error) => {
            console.error("Error updating data:", error.message);
        },
        enabled: !!id,
        retry: false,
    });
};

export const useDeleteBank = (id) => {
    const api = useAxiosWithAuth();
    const queryClient = useQueryClient();

    const deleteBank = async () => {
        const { data } = await api.delete(`bank/${id}`);
        return data;
    };

    return useMutation({
        mutationFn: deleteBank,
        onSuccess: ({ type, message }) => {
            createAlert(type, message);
            setTimeout(() => queryClient.invalidateQueries(["banks"]), 50)
        },
        onError: (error) => {
            console.error("Error delete data:", error.message);
        },
        enabled: !!id,
        retry: false,
    });
};

export const useBankBlockList = (id = null, name) => {
    const api = useAxiosWithAuth();

    const getData = async ({ queryKey }) => {
        const [_key, id, name] = queryKey;

        const { data } = await api.get(`all-customer-hidden-bank/${id}`, {
            params: {
                name
            },
        });
        return data;
    };

    return useQuery({
        refetchOnWindowFocus: false,
        queryKey: ['bank-block-list', id, name],
        queryFn: getData,
        enabled: true,
        retry: false,
    });
};

export const useToggleBlockBankAll = (bankId) => {
    const api = useAxiosWithAuth();
    const queryClient = useQueryClient();

    const editToggleStatus = async (formData) => {
        const { data } = await api.patch(`toggle-bank-all-customer/${bankId}`, formData);
        return data;
    };

    return useMutation({
        mutationFn: editToggleStatus,
        onSuccess: ({ type, message }) => {
            createAlert(type || 'Info', message);
            queryClient.invalidateQueries(['bank-block-list']);
        },
        onError: (error) => {
            console.error("Error updating data:", error.message);
        },
        enable: !!bankId,
        retry: false,
    });
};

export const useToggleBlockBank = (bankId) => {
    const api = useAxiosWithAuth();
    const queryClient = useQueryClient();

    const editToggleStatus = async (formData) => {
        const { data } = await api.patch(`toggle-bank-customer/${bankId}`, formData);
        return data;
    };

    return useMutation({
        mutationFn: editToggleStatus,
        onSuccess: ({ type, message }) => {
            createAlert(type || 'Info', message);
            queryClient.invalidateQueries(['bank-block-list']);
        },
        onError: (error) => {
            console.error("Error updating data:", error.message);
        },
        enable: !!bankId,
        retry: false,
    });
};


export const useBanksBlockListUserGroup = (id = null, name) => { // get users group
    const api = useAxiosWithAuth();

    const getData = async ({ queryKey }) => {
        const [_key, id, name] = queryKey;

        const { data } = await api.get(`all-groupCustomer-hidden-banks/${id}`, {
            params: {
                name
            },
        });
        return data;
    };

    return useQuery({
        refetchOnWindowFocus: false,
        queryKey: ['banks-blok-list-users-group', id, name],
        queryFn: getData,
        enabled: true,
        retry: false,
    });
};

export const useToggleBlockBankUserGroup = (bankId) => {
    const api = useAxiosWithAuth();
    const queryClient = useQueryClient();

    const editToggleStatus = async (formData) => {
        const { data } = await api.patch(`toggle-bank-CustomerGroup/${bankId}`, formData);
        return data;
    };

    return useMutation({
        mutationFn: editToggleStatus,
        onSuccess: ({ type, message }) => {
            createAlert(type || 'Info', message);
            queryClient.invalidateQueries(['banks-blok-list-users-group']);
        },
        onError: (error) => {
            console.error("Error updating data:", error.message);
        },
        enable: !!bankId,
        retry: false,
    });
};
