import { useQuery } from "@tanstack/react-query";
import { useAxiosWithAuth } from "Hooks/useAxiosWithAuth";

export const useProductsProfit = ({ from, to, product_id, category_id } = {}) => {
  const api = useAxiosWithAuth();

  return useQuery({
    queryKey: ["products-profit", from, to, product_id, category_id],
    queryFn: async () => {
      const { data } = await api.get("products-profit", {
        params: {
          from: from || undefined,
          to: to || undefined,
          product_id: product_id || undefined,
          category_id: category_id || undefined,
        },
      });

      return data?.data || [];
    },
  });
};

