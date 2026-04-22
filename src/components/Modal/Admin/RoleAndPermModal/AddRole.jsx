import { zodResolver } from "@hookform/resolvers/zod";
import {
  useAddRole,
  useAllCateoriesCustomize,
  usePermission,
} from "api/admin/roleAndPerm";
import { Spinner } from "components";
import { InputFieldZod } from "components/InputField/InputFieldZod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ActionModal from "../../ActionModal/ActionModal";
import { createAlert } from "components/Alert/Alert";

const schema = z.object({
  name: z.string().nonempty("يرجى ادخال اسم الدور."),
});

const fields = [{ title: "الاسم", id: "name", required: true, type: "text" }];

export default function AddRole({ isOpen, toggle }) {
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    console.log(selectedPermissions);
  }, [selectedPermissions]);

  const {
    mutate: addRole,
    isPending: addRoleIsPending,
    isSuccess: addRoleIsSuccess,
  } = useAddRole();

  const {
    data: permissions,
    isSuccess: permissionsIsSuccess,
    isLoading: permissionsIsIsLoading,
  } = usePermission();

  const {
    data: categories,
    isSuccess: categoriesIsSuccess,
    isFetching: categoriesIsIsLoading,
  } = useAllCateoriesCustomize(
    selectedPermissions.includes("customize_orders")
  );

  useEffect(() => {
    if (addRoleIsSuccess) {
      toggle(false);
    }
  }, [addRoleIsSuccess, toggle]);

  const onSubmit = (data) => {
    if (selectedPermissions.length == 0) {
      createAlert("Error", "يجب تحديد صلاحية واحدة على الاقل.");
      return;
    }
    console.log({
      ...data,
      permission: selectedPermissions,
      categories: selectedCategories,
    });
    addRole({
      ...data,
      permission: selectedPermissions,
      categories: selectedCategories,
    });
  };

  // تجميع الصلاحيات حسب التصنيف (tag)
  const handleCheckboxChange = (permissionName) => {
    setSelectedPermissions((prev) => {
      if (prev.includes(permissionName)) {
        return prev.filter((perm) => perm !== permissionName);
      } else {
        return [...prev, permissionName];
      }
    });
  };

  const isChecked = (permissionName) =>
    selectedPermissions.includes(permissionName);

  const groupedPermissions = permissionsIsSuccess
    ? permissions.data.reduce((acc, permission) => {
        acc[permission.tag] = acc[permission.tag] || [];
        acc[permission.tag].push(permission);
        return acc;
      }, {})
    : {};

  const handleCheckboxChangeCategory = (id) => {
    setSelectedCategories(
      (prevSelected) =>
        prevSelected.includes(id)
          ? prevSelected.filter((item) => item !== id) // إزالة إذا كان موجود
          : [...prevSelected, id] // إضافة إذا لم يكن موجود
    );
  };

  return (
    <ActionModal open={isOpen} close={toggle} size="small" title={"اضافة دور"}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {fields.map(({ title, id, required, type, direction }) => (
          <InputFieldZod
            key={id}
            title={title}
            name={id}
            required={required}
            type={type}
            register={register}
            errors={errors}
            direction={direction || "rtl"}
          />
        ))}

        <div className="overflow-x-auto mx-auto flex-grow w-full rounded-t-md">
          <table className="text-sm text-gray-500 dark:text-gray-400 text-center w-full">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
              <tr>
                <th scope="col" className="px-4 py-2 text-nowrap">
                  الاسم
                </th>
                <th scope="col" className="px-4 py-2 text-nowrap  max-w-20">
                  الصلاحيات
                </th>
              </tr>
            </thead>
            <tbody className="">
              {Object.entries(groupedPermissions).map(
                ([tag, permissions], index) => (
                  <tr
                    className={`
                        odd:bg-white text-lg_ odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 
                        hover:dark:bg-gray-700 hover:bg-gray-200
                        `}
                    key={index}
                  >
                    <td className="px-4 py-2 text-nowrap">{tag}</td>
                    <td className="px-4 py-2 text-nowrap flex justify-center gap-4">
                      {permissions.map((permission) => (
                        <label
                          key={permission.id}
                          className="flex items-center gap-1"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked(permission.name)}
                            onChange={() =>
                              handleCheckboxChange(permission.name)
                            }
                            className="w-4 h-4  text-blue-600 bg-gray-100 cursor-pointer border-gray-300 -blue-500 dark:-blue-600 dark:ring-offset-gray-800 -2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          {permission.short_operation}
                        </label>
                      ))}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>

          {categoriesIsSuccess &&
            selectedPermissions.includes("customize_orders") && (
              <table className="text-sm mt-8 text-gray-500 dark:text-gray-400 text-center w-full">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
                  <tr>
                    <th scope="col" className="px-4 py-2 text-nowrap">
                      التصنيفات الرئيسية
                    </th>
                  </tr>
                </thead>
                <tbody className="">
                  {categories?.data.map((category) => (
                    <tr
                      className={`
                        odd:bg-white text-lg_ odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 
                        hover:dark:bg-gray-700 hover:bg-gray-200
                        `}
                      key={category.id}
                    >
                      <td className="px-4 py-2 text-nowrap">
                        <label className="flex items-center gap-1 ">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(category.id)}
                            onChange={() =>
                              handleCheckboxChangeCategory(category.id)
                            }
                            className="w-4 h-4 text-blue-600 bg-gray-100 cursor-pointer
                border-gray-300 -blue-500 dark:-blue-600
                dark:ring-offset-gray-800 -2 dark:bg-gray-700
                dark:border-gray-600"
                          />
                          <span>{category.name}</span>
                        </label>{" "}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

          {(permissionsIsIsLoading || categoriesIsIsLoading) && (
            <div className="my-4">
              <Spinner />
            </div>
          )}

          {!permissionsIsIsLoading && permissions?.data.length == 0 && (
            <div className="w-full text-center p-5 font-semibold bg-gray-200 dark:bg-gray-900 dark:text-white">
              <h1>لا يوجد بيانات</h1>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary mx-auto !py-1 w-20 h-7"
          disabled={addRoleIsPending}
        >
          {addRoleIsPending ? <Spinner sm /> : "إضافة"}
        </button>
      </form>
    </ActionModal>
  );
}
