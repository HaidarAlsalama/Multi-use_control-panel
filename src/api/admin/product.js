import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAlert } from "components/Alert/Alert";
import { useAxiosWithAuth } from "Hooks/useAxiosWithAuth";


export const useProducts = (categoryId, name = "", perPage = 10, page = 1) => {
    const api = useAxiosWithAuth();

    const getData = async ({ queryKey }) => {
        const [_key, categoryId, name, perPage, page] = queryKey;

        const { data } = await api.get('products', {
            params: {
                perPage,
                page,
                name,
                categoryId
            },
        });
        return data;
    };

    return useQuery({
        refetchOnWindowFocus: false,
        queryKey: ['products', categoryId, name, perPage, page],
        queryFn: getData,
        enabled: true,
        retry: false,
    });
};

export const useProductById = (id) => {
    const api = useAxiosWithAuth();

    const getData = async ({ queryKey }) => {
        const [_key, id] = queryKey;
        const { data } = await api.get(`products/${id}`);
        return data;
    };

    return useQuery({
        refetchOnWindowFocus: false,
        queryKey: ["productById", id],
        queryFn: getData,
        enabled: !!id,
        retry: false,
    });
};

export const useAddProduct = (onProgress) => {
    const api = useAxiosWithAuth();
    const queryClient = useQueryClient();

    const _create = async (formData) => {
        const { data } = await api.post(`product`, formData, {
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
        mutationFn: _create,
        onSettled: () => {
            setTimeout(() => queryClient.invalidateQueries(["products"]), 50);
        },
        onSuccess: ({ type, message }) => {
            createAlert(type, message);
        },
        onError: (error) => {
            console.error("Error updating data:", error.message);
        },
        retry: false,
    });
};

export const useEditProduct = (onProgress, productId) => {
    const api = useAxiosWithAuth();
    const queryClient = useQueryClient();

    const _edit = async (formData) => {
        const { data } = await api.post(`product/${productId}`, formData, {
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
        mutationFn: _edit,
        onSettled: () => {
            setTimeout(() => queryClient.invalidateQueries(["products"]), 50);
        },
        onSuccess: ({ type, message }) => {
            createAlert(type, message);
        },
        onError: (error) => {
            console.error("Error updating data:", error.message);
        },
        retry: false,
    });
};

export const useDeleteProduct = (id) => {
    const api = useAxiosWithAuth();
    const queryClient = useQueryClient();

    const _delete = async () => {
        const { data } = await api.delete(`product/${id}`);
        return data;
    };

    return useMutation({
        mutationFn: _delete,
        onSuccess: ({ type, message }) => {
            createAlert(type, message);
            setTimeout(() => queryClient.invalidateQueries(["products"]), 50)
        },
        onError: (error) => {
            console.error("Error delete data:", error.message);
        },
        enabled: !!id,
        retry: false,
    });
};


export const useProductsBlockList = (id = null, name) => {
    const api = useAxiosWithAuth();

    const getData = async ({ queryKey }) => {
        const [_key, id, name] = queryKey;

        const { data } = await api.get(`hidden-products/${id}`, {
            params: {
                name
            },
        });
        return data;
    };

    return useQuery({
        refetchOnWindowFocus: false,
        queryKey: ['products-blok-list', id, name],
        queryFn: getData,
        enabled: true,
        retry: false,
    });
};

export const useToggleBlockProduct = (productId) => {
    const api = useAxiosWithAuth();
    const queryClient = useQueryClient();

    const editToggleStatus = async (formData) => {
        const { data } = await api.patch(`toggle-product/${productId}`, formData);
        return data;
    };

    return useMutation({
        mutationFn: editToggleStatus,
        onSuccess: ({ type, message }) => {
            createAlert(type || 'Info', message);
            queryClient.invalidateQueries(['category-blok-list']);
        },
        onError: (error) => {
            console.error("Error updating data:", error.message);
        },
        enable: !!productId,
        retry: false,
    });
};

export const useToggleBlockProductAll = (productId) => {
    const api = useAxiosWithAuth();
    const queryClient = useQueryClient();

    const editToggleStatus = async (formData) => {
        const { data } = await api.patch(`toggle-all-product/${productId}`, formData);
        return data;
    };

    return useMutation({
        mutationFn: editToggleStatus,
        onSuccess: ({ type, message }) => {
            createAlert(type || 'Info', message);
            queryClient.invalidateQueries(['category-blok-list']);
        },
        onError: (error) => {
            console.error("Error updating data:", error.message);
        },
        enable: !!productId,
        retry: false,
    });
};



export const useProductsForOrder = (categoryId = null) => {
    const api = useAxiosWithAuth();

    const getData = async ({ queryKey }) => {
        const [_key, categoryId] = queryKey;

        const { data } = await api.get('all-product-order/' + categoryId);
        return data;
    };

    return useQuery({
        refetchOnWindowFocus: false,
        queryKey: ['all-product-order', categoryId],
        queryFn: getData,
        enabled: !!categoryId,
        retry: false,
    });
};


export const useProductBlockListUserGroup = (id = null, name) => { // get users group
    const api = useAxiosWithAuth();

    const getData = async ({ queryKey }) => {
        const [_key, id, name] = queryKey;

        const { data } = await api.get(`all-groupCustomer-hidden-product/${id}`, {
            params: {
                name
            },
        });
        return data;
    };

    return useQuery({
        refetchOnWindowFocus: false,
        queryKey: ['product-blok-list-users-group', id, name],
        queryFn: getData,
        enabled: true,
        retry: false,
    });
};

export const useToggleBlockProductUserGroup = (productId) => {
    const api = useAxiosWithAuth();
    const queryClient = useQueryClient();

    const editToggleStatus = async (formData) => {
        const { data } = await api.patch(`toggle-product-CustomerGroup/${productId}`, formData);
        return data;
    };

    return useMutation({
        mutationFn: editToggleStatus,
        onSuccess: ({ type, message }) => {
            createAlert(type || 'Info', message);
            queryClient.invalidateQueries(['product-blok-list-users-group']);
        },
        onError: (error) => {
            console.error("Error updating data:", error.message);
        },
        enable: !!productId,
        retry: false,
    });
};
