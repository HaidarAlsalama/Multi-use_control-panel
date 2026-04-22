import { useEffect } from "react";
import { HiOutlineChevronDoubleRight } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

export default function Container({ children, title, message, back = false }) {
  const navigate = useNavigate();
  useEffect(() => {
    if (title) {
      document.title = `${title} | المحترف`;
    }
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto  bg-blue-500_ p-4 mb-4">
      <div className="flex items-center gap-4">
        {back && (
          <button
            onClick={() => navigate(-1)}
            className="btn btn-dark text-md md:text-xl"
          >
            <HiOutlineChevronDoubleRight />
          </button>
        )}
        <h1 className="text-gray-900 dark:text-white text-md md:text-xl">
          {title}
        </h1>
      </div>

      {message && (
        <h1 className="text-white  mt-4 bg-yellow-500 py-2 px-4 rounded-md shadow-md">
          {message}
        </h1>
      )}
      <div className="mt-4 w-full">{children}</div>
    </div>
  );
}
