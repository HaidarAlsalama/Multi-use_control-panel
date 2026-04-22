import React from "react";
import { AiFillProduct } from "react-icons/ai";
import { FaCartPlus } from "react-icons/fa";
import { FaUserTie } from "react-icons/fa";
import { IoStorefrontSharp } from "react-icons/io5";
import { Link } from "react-router-dom";

export default function FastInfo() {
  const cards = [
    {
      title: "100,000,000",
      description: "مجموع ارصدة الزبائن",
      icon: FaUserTie,
      color: "primary",
    },
    {
      title: 0,
      description: "عدد مندوبي المبيعات",
      icon: FaCartPlus,
      color: "warning",
    },
    {
      title: 9,
      description: "عدد المستخدمين",
      icon: IoStorefrontSharp,
      color: "success",
    },
    {
      title: 6,
      description: "عدد الادوار",
      icon: AiFillProduct,
      color: "danger",
    },
  ];

  const cards1 = [
    {
      title: "عدد الزبائن",
      description: 555,
      icon: FaUserTie,
    },
    {
      title: "عدد الطلبات",
      description: 555,
      icon: FaCartPlus,
    },
    {
      title: "عدد المنتجات",
      description: 555,
      icon: IoStorefrontSharp,
    },
    {
      title: "عدد التصنيفات",
      description: 555,
      icon: AiFillProduct,
    },
  ];

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 w-full ">
        {cards.map((card, index) => (
          <div
            className={`
                    group relative flex flex-col overflow-hidden items-start justify-between h-40 py-4 px-6 duration-700
                    rounded-lg shadow !text-white ${colorClasses[card.color]}
                `}
            key={index}
          >
            <h5 className="mb-1 text-4xl font-semibold z-10">{card.title}</h5>
            <p className="text- font-semibold max-w-52 pb-2">
              {card.description}
            </p>
            <Link
              className={`text-xl font-semibold max-w-52 btn bg-slate-700/40 w-32 hover:bg-slate-900/40 duration-700`}
            >
              عرض
            </Link>
            <card.icon className="group-hover:scale-110 absolute rtl:left-4 ltr:right-4 bottom-4  text-6xl  text-gray-200 duration-700" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 w-full ">
        {cards1.map((card, index) => (
          <div
            className="
                group relative flex flex-col overflow-hidden items-start w-80_ h-28 p-6 pt-4  bg-white border border-gray-200 
                rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700
                hover:bg-gray-100"
            key={index}
          >
            <h5 className="mb-1 text-xl font-semibold text-gray-600 dark:text-white group-hover:text-white_ z-10">
              {card.title}
            </h5>
            <p
              className="text-xl font-semibold max-w-52 text-gray-500 dark:text-gray-400
          duration-700  group-hover:text-blue-500"
            >
              {card.description}
            </p>
            <card.icon className="group-hover:scale-110 absolute rtl:left-4 ltr:right-4 bottom-4  text-6xl  text-gray-400 dark:text-gray-500 duration-700  group-hover:text-blue-500" />
          </div>
        ))}
      </div>
    </div>
  );
}

const colorClasses = {
  primary:
    "bg-blue-600/95 border-blue-200 dark:bg-blue-800 dark:border-blue-700 hover:bg-blue-700",
  warning:
    "bg-yellow-600/95 border-yellow-200 dark:bg-yellow-800 dark:border-yellow-700 hover:bg-yellow-700",
  success:
    "bg-green-600/95 border-green-200 dark:bg-green-800 dark:border-green-700 hover:bg-green-700",
  danger:
    "bg-red-600/95 border-red-200 dark:bg-red-800 dark:border-red-700 hover:bg-red-700",
};
