import { useClientCategories } from "api/Client/category";
import NavigationCard from "components/ClientLayoutPages/NavigationCard/NavigationCard";
import NavigationCardContainer from "components/ClientLayoutPages/NavigationCard/NavigationCardContainer";
import LogoSpinner from "components/Spinner/LogoSpinner";
import useParam from "Hooks/useParam";

import { useClientProduct, useCreateOrder } from "api/Client/product";
import { Spinner } from "components";
import CustomInput from "components/ClientLayoutPages/ClientInputField/CustomInput";
import ClientActionModal from "components/Modal/Client/ClientActionModal/ClientActionModal";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import ClientContactForInternetModal from "components/Modal/Client/ClientContactModal/ClientContactForInternetModal";
import { ContactRoundIcon } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { FiGlobe } from "react-icons/fi";

export default function Internet() {
  const internetId = useParam("internetId");
  const [ss, setSs] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [openContactModal, setOpenContactModal] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const { name } = useSelector((state) => state.auth);
  const { balance } = useSelector((state) => state.balance);

  const {
    data: categories,
    isLoading: categoriesIsLoading,
    isSuccess: categoriesIsSuccess,
    isError: categoriesIsError,
  } = useClientCategories(internetId || 7);

  const {
    data: categoriesforContact,
    isSuccess: categoriesforContactIsSuccess,
  } = useClientCategories(7);

  // عند تحديث الصفحة أو إعادة تحميل المكون
  useEffect(() => {
    const internetId = searchParams.get("internetId");

    if (internetId) {
      setSearchParams({ internetId }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }, []); // ينفذ مرة واحدة عند تحميل المكون

  if (categoriesIsError) return null;

  return (
    <>
      <div className="w-full max-w-6xl mx-auto  bg-blue-500_ p-4 mb-4">
        <div
          className="w-full max-w-2xl p-4 md:px-10 rounded-[2.5rem] border
        bg-white/20 backdrop-blur-xl border-white/20
        dark:bg-white/10 dark:border-white/10
        shadow-md my-4 mx-auto 
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

        <div className=" items-center justify-between  font-bold text-xl flex gap-1 flex-wrap">
          <NestedNavigation
            title={categories?.data?.currentCategory || "الانترنت"}
          />
          <button
            className={`p-3 rounded-2xl bg-gradient-to-br from-green-600 to-green-500`}
            onClick={() => setOpenContactModal(true)}
          >
            <ContactRoundIcon className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* {categories?.data?.currentCategory?.description && (
        <div className="bg-zinc-800 p-4 text-white rounded-md my-4">
          {categories?.data.currentCategory.description}
        </div>
      )} */}

        <div className="mt-4 w-full">
          {categoriesIsLoading && <LogoSpinner page />}
          {categoriesIsSuccess && (
            <NavigationCardContainer>
              {categories?.data.categories.map((category) => (
                <NavigationCard
                  key={category.id}
                  {...{ ...category, link: `?internetId=${category.id}` }}
                />
              ))}
            </NavigationCardContainer>
          )}

          {categoriesIsSuccess && categories?.data.products.length > 0 && (
            <ProductsByTag
              products={categories?.data?.products}
              setSs={setSs}
              setCurrentId={setCurrentId}
            />
          )}
        </div>
      </div>

      {openContactModal && (
        <ClientContactForInternetModal
          isOpen={openContactModal}
          toggle={setOpenContactModal}
          fields={["phone", "speed"]}
          productKey={"Internet"}
          subKey={
            categoriesforContactIsSuccess
              ? categoriesforContact?.data.categories.map((c) => {
                  return { id: c.id, name: c.name };
                })
              : []
          }
        />
      )}
      {ss && (
        <ProductDetailsModal isOpen={ss} toggle={setSs} currentId={currentId} />
      )}
    </>
  );
}

const NestedNavigation = ({ title }) => {
  return (
    <div className="flex items-center gap-2">
      <FiGlobe className="text-gray-500 dark:text-gray-300 w-5 h-5" />
      <h1 className="text-md_ dark:text-white text-gray-900">{title}</h1>
    </div>
  );
};

const ProductsByTag = ({ products = [], setSs, setCurrentId }) => {
  const tagLabels = {
    FREE_AMOUNT: "تسديد مبلغ",
    SPEED: "السرعات",
    PACKAGE: "الباقات",
    // IPTV: "IPTV",
  };

  // Group products by tag
  const groupedProducts = products.reduce((acc, product) => {
    const tag = product.tag;
    if (!tag) return acc;

    acc[tag] ??= [];
    acc[tag].push(product);

    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-8">
      {Object.entries(groupedProducts).map(([tag, items]) => (
        <div key={tag} className="flex flex-col gap-4">
          {/* Tag Title */}
          <h2 className="text-xl font-bold dark:text-white text-center mb-4">
            {tagLabels[tag] || tag}
          </h2>

          {/* Products */}
          <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
            {items.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  setSs(true);
                  setCurrentId(product.id);
                }}
                className="px-2 py-4 bg-black/10 hover:scale-105 h-fit duration-300 shadow-md dark:bg-white/10 rounded-3xl border cursor-pointer border-green-700"
              >
                <h3 className="font-bold text-sm text-nowrap text-center dark:text-white text-gray-800">
                  {product.name}
                </h3>

                <h5 className="font-bold text-xs text-nowrap text-center flex gap-1 items-center justify-center text-green-700 mt-2">
                  {product.price} <h6 className="text-[10px]">ل.س</h6>
                </h5>
              </div>
            ))}
          </div>
          <hr className="max-w-xl mx-auto border-green-700 mt-4 w-full border-dashed opacity-50" />
        </div>
      ))}
    </div>
  );
};

const ProductDetailsModal = ({ isOpen, toggle, currentId }) => {
  const number = useParam("phone");
  const name = useParam("name");
  const cat = useParam("subKey");
  const { currency } = useSelector((x) => x.balance);
  const [searchParams, setSearchParams] = useSearchParams();
  const [fields, setFields] = useState([]);
  const [fieldsValue, setFieldsValue] = useState(number ? { number } : {});
  const [price, setPrice] = useState(0);
  const [total, setTotal] = useState(0);
  const [showConfirmButtons, setShowConfirmButtons] = useState(false);
  const [timer, setTimer] = useState(10);

  const countdownRef = useRef(null);

  const {
    data: product,
    isLoading: productIsLoading,
    isSuccess: productIsSuccess,
  } = useClientProduct(currentId);

  const {
    mutate: createOrder,
    isPending: createOrderIsPending,
    isSuccess: createOrderIsSuccess,
  } = useCreateOrder(currentId);

  /* ------------------ Load Product ------------------ */

  useEffect(() => {
    if (productIsSuccess) {
      setFields(JSON.parse(product?.data.product?.fields) || []);
      setPrice(product?.data.product?.price);
    }
  }, [productIsSuccess, product]);

  /* ------------------ Calculate Total ------------------ */

  useEffect(() => {
    if (product?.data?.product.is_quantity) {
      setTotal(fieldsValue?.quantity * price || 0);
    } else {
      setTotal(price);
    }
  }, [fieldsValue, price, product?.data?.product.is_quantity]);

  /* ------------------ Reset After Success ------------------ */

  useEffect(() => {
    if (createOrderIsSuccess) {
      handleClose();
    }
  }, [createOrderIsSuccess]);

  const handleClose = () => {
    const internetId = searchParams.get("internetId");

    if (internetId) {
      setSearchParams({ internetId }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }

    toggle(false);
  };
  /* ------------------ Countdown ------------------ */

  const startCountdown = () => {
    setShowConfirmButtons(true);
    setTimer(10);

    clearInterval(countdownRef.current);

    countdownRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(countdownRef.current);
          handleConfirmOrder();
          return 10;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleConfirmOrder = () => {
    clearInterval(countdownRef.current);
    setShowConfirmButtons(false);
    createOrder(fieldsValue);
  };

  const handleCancel = () => {
    clearInterval(countdownRef.current);
    setShowConfirmButtons(false);
    setTimer(10);
  };

  return (
    <ClientActionModal
      title={product?.data.product?.name}
      isOpen={isOpen}
      close={handleClose}
      size="small"
    >
      {productIsLoading && (
        <div className="flex justify-center py-10">
          <LogoSpinner />
        </div>
      )}

      {productIsSuccess && name && cat && (
        <div
          className="
    mt-4 p-4 rounded-2xl
    bg-white/60 dark:bg-white/5
    backdrop-blur-xl
    border border-white/30 dark:border-white/10
    shadow-lg
    text-sm text-gray-700 dark:text-gray-200
    flex items-center gap-2
  "
        >
          <span className="text-base">💳</span>

          <span>
            أنت تدفع الآن لشركة{" "}
            <span className="font-semibold text-green-600 dark:text-green-400">
              {cat}
            </span>{" "}
            للزبون{" "}
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              {name}
            </span>
          </span>
        </div>
      )}
      {productIsSuccess && (
        <>
          {/* -------- Description -------- */}
          {product?.data.product?.description &&
            product?.data.product?.description !== `<p><br></p>` && (
              <div
                className="p-4 rounded-xl mb-6
                bg-white/60 dark:bg-white/5
                backdrop-blur-xl
                border border-white/20 dark:border-white/10
                text-gray-800 dark:text-white"
                dangerouslySetInnerHTML={{
                  __html: product?.data.product.description,
                }}
              />
            )}

          {/* -------- Form -------- */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              startCountdown();
            }}
            className="space-y-6 rounded-3xl p-8
            bg-white/60 dark:bg-white/5
            backdrop-blur-2xl
            border border-white/20 dark:border-white/10
            shadow-2xl"
          >
            {/* -------- Fields -------- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fields.map((field) => (
                <CustomInput
                  key={field.fieldId}
                  id={field.fieldId}
                  title={field.name}
                  type={field.type}
                  max={field.max}
                  min={field.min}
                  options={field.options}
                  value={fieldsValue[field.fieldId] || ""}
                  onChange={(v) =>
                    setFieldsValue((prev) => ({
                      ...prev,
                      [field.fieldId]: v.value,
                    }))
                  }
                  direction="ltr"
                  required={field.required}
                />
              ))}
            </div>

            {/* -------- Total -------- */}
            <div
              className="rounded-2xl p-5
              bg-gradient-to-br from-green-500/10 to-emerald-500/10
              border border-green-400/20
              flex justify-between items-center"
            >
              <span className="text-sm text-gray-500 dark:text-gray-400">
                الإجمالي
              </span>

              <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                {currency === "USD"
                  ? Math.ceil(total * 1000) / 1000
                  : currency === "S.P"
                    ? parseFloat(total).toLocaleString()
                    : ""}
                <span className="text-sm ml-1">ل.س</span>
              </span>
            </div>
            <span className="block mt-1 text-sm text-green-500">
              {total ? tafqeet(parseFloat(total).toLocaleString()) : ""} ل.س
            </span>

            {/* -------- Availability -------- */}
            {product?.data.product.is_available == 0 ? (
              <button
                disabled
                className="w-full h-12 rounded-xl
                bg-gray-400 text-white font-semibold"
              >
                هذا المنتج غير متوفر حالياً
              </button>
            ) : (
              <>
                {!showConfirmButtons ? (
                  <button
                    type="submit"
                    disabled={createOrderIsPending}
                    className="w-full h-12 rounded-xl
                    bg-gradient-to-r from-green-500 to-emerald-600
                    hover:scale-[1.02] active:scale-[0.98]
                    transition-all duration-300
                    text-white font-semibold shadow-lg"
                  >
                    {createOrderIsPending ? <Spinner sm /> : "انشاء الطلب"}
                  </button>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <button
                      onClick={handleConfirmOrder}
                      disabled={createOrderIsPending}
                      className="w-full h-12 rounded-xl
                      bg-green-600 hover:bg-green-700
                      text-white font-semibold transition-all"
                    >
                      تأكيد انشاء الطلب({timer})
                    </button>

                    <button
                      type="button"
                      onClick={handleCancel}
                      className="text-sm text-gray-500 hover:text-red-500 transition"
                    >
                      إلغاء العملية
                    </button>
                  </div>
                )}
              </>
            )}
          </form>
        </>
      )}
    </ClientActionModal>
  );
};

const tafqeet = (num) => {
  if (!num && num !== 0) return "";

  // نحول لـ string
  num = num.toString().trim();

  // نحذف فواصل الآلاف
  num = num.replace(/,/g, "");

  // نتأكد أنه رقم
  if (isNaN(num)) return "";

  num = Number(num);

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

      if (mil === 1) {
        results.push("مليون");
      } else if (mil === 2) {
        results.push("مليونان");
      } else if (mil <= 10) {
        results.push(convertGroup(mil) + " ملايين");
      } else {
        results.push(convertGroup(mil) + " مليوناً");
      }

      n %= 1000000;
    }

    // الآلاف
    if (n >= 1000) {
      const th = Math.floor(n / 1000);

      if (th === 1) {
        results.push("ألف");
      } else if (th === 2) {
        results.push("ألفان");
      } else if (th <= 10) {
        results.push(convertGroup(th) + " آلاف");
      } else {
        results.push(convertGroup(th) + " ألفاً");
      }

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
