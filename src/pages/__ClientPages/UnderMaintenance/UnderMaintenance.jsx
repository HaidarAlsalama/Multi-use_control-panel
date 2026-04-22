import { useCustomerViewSate } from "api/admin/customerView";
import LogoSpinner from "components/Spinner/LogoSpinner";
import { useEffect } from "react";
import { FaTools } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function UnderMaintenance() {
  const { data, isSuccess, isLoading } = useCustomerViewSate();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess && !isLoading) {
      if (!data.maintenance) navigate("/my-account");
    }
  }, [data]);

  return (
    <div className="h-full flex flex-col items-center justify-center_ pt-40 text-center px-4 text-white">
      <LogoSpinner />

      <h1 className="text-4xl font-bold my-4 text-green-500">
        الموقع قيد الصيانة
      </h1>
      <p className="text-lg text-gray-300 max-w-md">
        نعمل حالياً على تحسين تجربتكم.
      </p>
      <p className="text-lg text-gray-300 max-w-md">
        شكراً لتفهمكم وعودوا لزيارتنا قريباً.
      </p>
    </div>
  );
}
