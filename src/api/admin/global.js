import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAlert } from "components/Alert/Alert";
import { useAxiosWithAuth } from "Hooks/useAxiosWithAuth";

import { saveAs } from "file-saver"; // لتنزيل الملف (install file-saver)


export const useToggleStatus = (type) => {
  const api = useAxiosWithAuth();
  const queryClient = useQueryClient();

  const editToggleStatus = async (id) => {
    const { data } = await api.patch(`toggle-state/${type}/${id}`);
    return data;
  };

  return useMutation({
    mutationFn: editToggleStatus,
    onSuccess: ({ type, message }) => {
      createAlert(type, message);
      setTimeout(() => {
        queryClient.invalidateQueries([type]);
      }, 50);
    },
    onError: (error) => {
      console.error("Error updating data:", error.message);
    },
    enable: !!type,
    retry: false,
  });
};

export const useDeleteImage = () => {
  const api = useAxiosWithAuth();
  const queryClient = useQueryClient();

  const _delete = async (formData) => {
    const { data } = await api.post(`delete-image`, formData);
    return data;
  };

  return useMutation({
    mutationFn: _delete,
    onSuccess: ({ type, message }) => {
      createAlert(type, message);
      setTimeout(() => {
        queryClient.invalidateQueries();
      }, 50);
    },
    onError: (error) => {
      console.error("Error delete data:", error.message);
    },
    retry: false,
  });
};


export const useBackup = () => {
  const api = useAxiosWithAuth();

  const getBackup = async () => {
    // هنا نستخدم إعدادات axios بشكل مباشر لتحديد الـ `onDownloadProgress`
    const response = await api.post("nemo-backup", {
      responseType: "blob", // تحديد أن الاستجابة ستكون ملف
    });

    // تحويل الاستجابة إلى Blob ثم تنزيله
    const blob = new Blob([response.data], { type: "application/sql" });

    // جلب اسم الملف من الهيدر أو اسم افتراضي
    const originalFilename = response.headers["content-disposition"]
      ?.split("filename=")[1]
      ?.replace(/"/g, "") || "backup.sql";

    // إنشاء تاريخ اليوم بالشكل YYYY_MM_DD
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const formattedDate = `${yyyy}_${mm}_${dd}`;

    // تركيب اسم الملف مع التاريخ
    const filename = originalFilename.replace(
      /\.sql$/i,
      `_${formattedDate}.sql`
    );


    saveAs(blob, filename); // حفظ الملف
    return { type: "success", message: "تم تحميل النسخة الاحتياطية بنجاح" };
  };

  return useMutation({
    mutationFn: getBackup,
    onSuccess: ({ type, message }) => {
      createAlert(type, message);
    },
    onError: (error) => {
      createAlert("error", "حدث خطأ أثناء تحميل النسخة الاحتياطية");
      console.error("Error downloading backup:", error.message);
    },
    retry: false, // لا تعيد المحاولة تلقائيًا
  });
};
