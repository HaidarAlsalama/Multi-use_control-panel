import { CheckboxZod } from "components/InputField/CheckboxZod";
import React, { useEffect, useState } from "react";

const CustomerPricingForm = ({
  isDynamic,
  customers,
  register,
  errors,
  reset,
  initialData,
}) => {
  // إنشاء حالة لتخزين بيانات النموذج
  const [pricingData, setPricingData] = useState(
    customers.map(({ id, name }) => ({
      customerGroup_id: id,
      customerName: name,
      price_buy_dollar: "",
      percentage_dollar: "",
      price_buy_lira: "",
      percentage_lira: "",
    }))
  );

  // دالة لتعبئة البيانات تلقائيًا إذا كانت موجودة
  const fillDataIfExists = () => {
    if (initialData) {
      const mergedData = pricingData.map((item) => {
        const storedItem = initialData.find(
          (stored) => stored.customerGroup_id === item.customerGroup_id
        );
        return storedItem ? { ...item, ...storedItem } : item;
      });
      setPricingData(mergedData);
      reset((prev) => ({
        ...prev,
        prices: JSON.stringify(mergedData),
      }));
    }
  };

  // استدعاء الدالة بعد اكتمال تحميل المكون
  useEffect(() => {
    fillDataIfExists();
  }, []);

  // تحديث القيم عند الإدخال
  const handleInputChange = (index, field, value) => {
    const updatedData = [...pricingData];
    updatedData[index][field] = value;
    setPricingData(updatedData);
    reset((prev) => {
      return {
        ...prev,
        prices: JSON.stringify(updatedData),
      };
    });
  };

  return (
    <div className="space-y-6">
      <div className="border p-4 rounded-lg shadow-sm dark:border-gray-700">
        <h3 className="font-semibold text-lg mb-6 dark:text-white">
          سعر الشراء{" "}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* dollar */}

          <div className="relative ">
            <span
              className="text-gray-800 text-xs bg-green-200 dark:bg-green-800 dark:border-gray-700
              dark:text-white border pb-0.5 rounded-sm absolute -top-2.5 right-2.5 px-1"
            >
              شراء بالدولار
            </span>
            <input
              {...register("price_dollar")}
              step="any" // يسمح بإدخال قيم ديسيمال
              type="number"
              id="price_dollar"
              onWheel={(e) => e.target.blur()} // يمنع السكرول من تغيير القيم
              placeholder="USD"
              // value={item.price_buy_dollar}
              // onChange={(e) =>
              //   // handleInputChange(index, "price_buy_dollar", e.target.value)
              // }
              className="p-2 border rounded w-full shadow-sm dark:text-white dark:bg-gray-800 dark:border-gray-600 outline-none focus:!border-blue-500"
            />
            {errors["price_dollar"] && (
              <p className="text-red-500 dark:text-red-600 mt-0.5 text-xs text-center">
                {errors["price_dollar"].message}
              </p>
            )}
          </div>

          {/* lira */}

          <div className="relative ">
            <span
              className="text-gray-800 text-xs bg-white dark:bg-gray-800 dark:border-gray-700
              dark:text-white border pb-0.5 rounded-sm absolute -top-2.5 right-2.5 px-1"
            >
              شراء بالليرة
            </span>
            <input
              {...register("price_lira")}
              step="any" // يسمح بإدخال قيم ديسيمال
              type="number"
              name="price_lira"
              onWheel={(e) => e.target.blur()} // يمنع السكرول من تغيير القيم
              placeholder="S.P"
              // value={item.price_buy_lira}
              // onChange={(e) =>
              //   handleInputChange(index, "price_buy_lira", e.target.value)
              // }
              className="p-2 border rounded w-full shadow-sm dark:text-white dark:bg-gray-800 dark:border-gray-600 outline-none focus:!border-blue-500"
            />
            {errors["price_lira"] && (
              <p className="text-red-500 dark:text-red-600 mt-0.5 text-xs text-center">
                {errors["price_lira"].message}
              </p>
            )}
          </div>
        </div>
      </div>

      {pricingData.map((item, index) => (
        <div
          key={index}
          className="border p-4 rounded-lg shadow-sm dark:border-gray-700"
        >
          <h3 className="font-semibold text-lg mb-6 dark:text-white">
            {item.customerName}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* dollar */}

            <div className="relative ">
              <span
                className="text-gray-800 text-xs bg-green-200 dark:bg-green-800 dark:border-gray-700
              dark:text-white border pb-0.5 rounded-sm absolute -top-2.5 right-2.5 px-1"
              >
                نسبة الربح دولار
              </span>
              <input
                step="any" // يسمح بإدخال قيم ديسيمال
                type="number"
                onWheel={(e) => e.target.blur()} // يمنع السكرول من تغيير القيم
                placeholder="0.0 %"
                value={item.percentage_dollar}
                onChange={(e) =>
                  handleInputChange(index, "percentage_dollar", e.target.value)
                }
                className="p-2 border rounded w-full shadow-sm dark:text-white dark:bg-gray-800 dark:border-gray-600 outline-none focus:!border-blue-500"
              />
            </div>
            <div className="relative ">
              <span
                className="text-gray-800 text-xs bg-green-200 dark:bg-green-800 dark:border-gray-700
              dark:text-white border pb-0.5 rounded-sm absolute -top-2.5 right-2.5 px-1"
              >
                البيع بالدولار
              </span>
              <input
                step="any" // يسمح بإدخال قيم ديسيمال
                type="number"
                onWheel={(e) => e.target.blur()} // يمنع السكرول من تغيير القيم
                placeholder="USD"
                value={item.price_buy_dollar}
                onChange={(e) =>
                  handleInputChange(index, "price_buy_dollar", e.target.value)
                }
                className="p-2 border rounded w-full shadow-sm dark:text-white dark:bg-gray-800 dark:border-gray-600 outline-none focus:!border-blue-500"
              />
            </div>

            {/* lira */}

            <div className="relative ">
              <span
                className="text-gray-800 text-xs bg-white dark:bg-gray-800 dark:border-gray-700
              dark:text-white border pb-0.5 rounded-sm absolute -top-2.5 right-2.5 px-1"
              >
                نسبة الربح ليرة
              </span>
              <input
                step="any" // يسمح بإدخال قيم ديسيمال
                type="number"
                onWheel={(e) => e.target.blur()} // يمنع السكرول من تغيير القيم
                placeholder="0.0 %"
                value={item.percentage_lira}
                onChange={(e) =>
                  handleInputChange(index, "percentage_lira", e.target.value)
                }
                className="p-2 border rounded w-full shadow-sm dark:text-white dark:bg-gray-800 dark:border-gray-600 outline-none focus:!border-blue-500"
              />
            </div>
            <div className="relative ">
              <span
                className="text-gray-800 text-xs bg-white dark:bg-gray-800 dark:border-gray-700
              dark:text-white border pb-0.5 rounded-sm absolute -top-2.5 right-2.5 px-1"
              >
                البيع بالليرة
              </span>
              <input
                step="any" // يسمح بإدخال قيم ديسيمال
                type="number"
                onWheel={(e) => e.target.blur()} // يمنع السكرول من تغيير القيم
                placeholder="S.P"
                value={item.price_buy_lira}
                onChange={(e) =>
                  handleInputChange(index, "price_buy_lira", e.target.value)
                }
                className="p-2 border rounded w-full shadow-sm dark:text-white dark:bg-gray-800 dark:border-gray-600 outline-none focus:!border-blue-500"
              />
            </div>
          </div>
        </div>
      ))}
      <CheckboxZod
        title={"تسعير ديناميكي"}
        name={"is_dynamic"}
        register={register}
        errors={errors}
        value={isDynamic}
      />
    </div>
  );
};

export default CustomerPricingForm;
