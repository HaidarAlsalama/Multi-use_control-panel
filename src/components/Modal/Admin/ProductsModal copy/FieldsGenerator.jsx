import React, { useEffect, useState } from "react";

const fieldOptions = [
  { id: "number", label: "تفعيل حقل الرقم" },
  { id: "code", label: "تفعيل حقل الكود" },
  { id: "userId", label: "تفعيل حقل الـ User Id" },
  { id: "quantity", label: "تفعيل حقل الكمية" },
  { id: "city", label: "تفعيل حقل المحافظة" },
  { id: "note", label: "تفعيل حقل الملاحظات" },
  { id: "more1", label: "حقل إضافي 1" },
  { id: "more2", label: "حقل إضافي 2" },
  { id: "more3", label: "حقل إضافي 3" },
  { id: "more4", label: "حقل إضافي 4" },
];

export default function FieldsGenerator({
  initialFields,
  register,
  errors,
  reset,
}) {
  const [bigField, setBigField] = useState({});
  const [fields, setFields] = useState({});
  const [checkedFields, setCheckedFields] = useState({});

  useEffect(() => {
    if (initialFields && initialFields.length > 0) {
      const initialFieldsObject = initialFields.reduce((acc, field) => {
        acc[field.fieldId] = field;
        return acc;
      }, {});
      setFields(initialFieldsObject);

      const bigFieldStates = initialFields.reduce((acc, field) => {
        acc[field.fieldId] = field.type === "select";
        return acc;
      }, {});
      setBigField(bigFieldStates);

      const checkedObject = initialFields.reduce((acc, field) => {
        acc[field.fieldId] = true;
        return acc;
      }, {});
      setCheckedFields(checkedObject);
    }
  }, []);

  const toggleField = (fieldId) => {
    setCheckedFields((prev) => {
      const newCheckedFields = { ...prev };
      newCheckedFields[fieldId] = !newCheckedFields[fieldId];
      return newCheckedFields;
    });

    setFields((prev) => {
      const newFields = { ...prev };
      if (newFields[fieldId]) {
        delete newFields[fieldId];
        if (fieldId === "quantity") {
          reset((prev) => {
            return {
              ...prev,
              is_quantity: false,
            };
          });
        }
      } else {
        newFields[fieldId] = {
          name: "",
          type: "text",
          min: null,
          max: null,
          required: false,
        };

        if (fieldId === "quantity") {
          reset((prev) => {
            return {
              ...prev,
              is_quantity: true,
            };
          });
        }
      }
      return newFields;
    });
  };

  const updateField = (fieldId, key, value) => {
    setFields((prev) => ({
      ...prev,
      [fieldId]: { ...prev[fieldId], [key]: value },
    }));
  };

  useEffect(() => {
    const result = Object.entries(fields).map(([key, value]) => ({
      fieldId: key,
      ...value,
    }));
    reset((prev) => ({
      ...prev,
      fields: JSON.stringify(result),
    }));
  }, [fields]);

  return (
    <div className="space-y-4">
      {fieldOptions.map(({ id, label }) => (
        <div key={id} className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={id}
              checked={checkedFields[id] || false}
              onChange={() => toggleField(id)}
              className="w-4 h-4 text-blue-600 bg-gray-100 cursor-pointer border-gray-300 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor={id}
              className="text-sm font-bold text-gray-700 dark:text-gray-200"
            >
              {label}
            </label>
          </div>

          {fields[id] && (
            <div className="p-4 grid md:grid-cols-2 gap-4 border rounded-md dark:border-gray-700">
              {/* اسم الحقل */}
              <div className="relative">
                <span className="text-gray-800 text-xs bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white border pb-0.5 rounded-sm absolute -top-2.5 right-2.5 px-1">
                  اسم الحقل
                </span>
                <input
                  type="text"
                  placeholder="أدخل اسم الحقل"
                  value={fields[id].name}
                  onChange={(e) => updateField(id, "name", e.target.value)}
                  className="p-2 border rounded w-full shadow-sm dark:text-white dark:bg-gray-800 dark:border-gray-600 outline-none focus:!border-blue-500"
                />
              </div>

              {/* نوع الحقل */}
              <div className="relative">
                <span className="text-gray-800 text-xs bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white border pb-0.5 rounded-sm absolute -top-2.5 right-2.5 px-1">
                  نوع الحقل
                </span>
                <select
                  value={fields[id].type}
                  onChange={(e) => {
                    const isSelect = e.target.value === "select";
                    updateField(id, "type", e.target.value);
                    setBigField((prev) => ({
                      ...prev,
                      [id]: isSelect,
                    }));
                  }}
                  className="py-1 px-2 border rounded w-full shadow-sm dark:text-white dark:bg-gray-800 dark:border-gray-600 outline-none focus:!border-blue-500"
                >
                  <option value="text">نص</option>
                  <option value="number">رقم</option>
                  <option value="select">اختيار</option>
                </select>
              </div>

              {/* إذا كان النوع اختيار */}
              {fields[id].type === "select" && bigField[id] ? (
                <div className="relative mt-4 md:col-span-2">
                  <span className="text-gray-800 text-xs bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white border pb-0.5 rounded-sm absolute -top-2.5 right-2.5 px-1">
                    حدد القيم
                  </span>
                  <input
                    type="text"
                    placeholder="قم بوضع القيم بهذه الطريقة   500-600-1000-1200"
                    value={fields[id].options || ""}
                    onChange={(e) => updateField(id, "options", e.target.value)}
                    className="p-2 border rounded w-full shadow-sm dark:text-white dark:bg-gray-800 dark:border-gray-600 outline-none focus:!border-blue-500"
                  />
                </div>
              ) : (
                <>
                  {/* أقل عدد محارف */}
                  <div className="relative mt-4">
                    <span className="text-gray-800 text-xs bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white border pb-0.5 rounded-sm absolute -top-2.5 right-2.5 px-1">
                      أقل عدد محارف
                    </span>
                    <input
                      type="text"
                      placeholder="أقل عدد محارف"
                      value={fields[id].min || ""}
                      onChange={(e) => updateField(id, "min", e.target.value)}
                      className="p-2 border rounded w-full shadow-sm dark:text-white dark:bg-gray-800 dark:border-gray-600 outline-none focus:!border-blue-500"
                    />
                  </div>

                  {/* أكثر عدد محارف */}
                  <div className="relative mt-4">
                    <span className="text-gray-800 text-xs bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white border pb-0.5 rounded-sm absolute -top-2.5 right-2.5 px-1">
                      أكثر عدد محارف
                    </span>
                    <input
                      type="text"
                      placeholder="أكثر عدد محارف"
                      value={fields[id].max || ""}
                      onChange={(e) => updateField(id, "max", e.target.value)}
                      className="p-2 border rounded w-full shadow-sm dark:text-white dark:bg-gray-800 dark:border-gray-600 outline-none focus:!border-blue-500"
                    />
                  </div>
                </>
              )}

              {/* جعل الحقل إجباري */}
              <div className="flex items-center gap-2 mt-4 md:col-span-2">
                <input
                  type="checkbox"
                  id={`${id}-required`}
                  checked={fields[id]?.required || false}
                  onChange={(e) =>
                    updateField(id, "required", e.target.checked)
                  }
                  className="w-4 h-4 text-blue-600 bg-gray-100 cursor-pointer border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor={`${id}-required`}
                  className="text-sm font-bold text-gray-700 dark:text-gray-200"
                >
                  الحقل إجباري
                </label>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
