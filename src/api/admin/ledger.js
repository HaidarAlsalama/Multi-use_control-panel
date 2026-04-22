import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useAxiosWithAuth } from "Hooks/useAxiosWithAuth";
import { createAlert } from "components/Alert/Alert";

/**
 * دفتر الحركات لكيان واحد (مورد / صندوق / تصنيف / منتج)
 * @param {string|null} type - 'supplier' | 'cashbox' | 'category' | 'product'
 * @param {number|null} id - رقم الكيان
 */
export const useLedger = (type, id) => {
  const api = useAxiosWithAuth();
  const enabled = Boolean(type && id);

  const getData = async () => {
    const { data } = await api.get("ledger", {
      params: { type, id },
    });
    return data;
  };

  return useQuery({
    queryKey: ["ledger", type, id],
    queryFn: getData,
    enabled,
    retry: false,
  });
};

/**
 * إضافة مبلغ للكيان المفتوح (من صندوق أو مورد)
 */
export const useAddFundsToLedgerEntity = (type, id) => {
  const api = useAxiosWithAuth();
  const queryClient = useQueryClient();

  const mutate = async (payload) => {
    const { data } = await api.post("ledger/entry", {
      ...payload,
      to_type: type,
      to_id: id,
    });
    return data;
  };

  return useMutation({
    mutationFn: mutate,
    onSuccess: (_, __, context) => {
      createAlert("Success", context?.message ?? "تم تسجيل الحركة بنجاح");
      queryClient.invalidateQueries(["ledger", type, id]);
      queryClient.invalidateQueries(["balances"]);
    },
    onError: (err) => {
      createAlert("Error", err?.response?.data?.message ?? err?.message ?? "حدث خطأ");
    },
    retry: false,
  });
};
