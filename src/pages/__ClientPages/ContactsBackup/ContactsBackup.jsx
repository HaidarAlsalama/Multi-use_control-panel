import {
  CONTACTS_BACKUP_STATUS_KEY,
  fetchContactsBackupFromServer,
  useContactsBackupStatus,
  useUploadContactsBackup,
} from "api/Client/contactsBackup";
import Container from "components/ClientLayoutPages/Container/Container";
import LogoSpinner from "components/Spinner/LogoSpinner";
import { createAlert } from "components/Alert/Alert";
import { useAxiosWithAuth } from "Hooks/useAxiosWithAuth";
import { db } from "lib/contactsDb";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { CloudDownload, CloudUpload, Database } from "lucide-react";

function formatDate(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleString("ar-SY", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function ContactsBackup() {
  const api = useAxiosWithAuth();
  const queryClient = useQueryClient();
  const { data: statusRes, isLoading, isFetching, isError } =
    useContactsBackupStatus();
  const uploadMutation = useUploadContactsBackup();
  const [importing, setImporting] = useState(false);

  const meta = statusRes?.data ?? {};
  const hasBackup = Boolean(meta.has_backup);
  const serverMessage = statusRes?.message ?? "";

  const handleExportToServer = async () => {
    const rows = await db.contacts.toArray();
    const contacts = rows.map(({ name, key, subKey, data }) => ({
      name: name ?? "",
      key: key ?? "",
      subKey: subKey ?? "",
      data: data && typeof data === "object" ? data : {},
    }));
    uploadMutation.mutate(contacts);
  };

  const handleImportFromServer = async () => {
    if (
      !window.confirm(
        "سيتم مسح الحافظة المحلية بالكامل واستبدالها بنسخة السيرفر. هل تريد المتابعة؟",
      )
    ) {
      return;
    }
    setImporting(true);
    try {
      const payload = await fetchContactsBackupFromServer(api);
      const contacts = payload?.data?.contacts;
      if (!Array.isArray(contacts)) {
        createAlert("Error", "تعذر قراءة بيانات النسخة من السيرفر.");
        return;
      }
      await db.contacts.clear();
      const rows = contacts.map(({ name, key, subKey, data }) => ({
        name: name ?? "",
        key: key ?? "",
        subKey: subKey ?? "",
        data: data && typeof data === "object" ? data : {},
      }));
      if (rows.length) {
        await db.contacts.bulkAdd(rows);
      }
      createAlert(
        payload?.type || "Success",
        payload?.message || "تم استيراد الحافظة من السيرفر.",
      );
      queryClient.invalidateQueries({ queryKey: CONTACTS_BACKUP_STATUS_KEY });
    } catch (e) {
      if (!e?.response) {
        createAlert("Warning", "تعذر الاتصال بالسيرفر.");
      }
    } finally {
      setImporting(false);
    }
  };

  const busy =
    isLoading ||
    isFetching ||
    uploadMutation.isPending ||
    importing;

  return (
    <Container title="نسخ الحافظة (تصدير / استيراد)" back>
      {isLoading && <LogoSpinner />}

      {!isLoading && (
        <div
          dir="rtl"
          className="max-w-xl mx-auto space-y-4 rounded-[2rem] border border-gray-200 dark:border-white/10 bg-gradient-to-br from-green-50 via-white to-green-100/80 dark:from-gray-900 dark:via-gray-950 dark:to-black p-6 shadow-md"
        >
          <div className="flex items-start gap-3">
            <Database className="w-8 h-8 text-mainLight shrink-0 mt-0.5" />
            <div className="space-y-1 text-sm text-gray-700 dark:text-gray-200">
              <p className="font-bold text-gray-900 dark:text-white">
                مزامنة حافظة جهات الاتصال (محلي ↔ السيرفر)
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                النسخة على السيرفر مرتبطة بحسابك فقط. التصدير يرفع كل السجلات من
                المتصفح الحالي؛ الاستيراد يمسح المحلي ويستبدله بنسخة السيرفر.
              </p>
            </div>
          </div>

          <div
            className={`rounded-2xl border px-4 py-3 text-sm ${
              hasBackup
                ? "border-green-200 bg-green-50/80 text-green-900 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-100"
                : "border-amber-200 bg-amber-50/80 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100"
            }`}
          >
            {isError ? (
              <p>تعذر التحقق من وجود نسخة على السيرفر. تحقق من الاتصال أو رمز PIN.</p>
            ) : hasBackup ? (
              <div className="space-y-1">
                <p className="font-semibold">توجد نسخة جاهزة للاسترداد على السيرفر.</p>
                <p className="text-xs opacity-90">
                  عدد السجلات:{" "}
                  <span className="font-bold">{meta.contacts_count ?? 0}</span>
                  {meta.updated_at && (
                    <>
                      {" "}
                      — آخر تحديث:{" "}
                      <span className="font-bold">{formatDate(meta.updated_at)}</span>
                    </>
                  )}
                </p>
                {serverMessage && (
                  <p className="text-xs opacity-80 mt-1">{serverMessage}</p>
                )}
              </div>
            ) : (
              <div className="space-y-1">
                <p className="font-semibold">لا توجد نسخة محفوظة على السيرفر بعد.</p>
                <p className="text-xs opacity-90">
                  استخدم «رفع نسخة للسيرفر» لإنشاء نسختك الأولى.
                </p>
                {serverMessage && (
                  <p className="text-xs opacity-80 mt-1">{serverMessage}</p>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              disabled={busy}
              onClick={handleExportToServer}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 shadow-md"
            >
              <CloudUpload className="w-5 h-5" />
              رفع نسخة للسيرفر
            </button>
            <button
              type="button"
              disabled={busy || !hasBackup || isError}
              onClick={handleImportFromServer}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold border border-mainLight/40 text-mainLight hover:bg-mainLight/10 disabled:opacity-40"
            >
              <CloudDownload className="w-5 h-5" />
              استيراد من السيرفر
            </button>
          </div>

          {busy && !isLoading && (
            <p className="text-center text-xs text-gray-500">جاري المعالجة…</p>
          )}
        </div>
      )}
    </Container>
  );
}
