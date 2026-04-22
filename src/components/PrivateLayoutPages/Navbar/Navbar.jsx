import { CgMenuLeft } from "react-icons/cg";

export default function Navbar({ action }) {
  return (
    <div className="flex md:hidden justify-between items-center mx-3 backdrop-blur-md rounded-lg bg-white/70 dark:bg-gray-900/50 mb-1.5 px-3 py-3 h-16 sticky top-1 z-30 shadow-md_">
      <button
        className="text-xl hover:bg-yellow-500/80 hover:text-white rounded-md p-2 duration-150 text-gray-600 dark:text-gray-300 dark:hover:bg-blue-600"
        onClick={action}
      >
        <CgMenuLeft />
      </button>
      <div className="flex gap-3 items-center">
        <div className=" text-gray-700 text-3xl w-full text-nowrap font-bold dark:text-white">
          <img src="/assets/images/logo.png" alt="" className="w-12 my-auto" />
        </div>
      </div>
      <div className="w-9 h-9"></div>
      {/* <button
        className={`relative invisible_ lg:visible text-xl hover:bg-red-600 hover:text-white rounded-md p-2 duration-150 text-gray-600 dark:text-gray-300 dark:hover:bg-blue-600 notification`}
      >
        <div className="absolute inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 border-2 border-white rounded-full top-0 end-0 dark:border-gray-900  dark:bg-blue-600">
          2
        </div>
        <FiBell />
      </button> */}
    </div>
  );
}
