import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAlert } from "components/Alert/Alert";
import { useAxiosWithAuth } from "Hooks/useAxiosWithAuth";


export const useFinancialStatement = (perPage = 10, page = 1, name = "", customerId, status = "",
    from = "",
    to = "") => {
    const api = useAxiosWithAuth();

    const getData = async ({ queryKey }) => {
        const [_key, perPage, page, name, customerId, status, from, to] = queryKey;

        const { data } = await api.get(`financial-statements/${customerId}`, {
            params: {
                perPage,
                page,
                name, status,
                from,
                to
            },
        });
        return data;
    };

    return useQuery({
        refetchOnWindowFocus: false,
        queryKey: ['financial-statements', perPage, page, name, customerId, status, from, to],
        queryFn: getData,
        enabled: !!customerId,
        retry: false,
    });
};


export const useAddBalance = (id) => {
    const api = useAxiosWithAuth();
    const queryClient = useQueryClient();

    const _add = async (formData) => {
        const { data } = await api.post(`add-balance/${id}`, formData);
        return data;
    };

    return useMutation({
        mutationFn: _add,
        onSuccess: ({ type, message }) => {
            createAlert(type, message);
            setTimeout(() => queryClient.invalidateQueries(["financial-statements"]), 50);
        },
        onError: (error) => {
            console.error("Error updating data:", error.message);
        },
        retry: false,
    });
};

export const useFinancialStatementById = (id) => {
    const api = useAxiosWithAuth();

    const getData = async () => {
        const { data } = await api.get(`financial-detail/${id}`);
        return data;
    };

    return useQuery({
        refetchOnWindowFocus: false,
        queryKey: ['financial-detail-by-id'],
        queryFn: getData,
        enabled: !!id,
        retry: false,
    });
};


// export const useCustomerById = (id) => {
//     const api = useAxiosWithAuth();

//     const getData = async ({ queryKey }) => {
//         const [_key, id] = queryKey;
//         const { data } = await api.get(`customers/${id}`);
//         return data;
//     };

//     return useQuery({
// refetchOnWindowFocus: false,
//         queryKey: ["customerById", id],
//         queryFn: getData,
//         enabled: !!id,
//         retry: false,
//     });
// };

// export const useAddCustomer = () => {
//     const api = useAxiosWithAuth();
//     const queryClient = useQueryClient();

//     const addCustomer = async (formData) => {
//         const { data } = await api.post(`customer`, formData);
//         return data;
//     };

//     return useMutation({
//         mutationFn: addCustomer,
//         onSuccess: ({ type, message }) => {
//             createAlert(type, message);
//             setTimeout(() => queryClient.invalidateQueries(["customers"]), 50);
//         },
//         onError: (error) => {
//             console.error("Error updating data:", error.message);
//         },
//         retry: false,
//     });
// };

// export const useEditCustomer = (id) => {
//     const api = useAxiosWithAuth();
//     const queryClient = useQueryClient();

//     const editCustomer = async (formData) => {
//         const { data } = await api.post(`customer/${id}`, formData);
//         return data;
//     };

//     return useMutation({
//         mutationFn: editCustomer,
//         onSuccess: ({ type, message }) => {
//             createAlert(type, message);
//             setTimeout(() => queryClient.invalidateQueries(["customers"]), 50)
//         },
//         onError: (error) => {
//             console.error("Error updating data:", error.message);
//         },
//         enabled: !!id,
//         retry: false,
//     });
// };

// export const useDeleteCustomer = (id) => {
//     const api = useAxiosWithAuth();
//     const queryClient = useQueryClient();

//     const deleteCustomer = async () => {
//         const { data } = await api.delete(`customer/${id}`);
//         return data;
//     };

//     return useMutation({
//         mutationFn: deleteCustomer,
//         onSuccess: ({ type, message }) => {
//             createAlert(type, message);
//             setTimeout(() => queryClient.invalidateQueries(["customers"]), 50)
//         },
//         onError: (error) => {
//             console.error("Error delete data:", error.message);
//         },
//         enabled: !!id,
//         retry: false,
//     });
// };