import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAlert } from "components/Alert/Alert";
import { useAxiosWithAuth } from "Hooks/useAxiosWithAuth";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setBalance } from "store/reducers/balanceReducer";


export const useAvailableBanks = (enable) => {
    const api = useAxiosWithAuth();

    const getData = async () => {
        const { data } = await api.get('user/banks');
        return data;
    };

    return useQuery({
        refetchOnWindowFocus: false,
        queryKey: ['availbel-banks'],
        queryFn: getData,
        enabled: !!!enable,
        retry: false,
    });
};

export const useMyPayments = (perPage = 10, page = 1, name = "", status = "") => {
    const api = useAxiosWithAuth();

    const getData = async ({ queryKey }) => {
        const [_key, perPage, page, name, status] = queryKey;

        const { data } = await api.get('user/my-paymnets', {
            params: {
                perPage,
                page,
                name, status
            },
        });
        return data;
    };

    return useQuery({
        refetchOnWindowFocus: false,
        queryKey: ['my-paymnets', perPage, page, name, status],
        queryFn: getData,
        retry: false,
    });
};

export const useMyPaymentById = (id) => {
    const api = useAxiosWithAuth();

    const getData = async () => {
        const { data } = await api.get(`user/my-paymnet/${id}`);
        return data;
    };

    return useQuery({
        refetchOnWindowFocus: false,
        queryKey: ['my-paymnet-by-id'],
        queryFn: getData,
        enabled: !!id,
        retry: false,
    });
};

export const useMyBalance = () => {
    const api = useAxiosWithAuth();

    const getData = async () => {
        const { data } = await api.get(`user/my-balance`);
        return data;
    };

    return useQuery({
        refetchOnWindowFocus: false,
        queryKey: ['my-balance'],
        queryFn: getData,
        retry: false,
        refetchInterval: 300000, // 300000 ملي ثانية = 5 دقائق
    });
};

export const UseAddBalance = (onProgress) => {
    const api = useAxiosWithAuth();
    const navigate = useNavigate()
    // const queryClient = useQueryClient();

    const _add = async (formData) => {
        const { data } = await api.post(`user/add-balance`, formData, {
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
        mutationFn: _add,
        onSuccess: ({ type, message }) => {
            createAlert(type, message);
            navigate('/my-account/my-payments')
            // setTimeout(() => queryClient.invalidateQueries(["ads"]), 50);
        },
        onError: (error) => {
            console.error("Error updating data:", error.message);
        },
        retry: false,
    });
}

export const useMyFinancialStatement = (perPage = 10, page = 1, name = "", status = "", from = "", to = "") => {
    const api = useAxiosWithAuth();

    const getData = async ({ queryKey }) => {
        const [_key, perPage, page, name, status, from, to] = queryKey;

        const { data } = await api.get(`user/my-financial`, {
            params: {
                perPage,
                page,
                name, status, from, to
            },
        });
        return data;
    };

    return useQuery({
        refetchOnWindowFocus: false,
        queryKey: ['my-financial-statements', perPage, page, name, status, from, to],
        queryFn: getData,
        retry: false,
    });
};

export const UseCreateAPItoken = () => {
    const api = useAxiosWithAuth();
    const dispatch = useDispatch();

    const _add = async () => {
        const { data } = await api.post(`create-token`);
        return data;
    };

    return useMutation({
        mutationFn: _add,
        onSuccess: (data) => {
            createAlert('Success', 'تم انشاء توكين جديد بنجاح.');
            dispatch(
                setBalance({
                    apiToken: data['api-token'],
                })
            );

        },
        onError: (error) => {
            console.error("Error updating data:", error.message);
        },
        retry: false,
    });
}

export const useMyFinancialStatementById = (id) => {
    const api = useAxiosWithAuth();

    const getData = async () => {
        const { data } = await api.get(`user/my-financial/${id}`);
        return data;
    };

    return useQuery({
        refetchOnWindowFocus: false,
        queryKey: ['my-financial-statement-by-id', id],
        queryFn: getData,
        enabled: !!id,
        retry: false,
    });
};
