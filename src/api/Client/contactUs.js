import { useQuery } from "@tanstack/react-query";
import { useAxiosWithAuth } from "Hooks/useAxiosWithAuth";


export const useContactUs = () => {
    const api = useAxiosWithAuth();

    const getData = async () => {

        const { data } = await api.get('contact-message');
        return data[0];
    };

    return useQuery({
        refetchOnWindowFocus: false,
        queryKey: ['contact-us',],
        queryFn: getData,
        enabled: true,
        retry: false,
    });
};
