import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAlert } from "components/Alert/Alert";
import { useAxiosWithAuth } from "Hooks/useAxiosWithAuth";


export const useChargeStatements = (perPage = 10, page = 1, name = "", status = "", from = "", to = "") => {
    const api = useAxiosWithAuth();

    const getData = async ({ queryKey }) => {
        const [_key, perPage, page, name, status, from, to] = queryKey;

        const { data } = await api.get(`charge-statements`, {
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
        queryKey: ['charge-balance', perPage, page, name, status, from, to],
        queryFn: getData,

        retry: false,
    });
};

export const usePaymentInfoById = (id) => {
    const api = useAxiosWithAuth();

    const getData = async () => {
        const { data } = await api.get(`charge-statement/${id}`);
        return data;
    };

    return useQuery({
        refetchOnWindowFocus: false,
        queryKey: ['paymnet-info-by-id'],
        queryFn: getData,
        enabled: !!id,
        retry: false,
    });
};

export const useAdminBox = (from = "", to = "") => {
    const api = useAxiosWithAuth();

    const getData = async ({ queryKey }) => {
        const [_key, from, to] = queryKey;

        const { data } = await api.get(`payments-summary-by-user`, {
            params: {
                from, to
            },
        });
        return data;
    };

    return useQuery({
        refetchOnWindowFocus: false,
        queryKey: ['admin-box', from, to],
        queryFn: getData,
        retry: false,
    });
};