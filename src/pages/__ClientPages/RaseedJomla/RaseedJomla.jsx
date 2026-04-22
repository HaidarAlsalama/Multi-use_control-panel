import { useClientJomla, useCreateOrderJomla } from "api/Client/jomla";
import { Spinner } from "components";
import { createAlert } from "components/Alert/Alert";
import ClientContactModal from "components/Modal/Client/ClientContactModal/ClientContactModal";
import useParam from "Hooks/useParam";
import {
  ArrowRightLeft,
  CheckCircle2,
  ContactRoundIcon,
  CreditCard,
  Send,
  Smartphone,
  Wallet,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

const PRODUCT_TYPE_MAP = {
  رصيد: "prepaid",
  فواتير: "postpaid",
  كاش: "cash",
};

const TRANSFER_TYPE_LABEL = {
  prepaid: "رصيد",
  postpaid: "فواتير",
  cash: "كاش",
};

const Raseed = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const { data: productData, isLoading } = useClientJomla();
  const {
    mutate: createJomla,
    isPending: IsPending,
    isSuccess: IsSuccess,
  } = useCreateOrderJomla();

  const { name } = useSelector((state) => state.auth);
  const { balance } = useSelector((state) => state.balance);

  const [operator, setOperator] = useState("empty");
  const [transferType, setTransferType] = useState("prepaid");
  const [amount, setAmount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [addNote, setAddNote] = useState(false);
  const [note, setNote] = useState("");
  const [quanttyText, setQuanttyText] = useState("");

  const [openContactModal, setOpenContactModal] = useState(false);

  useEffect(() => {
    setOperator(params.get("subKey") || "empty");

    const phone = params.get("phone");
    setPhoneNumber(phone === "null" ? "" : (phone ?? ""));

    const code = params.get("code");
    setCode(code === "null" ? "" : (code ?? ""));
  }, [location.search]);

  const operatorColors = {
    empty: "from-green-600 to-green-500",
    SYRIATEL: "from-red-600 to-red-500",
    MTN: "from-yellow-500 to-yellow-400",
  };

  // تحويل operator إلى uppercase لمطابقة المفاتيح
  const selectedOperatorKey = operator.toUpperCase();

  // المنتجات المتاحة حسب المشغل
  const productsByOperator = useMemo(() => {
    if (!productData || selectedOperatorKey === "EMPTY") return [];
    return productData[selectedOperatorKey] || [];
  }, [productData, selectedOperatorKey]);

  // أنواع التحويل المتوفرة
  const availableTransferTypes = useMemo(() => {
    return productsByOperator.map((p) => ({
      ...p,
      transferType: PRODUCT_TYPE_MAP[p.name] || "unknown",
    }));
  }, [productsByOperator]);

  // المنتج المختار حسب نوع التحويل
  const selectedProduct = availableTransferTypes.find(
    (p) => p.transferType === transferType,
  );

  // حقول المنتج الديناميكية
  const fields = selectedProduct ? JSON.parse(selectedProduct.fields) : [];

  const handleTransfer = (e) => {
    e.preventDefault();

    if (!selectedProduct) {
      console.warn("No product selected");
      return;
    }

    if (operator == "mtn" && phoneNumber.length !== 10) {
      return createAlert("Error", "يرجى ادخال رقم هاتف صالح.");
    }

    const payload = {
      number: phoneNumber,
      note,
      code,
      // operator: selectedOperatorKey, // SYRIATEL | MTN
      // transferType, // prepaid | postpaid | cash
      quantity: Number(amount),
      // unit_price: Number(selectedProduct.price),
      // total: Number(amount) * Number(selectedProduct.price),
      product_id: selectedProduct.id, // ⭐ المهم
      // product_name: selectedProduct.name,
      // currency: selectedProduct.currency || "S.P",
    };

    // console.log("FORM DATA:", payload);

    // لاحقًا:
    // await submitTransfer(payload)
    createJomla(payload);
  };

  useEffect(() => {
    // إذا الصفحة تم تحميلها حديثاً من browser (refresh)
    if (performance.getEntriesByType("navigation")[0].type === "reload") {
      navigate(location.pathname, { replace: true });
    }
  }, []);

  useEffect(() => {
    setQuanttyText("");
  }, [operator, transferType]);

  useEffect(() => {
    if (IsSuccess) {
      setOperator("empty");
      setPhoneNumber("");
      setAmount("");
      setTransferType("prepaid");
      setQuanttyText("");
      setNote("");
      setCode("");
      setAddNote(false);
    }
  }, [IsSuccess]);

  // استخراج حقل quantity مرة واحدة
  const quantityField = useMemo(() => {
    if (!selectedProduct?.fields) return null;

    try {
      const parsed = JSON.parse(selectedProduct.fields);
      return parsed.find((f) => f.fieldId === "quantity") || null;
    } catch (e) {
      return null;
    }
  }, [selectedProduct]);

  const handelAmountChange = (value) => {
    // console.log(value);
    const words = tafqeet(value);
    setQuanttyText(words);
    setAmount(value);
  };

  const transferTypesForOperator =
    operator === "mtn" ? ["prepaid", "postpaid"] : ["prepaid", "cash"];
  return (
    <div
      dir="rtl"
      className="h-full flex flex-col items-center p-0 md:p-8 md:pt-0 
         text-slate-800 dark:text-white transition-all duration-500 relative overflow-hidden"
    >
      {/* Glow */}
      <div
        className={`absolute -top-24 -left-24 w-[40%] h-[40%] rounded-full blur-[120px] opacity-20
          ${
            selectedOperatorKey === "SYRIATEL"
              ? "bg-red-600"
              : selectedOperatorKey === "MTN"
                ? "bg-yellow-500"
                : "bg-green-500"
          }
        `}
      />
      <div
        className={`absolute -bottom-24 -right-24 w-[40%] h-[40%] rounded-full blur-[120px] opacity-20
          ${
            selectedOperatorKey === "SYRIATEL"
              ? "bg-orange-600"
              : selectedOperatorKey === "MTN"
                ? "bg-yellow-300"
                : "bg-green-400"
          }
        `}
      />
      <div
        className="w-full max-w-2xl p-4 md:px-10 md:rounded-[2.5rem] border
        bg-white/20 backdrop-blur-xl border-white/20
        dark:bg-white/10 dark:border-white/10
        shadow-[0_8px_32px_0_rgba(0,0,0,0.25)] my-4 
        flex justify-between items-center gap-6 "
      >
        <div>
          {" "}
          <h1 className="text-sm_ font-bold text-gray-800 dark:text-white">
            {name}
          </h1>
        </div>
        <div>
          <h1 className="text-sm font-bold text-gray-800 dark:text-white">
            الرصيد
          </h1>
          {balance < 0 ? (
            <span
              // dir="ltr"
              className="text-[10px]_ text-red-500 font-bold uppercase tracking-wider"
            >
              {balance} <span className="text-xs">ل.س</span>
            </span>
          ) : (
            <span
              // dir="ltr"
              className="text-[10px]_ text-mainLight font-bold uppercase tracking-wider"
            >
              {balance} <span className="text-xs">ل.س</span>
            </span>
          )}
        </div>
      </div>

      <div
        className="w-full max-w-2xl p-4 md:p-10 md:rounded-[2.5rem] border
        bg-white/20 backdrop-blur-xl border-white/20
        dark:bg-white/10 dark:border-white/10
        shadow-[0_8px_32px_0_rgba(0,0,0,0.25)]
        relative z-10_"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-2xl bg-gradient-to-br ${
                operatorColors[selectedOperatorKey] || operatorColors["empty"]
              }`}
            >
              <ArrowRightLeft className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black">رصيد الجملة</h1>
              <p className="text-xs opacity-50 font-bold">
                إدارة عمليات التحويل
              </p>
            </div>
          </div>
          <button
            className={`p-3 rounded-2xl bg-gradient-to-br from-green-600 to-green-500`}
            onClick={() => setOpenContactModal(true)}
          >
            <ContactRoundIcon className="w-6 h-6 text-white" />
          </button>
        </div>

        <form onSubmit={handleTransfer} className="space-y-8">
          {/* Operator */}
          <div className="grid grid-cols-2 gap-4">
            {["syriatel", "mtn"].map((op) => (
              <button
                key={op}
                type="button"
                // disabled={phoneNumber >= 3 && operator != ""}
                onClick={() => {
                  setOperator(op);
                  // setTransferType(""); // إعادة تعيين النوع عند تغيير المشغل
                  setAmount("");
                }}
                className={`
                  p-4 rounded-3xl relative border-2 flex flex-col items-center gap-2 transition-all
                  ${
                    operator === op
                      ? op === "syriatel"
                        ? "border-red-500 bg-red-500/10"
                        : "border-yellow-500 bg-yellow-500/10"
                      : "border-transparent bg-black/10 dark:bg-white/5 hover:bg-black/20 dark:hover:bg-white/10"
                  }
                `}
              >
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center font-black
                    ${
                      op === "syriatel"
                        ? "bg-red-600 text-white"
                        : "bg-yellow-500 text-black"
                    }`}
                >
                  {op === "syriatel" ? (
                    <img
                      src="/assets/images/syriatelLogo.jpg"
                      alt="Syriatel Logo"
                      className="rounded-full"
                    />
                  ) : (
                    <img
                      src="/assets/images/MTNLogo.jpg"
                      alt="Syriatel Logo"
                      className="rounded-full"
                    />
                  )}
                </div>
                <span className="font-black text-sm uppercase">
                  {op === "syriatel" ? "Syriatel" : "MTN"}
                </span>
                {operator === op && (
                  <CheckCircle2
                    className={`w-5 h-5 absolute top-4 left-4 ${
                      op === "syriatel" ? "text-red-500" : "text-yellow-500"
                    }`}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Phone */}
          {operator == "mtn" && (
            <div>
              <label className="block mb-2 font-bold"> الرقم </label>
              <input
                type="tel"
                placeholder="09xx xxx xxx"
                value={phoneNumber}
                maxLength={10}
                max={10}
                min={10}
                minLength={10}
                required
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-5 py-4 rounded-xl border outline-none
              bg-white border-gray-200
              dark:bg-black/20 dark:border-white/10"
              />
            </div>
          )}

          <div>
            <label className="block mb-2 font-bold"> الكود </label>
            <input
              type="tel"
              placeholder="xxxxxx"
              value={code}
              minLength={4}
              required
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-5 py-4 rounded-xl border outline-none
              bg-white border-gray-200
              dark:bg-black/20 dark:border-white/10"
            />
          </div>

          {/* Transfer Type */}
          <div className="bg-black/10 dark:bg-black/20 p-1.5 rounded-2xl flex gap-1">
            {transferTypesForOperator.map((type) => {
              // جلب المنتج المقابل لهذا النوع
              const productForType = availableTransferTypes.find(
                (p) => p.transferType === type,
              );

              const Icon =
                type === "prepaid"
                  ? Smartphone
                  : type === "postpaid"
                    ? CreditCard
                    : Wallet;

              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    if (productForType) {
                      setTransferType(type);
                      setAmount("");
                    }
                  }}
                  disabled={!productForType} // منع الضغط إذا المنتج غير موجود
                  className={`
          flex-1 py-3 rounded-xl font-black text-xs
          flex items-center justify-center gap-2
          transition-all 
          ${
            transferType === type
              ? operator === "syriatel"
                ? "border-red-500 bg-red-500/40"
                : "border-yellow-500 bg-yellow-500/40"
              : "hover:bg-black/10 dark:hover:bg-white/10"
          }
          ${
            !productForType
              ? "opacity-30 cursor-not-allowed"
              : "text-gray-900 dark:text-white/70 hover:bg-blak/10"
          }
        `}
                >
                  <Icon size={16} />
                  {TRANSFER_TYPE_LABEL[type]}
                </button>
              );
            })}
          </div>

          {/* Amount */}
          {/* Amount + Total */}
          {transferType && selectedProduct && (
            <div className="relative flex gap-3">
              {/* Quantity */}

              <div className="relative w-2/3 flex flex-col gap-1">
                <label>الكمية</label>
                <input
                  type="number"
                  placeholder="أدخل الكمية"
                  value={amount}
                  required
                  min={quantityField?.min ?? undefined}
                  max={quantityField?.max ?? undefined}
                  onChange={(e) => handelAmountChange(e.target.value)}
                  className="w-full px-5 py-4 rounded-xl border
    bg-white border-gray-200 outline-none
    dark:bg-black/20 dark:border-white/10"
                />
              </div>

              {/* Total */}
              <div className="w-1/3 flex flex-col gap-1">
                <label>السعر</label>

                <input
                  type="text"
                  readOnly
                  value={
                    amount && selectedProduct.price
                      ? (
                          parseFloat(amount) * parseFloat(selectedProduct.price)
                        ).toFixed(2)
                      : ""
                  }
                  placeholder="الإجمالي"
                  className=" w-full px-5 py-4 rounded-xl border outline-none
        bg-gray-100 dark:bg-black/20 border-gray-200 dark:border-white/10
        text-gray-700 dark:text-white font-bold"
                />
              </div>
            </div>
          )}

          <span
            className={` block !mt-1 ${
              operator === "syriatel" ? "text-red-500" : "text-yellow-500"
            }`}
          >
            {quanttyText}
          </span>
          <div className="flex flex-col gap-3">
            {/* Checkbox */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={addNote}
                onChange={(e) => setAddNote(e.target.checked)}
                className="w-4 h-4"
              />
              <span>إضافة ملاحظات</span>
            </label>

            {/* Textarea */}
            {addNote && (
              <div className="relative w-full flex flex-col gap-1">
                <textarea
                  name="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-5 py-4 rounded-xl border
              bg-white border-gray-200 outline-none
              dark:bg-black/20 dark:border-white/10"
                  rows={4}
                  placeholder="يمكنك هنا اضافة ملاحظات خاصة بك من اجل العودة اليها لاحقاً"
                />
              </div>
            )}
          </div>

          {/* Tip */}
          <div className="flex gap-3 p-4 rounded-xl bg-white/5 border border-white/5 items-center">
            <Zap className="text-cyan-500" />
            <p className="text-[10px] opacity-40 font-bold">
              {" "}
              يرجى التاكد من البيانات قبل الارسال.
            </p>
          </div>

          {/* Submit */}
          <button
            disabled={!amount || !transferType || IsPending}
            className={`
              w-full py-5 rounded-xl font-black flex justify-center gap-3
              transition-all disabled:opacity-30
              ${
                selectedOperatorKey === "SYRIATEL"
                  ? "bg-gradient-to-r from-red-600 to-red-500 text-white"
                  : "bg-gradient-to-r from-yellow-500 to-yellow-400 text-black"
              }
            `}
          >
            {IsPending ? (
              <>
                <Spinner sm />
              </>
            ) : (
              <>
                <Send /> إرسال الطلب
              </>
            )}
          </button>
        </form>
      </div>
      {openContactModal && (
        <ClientContactModal
          isOpen={openContactModal}
          toggle={setOpenContactModal}
          fields={["phone", "code"]}
          productKey={"Rassed-Jomla"}
          subKey={["syriatel", "mtn"]}
        />
      )}
    </div>
  );
};

export default Raseed;

const tafqeet = (num) => {
  if (num === null || num === undefined || num === "" || isNaN(num)) return "";

  const ones = [
    "",
    "واحد",
    "اثنان",
    "ثلاثة",
    "أربعة",
    "خمسة",
    "ستة",
    "سبعة",
    "ثمانية",
    "تسعة",
    "عشرة",
    "أحد عشر",
    "اثنا عشر",
    "ثلاثة عشر",
    "أربعة عشر",
    "خمسة عشر",
    "ستة عشر",
    "سبعة عشر",
    "ثمانية عشر",
    "تسعة عشر",
  ];
  const tens = [
    "",
    "",
    "عشرون",
    "ثلاثون",
    "أربعون",
    "خمسون",
    "ستون",
    "سبعون",
    "ثمانون",
    "تسعون",
  ];
  const hundreds = [
    "",
    "مائة",
    "مائتان",
    "ثلاثمائة",
    "أربعمائة",
    "خمسمائة",
    "ستمائة",
    "سبعمائة",
    "ثمانمائة",
    "تسعمائة",
  ];

  const convertGroup = (n) => {
    let parts = [];
    if (n >= 100) {
      parts.push(hundreds[Math.floor(n / 100)]);
      n %= 100;
    }
    if (n >= 20) {
      const unit = n % 10;
      const ten = Math.floor(n / 10);
      if (unit !== 0) {
        parts.push(ones[unit] + " و" + tens[ten]);
      } else {
        parts.push(tens[ten]);
      }
    } else if (n > 0) {
      parts.push(ones[n]);
    }
    return parts.join(" و");
  };

  const processMain = (n) => {
    n = Math.floor(Math.abs(n));
    if (n === 0) return "صفر";
    let results = [];

    // الملايين
    if (n >= 1000000) {
      const mil = Math.floor(n / 1000000);
      if (mil === 1) results.push("مليون");
      else if (mil === 2) results.push("مليونان");
      else if (mil <= 10) results.push(convertGroup(mil) + " ملايين");
      else results.push(convertGroup(mil) + " مليون");
      n %= 1000000;
    }

    // الآلاف
    if (n >= 1000) {
      const th = Math.floor(n / 1000);
      if (th === 1) results.push("ألف");
      else if (th === 2) results.push("ألفان");
      else if (th <= 10) results.push(convertGroup(th) + " آلاف");
      else results.push(convertGroup(th) + " ألف");
      n %= 1000;
    }

    // الباقي (المئات والآحاد)
    if (n > 0) {
      results.push(convertGroup(n));
    }

    return results.join(" و");
  };

  const strNum = num.toString();
  if (strNum.includes(".")) {
    const [main, decimal] = strNum.split(".");
    const mainText = processMain(parseInt(main));

    // تحويل كل رقم عشري على حدة لضمان دقة مثل "صفر اثنان اثنان"
    const decimalDigits = decimal.split("").map((d) => {
      const val = parseInt(d);
      return val === 0 ? "صفر" : ones[val];
    });

    return `${mainText} فاصلة ${decimalDigits.join(" ")}`;
  }

  return processMain(parseFloat(num));
};
