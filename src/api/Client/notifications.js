import { useQuery } from "@tanstack/react-query";
import { useAxiosWithAuth } from "Hooks/useAxiosWithAuth";
import { useSelector } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAlert } from "components/Alert/Alert";


const host = "https://push.smatphone-sy.com/push-notifications"

export const useNotifications = () => {
    const api = useAxiosWithAuth(host);
    const { token } = useSelector(state => state.auth)
    const getData = async () => {
        const { data } = await api.get(`is-subscribed?userId=${token}`);
        return data;
    };

    return useQuery({
        refetchOnWindowFocus: false,
        queryKey: ['notification-state'],
        queryFn: getData,
        retry: false,
    });
};

export const useStopNotifications = () => {
    const api = useAxiosWithAuth(host);
    const queryClient = useQueryClient();

    const _add = async (formData) => {
        console.log(formData);

        const { data } = await api.delete(`unsubscribe`, { data: formData });
        return data;
    };

    return useMutation({
        mutationFn: _add,
        onSuccess: () => {
            createAlert('Success', 'تم ايقاف استلام الإشعارات');
            setTimeout(() => queryClient.invalidateQueries({ queryKey: ["notification-state"], exact: true }), 50);
        },
        onError: (error) => {
            console.error("Error updating data:", error.message);
        },
        retry: false,
    });
}

export const useStartNotifications = () => {
    const api = useAxiosWithAuth(host);
    const queryClient = useQueryClient();

    const _add = async (formData) => {
        console.log(formData);

        const { data } = await api.post(`register-subscribe`, formData);
        return data;
    };

    return useMutation({
        mutationFn: _add,
        onSuccess: () => {
            createAlert('Success', 'تم تفعيل استلام الإشعارات');
            setTimeout(() => queryClient.invalidateQueries({ queryKey: ["notification-state"], exact: true }), 50);
        },
        onError: (error) => {
            console.error("Error updating data:", error.message);
        },
        retry: false,
    });
}
