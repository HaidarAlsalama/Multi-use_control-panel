import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAlert } from "components/Alert/Alert";
import { useAxiosWithAuth } from "Hooks/useAxiosWithAuth";


export const useCategories = (parentId = null, name = "", perPage = 10, page = 1) => {
    const api = useAxiosWithAuth();

    const getData = async ({ queryKey }) => {
        const [_key, parentId, name, perPage, page] = queryKey;

        const { data } = await api.get('categories', {
            params: {
                perPage,
                page,
                parentId,
                name
            },
        });
        return data;
    };

    return useQuery({
        refetchOnWindowFocus: false,
        queryKey: ['categories', parentId, name, perPage, page],
        queryFn: getData,
        enabled: true,
        retry: false,
    });
};

export const useCategoriesWithFullPath = () => {
    const api = useAxiosWithAuth();

    const getData = async () => {
        const { data } = await api.get('fullPathCategories');
        return data;
    };

    return useQuery({
        refetchOnWindowFocus: false,
        queryKey: ['categoriesWithFullPath',],
        queryFn: getData,
        enabled: true,
        retry: false,
    });
};

export const useCategoryById = (id) => {
    const api = useAxiosWithAuth();

    const getData = async ({ queryKey }) => {
        const [_key, id] = queryKey;
        const { data } = await api.get(`categories/${id}`);
        return data;
    };

    return useQuery({
        refetchOnWindowFocus: false,
        queryKey: ["categoryById", id],
        queryFn: getData,
        enabled: !!id,
        retry: false,
    });
};

export const useAddCategory = (onProgress) => {
    const api = useAxiosWithAuth();
    const queryClient = useQueryClient();

    const addCategory = async (categoryForm) => {
        const { data } = await api.post(`categories`, categoryForm, {
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
        mutationFn: addCategory,
        onSettled: () => {
            setTimeout(() => queryClient.invalidateQueries(["categories"]), 50);
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

export const useEditCategory = (id) => {
    const api = useAxiosWithAuth();
    const queryClient = useQueryClient();

    const editCategory = async (categoryForm) => {
        const { data } = await api.post(`categories/${id}`, categoryForm);
        return data;
    };

    return useMutation({
        mutationFn: editCategory,
        onSuccess: ({ type, message }) => {
            createAlert(type, message);
            setTimeout(() => queryClient.invalidateQueries(["categories"]), 50)
        },
        onError: (error) => {
            console.error("Error updating data:", error.message);
        },
        enabled: !!id,
        retry: false,
    });
};

export const useDeleteCategory = (id) => {
    const api = useAxiosWithAuth();
    const queryClient = useQueryClient();

    const deleteCategory = async () => {
        const { data } = await api.delete(`categories/${id}`);
        return data;
    };

    return useMutation({
        mutationFn: deleteCategory,
        onSuccess: ({ type, message }) => {
            createAlert(type, message);
            setTimeout(() => queryClient.invalidateQueries(["categories"]), 50)
        },
        onError: (error) => {
            console.error("Error delete data:", error.message);
        },
        enabled: !!id,
        retry: false,
    });
};

export const useCategoryBlockList = (id = null, name) => { // get users
    const api = useAxiosWithAuth();

    const getData = async ({ queryKey }) => {
        const [_key, id, name] = queryKey;

        const { data } = await api.get(`hidden-categories/${id}`, {
            params: {
                name
            },
        });
        return data;
    };

    return useQuery({
        refetchOnWindowFocus: false,
        queryKey: ['category-blok-list', id, name],
        queryFn: getData,
        enabled: true,
        retry: false,
    });
};

export const useToggleBlockCategory = (categoryId) => {
    const api = useAxiosWithAuth();
    const queryClient = useQueryClient();

    const editToggleStatus = async (formData) => {
        const { data } = await api.patch(`toggle-category/${categoryId}`, formData);
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
        enable: !!categoryId,
        retry: false,
    });
};

export const useToggleBlockCategoryAll = (categoryId) => {
    const api = useAxiosWithAuth();
    const queryClient = useQueryClient();

    const editToggleStatus = async (formData) => {
        const { data } = await api.patch(`toggle-all-category/${categoryId}`, formData);
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
        enable: !!categoryId,
        retry: false,
    });
};


export const useExternalResources = () => {
    const api = useAxiosWithAuth();

    const getData = async () => {
        const { data } = await api.get('external-resource');
        return data;
    };

    return useQuery({
        refetchOnWindowFocus: false,
        queryKey: ['external-resource'],
        queryFn: getData,
        enabled: true,
        retry: false,
    });
};

export const useExternalProducts = (id) => {
    const api = useAxiosWithAuth();

    const getData = async ({ queryKey }) => {
        const [_key, id] = queryKey;
        const { data } = await api.get(`external-product/${id}`);
        return data;
    };

    return useQuery({
        refetchOnWindowFocus: false,
        queryKey: ['external-product', id],
        queryFn: getData,
        enabled: !!id,
        retry: false,
    });
};

export const useCategoriesForOrder = (parentId = null) => {
    const api = useAxiosWithAuth();

    const getData = async ({ queryKey }) => {
        const [_key, parentId] = queryKey;

        const { data } = await api.get('all-category-order', {
            params: {
                parentId,
            },
        });
        return data;
    };

    return useQuery({
        refetchOnWindowFocus: false,
        queryKey: ['all-category-order', parentId],
        queryFn: getData,
        enabled: true,
        retry: false,
    });
};

export const useCategoriesOrder = (type) => {
    const api = useAxiosWithAuth();
    const queryClient = useQueryClient();

    const _edit = async (formData) => {
        const { data } = await api.post(`edit-category-product-order/${type}`, formData);
        return data;
    };

    return useMutation({
        mutationFn: _edit,
        onSuccess: ({ type, message }) => {
            createAlert(type || 'Info', message);
            setTimeout(() => queryClient.invalidateQueries([""]), 50);
        },
        onError: (error) => {
            console.error("Error updating data:", error.message);
        },
        enable: !!type,
        retry: false,
    });
};


export const useCategoryBlockListUserGroup = (id = null, name) => { // get users group
    const api = useAxiosWithAuth();

    const getData = async ({ queryKey }) => {
        const [_key, id, name] = queryKey;

        const { data } = await api.get(`all-groupCustomer-hidden-category/${id}`, {
            params: {
                name
            },
        });
        return data;
    };

    return useQuery({
        refetchOnWindowFocus: false,
        queryKey: ['category-blok-list-users-group', id, name],
        queryFn: getData,
        enabled: true,
        retry: false,
    });
};

export const useToggleBlockCategoryUserGroup = (categoryId) => {
    const api = useAxiosWithAuth();
    const queryClient = useQueryClient();

    const editToggleStatus = async (formData) => {
        const { data } = await api.patch(`toggle-category-CustomerGroup/${categoryId}`, formData);
        return data;
    };

    return useMutation({
        mutationFn: editToggleStatus,
        onSuccess: ({ type, message }) => {
            createAlert(type || 'Info', message);
            queryClient.invalidateQueries(['category-blok-list-users-group']);
        },
        onError: (error) => {
            console.error("Error updating data:", error.message);
        },
        enable: !!categoryId,
        retry: false,
    });
};
