/**
 * عرض الرصيد بعد العملية: من الحقل إن وُجد، وإلا حساب تقريبي قبل + المبلغ (للسجلات القديمة).
 */
export function formatTotalAfterDisplay(item) {
  if (item == null) return "—";
  const raw = item.total_after_operation;
  if (raw !== null && raw !== undefined && raw !== "") {
    return Number(raw).toLocaleString();
  }
  const before = item.total_before_operation;
  const amount = item.amount;
  if (
    before !== null &&
    before !== undefined &&
    amount !== null &&
    amount !== undefined
  ) {
    return (Number(before) + Number(amount)).toLocaleString();
  }
  return "—";
}
