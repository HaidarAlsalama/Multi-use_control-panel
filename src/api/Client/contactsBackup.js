import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAlert } from "components/Alert/Alert";
import { useAxiosWithAuth } from "Hooks/useAxiosWithAuth";

export const CONTACTS_BACKUP_STATUS_KEY = ["contacts-backup-status"];

export const useContactsBackupStatus = () => {
  const api = useAxiosWithAuth();

  const getData = async () => {
    const { data } = await api.get("user/contacts-backup/status");
    return data;
  };

  return useQuery({
    queryKey: CONTACTS_BACKUP_STATUS_KEY,
    queryFn: getData,
    refetchOnWindowFocus: true,
    retry: false,
  });
};

export const useUploadContactsBackup = () => {
  const api = useAxiosWithAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contacts) => {
      const { data } = await api.post("user/contacts-backup", { contacts });
      return data;
    },
    onSuccess: (payload) => {
      createAlert(payload?.type || "Success", payload?.message || "تم الحفظ");
      queryClient.invalidateQueries({ queryKey: CONTACTS_BACKUP_STATUS_KEY });
    },
    retry: false,
  });
};

export const fetchContactsBackupFromServer = async (api) => {
  const { data } = await api.get("user/contacts-backup");
  return data;
};
