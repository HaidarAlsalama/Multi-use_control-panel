import { FaWhatsapp } from "react-icons/fa";
import { LuMapPin } from "react-icons/lu";
import { MdAlternateEmail } from "react-icons/md";

const SkeletonCard = () => (
  <div className="bg-zinc-900/80 h-56 grid gap-2 text-white p-6 rounded-2xl shadow-lg border border-yellow-500 hover:shadow-xl transition-shadow">
    <div className="w-32 h-6 bg-gray-700 rounded animate-pulse"></div>
    <div className="w-48 h-4 bg-gray-700 rounded animate-pulse mt-1"></div>
    <div className="text-gray-400 items-center text-sm flex gap-1 mt-2">
      <div className="text-xl p-1 text-yellow-500">
        <LuMapPin />
      </div>
      <div className="w-64 h-4 bg-gray-700 rounded animate-pulse"></div>
    </div>
    <div className="text-gray-400 items-center flex gap-1 mt-2">
      <div className="text-xl p-1 text-yellow-500">
        <FaWhatsapp />
      </div>
      <div className="w-40 h-4 bg-gray-700 rounded animate-pulse"></div>
    </div>
  </div>
);

const SkeletonAgents = ({ number = 3 }) => (
  <div className="grid">
    {/* <div className="mb-4 h-10 rounded-md bg-gray-600 shadow-md animate-pulse"></div> */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(number)
        .fill(0)
        .map((_, index) => (
          <SkeletonCard key={index} />
        ))}
    </div>
  </div>
);

export default SkeletonAgents;
