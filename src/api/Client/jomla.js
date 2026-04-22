import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAlert } from "components/Alert/Alert";
import { useAxiosWithAuth } from "Hooks/useAxiosWithAuth";
import { useLocation, useNavigate } from "react-router-dom";


export const useClientJomla = () => {
    const api = useAxiosWithAuth();

    const getData = async () => {
        const { data } = await api.get(`user/jomla`);

        return data?.data.reduce((acc, product) => {
            const tag = product.tag;

            if (!acc[tag]) {
                acc[tag] = [];
            }

            acc[tag].push(product);
            return acc;
        }, {}) || [];

    };

    return useQuery({
        refetchOnWindowFocus: false,
        queryKey: ['client-jomla'],
        queryFn: getData,
        retry: false,
    });
};


export const useCreateOrderJomla = () => {
    const api = useAxiosWithAuth();
    const navigate = useNavigate()
    const location = useLocation();
    const _add = async (formData) => {
        const { data } = await api.post(`user/jomla`, formData);
        return data;
    };

    return useMutation({
        mutationFn: _add,
        onSuccess: ({ data, type, message }) => {
            createAlert(type, message);
            setTimeout(() => navigate({
                pathname: location.pathname,
                search: "",
            }), 50);
        },
        onError: (error) => {
            console.error("Error updating data:", error.message);
        },
        retry: false,
    });
}