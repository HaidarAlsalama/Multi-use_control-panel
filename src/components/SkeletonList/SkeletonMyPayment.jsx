import { FaMoneyBillTransfer } from "react-icons/fa6";
import { GiSandsOfTime, GiTakeMyMoney } from "react-icons/gi";
import { MdNumbers } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
const SkeletonCard = () => (
  <div className="bg-zinc-900/80 cursor-pointer grid gap-1 h-64 p-6 rounded-2xl shadow-lg border border-yellow-500">
    <div className="flex justify-between items-center flex-row-reverse">
      <h2 className="text-xl  text-yellow-500 w-32 h-7 rounded-md animate-pulse bg-gray-700 "></h2>
      <div className={` items-center flex gap-3`}>
        <div className="text-xl p-1 text-yellow-500">
          <GiSandsOfTime />
        </div>
        <span className="w-16 h-6 rounded-md animate-pulse bg-gray-700 "></span>
      </div>
    </div>
    <div className={` items-center flex gap-3`}>
      <div className="text-xl p-1 text-yellow-500">
        <FaMoneyBillTransfer />
      </div>
      <span className=" w-32 h-6 rounded-md animate-pulse bg-gray-700 "></span>
    </div>
    <div className={` items-center flex gap-3`}>
      <div className="text-xl p-1 text-yellow-500">
        <MdNumbers />
      </div>
      <span className=" w-20 h-6 rounded-md animate-pulse bg-gray-700 "></span>
    </div>
    <div className=" items-center text-sm flex gap-3">
      <div className="text-xl p-1 text-yellow-500">
        <GiTakeMyMoney />
      </div>
      <span className="w-24 h-6 rounded-md animate-pulse bg-gray-700 "></span>
    </div>

    <div className=" items-center flex gap-3">
      <div className="text-xl p-1 text-yellow-500">
        <SlCalender />
      </div>
      <span
        style={{ direction: "ltr" }}
        className=" w-40 h-6 rounded-md animate-pulse bg-gray-700 "
      ></span>
    </div>
    <div className=" items-center flex gap-3">
      <div className="w-24 h-6 rounded-md animate-pulse bg-gray-700 "></div>
      <span className=" w-32 h-6 rounded-md animate-pulse bg-gray-700 "></span>
    </div>
  </div>
);

const SkeletonMyPayment = ({ number = 3 }) => (
  <div className="grid">
    <div className="mb-4 h-10 rounded-md bg-gray-600 shadow-md animate-pulse"></div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(number)
        .fill(0)
        .map((_, index) => (
          <SkeletonCard key={index} />
        ))}
    </div>
  </div>
);

export default SkeletonMyPayment;
