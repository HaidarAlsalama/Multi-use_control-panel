import { useContactUs } from "api/Client/contactUs";
import { Spinner } from "components";
import SkeletonAgents from "components/SkeletonList/SkeletonAgents";
import { formatPhoneDisplay } from "config/lib";
import { FaPhoneAlt, FaWhatsapp } from "react-icons/fa";

export default function ContactUs() {
  const {
    data: ContactUs,
    isLoading: ContactUsIsLoading,
    isSuccess: ContactUsIsSuccess,
  } = useContactUs();

  return (
    <div className="w-full max-w-6xl mx-auto my-4 ">
      {ContactUsIsLoading && <Spinner page />}

      {ContactUsIsSuccess && ContactUs.length === 0 && (
        <div className="text-white bg-gray-900 p-4 pt-2 rounded-lg max-w-md mb-8 mt-4 gap-4 mx-auto">
          <h1 className="text-center">لا يوجد بيانات</h1>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4_">
        {ContactUsIsSuccess &&
          ContactUs.length > 0 &&
          ContactUs.map((agent, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-800 border-l-4 border-yellow-500 rounded-md p-6 shadow hover:shadow-xl transition duration-300 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-bold text-yellow-500 mb-2">
                  {agent.title}
                </h2>
                <p
                  className="text-gray-500 font-bold dark:text-gray-300 whitespace-pre-line leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: agent.details.replace(/\n/g, "<br />"),
                  }}
                />
              </div>

              <div className="flex items-center gap-3 mt-4 text-sm text-gray-800 dark:text-gray-200">
                <div className="text-xl p-1 text-yellow-500">
                  <FaWhatsapp />
                </div>
                <a
                  target="_blank"
                  href={`https://wa.me/${agent.phone}`}
                  className="hover:text-yellow-500 font-bold text-gray-500"
                >
                  <p dir="ltr">{formatPhoneDisplay(agent.phone)}</p>
                </a>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
