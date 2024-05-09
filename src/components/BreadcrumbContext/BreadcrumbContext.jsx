import React from "react";
import { RiArrowDropLeftFill, RiArrowDropRightFill } from "react-icons/ri";
import { Link } from "react-router-dom";

export default function BreadcrumbContext({ locations }) {
//   const location = useLocation();

//   useEffect(() => {
//     console.log(location.pathname);
//   }, [location]);

  return (
    <div className={" md:mb-2 flex gap-2"}>
      {locations.length > 0
        ? locations.map((location, index) => (
            <div className="flex items-center" key={index}>
              <span className="text-xl  font-bold text-gray-500 dark:text-gray-400">
              {document.documentElement.lang == "ar" ? <RiArrowDropLeftFill  /> : <RiArrowDropRightFill />}
              </span>
              
              <Link
                to={location.url}
                className="text-md font-bold text-gray-500 hover:text-red-600 dark:text-gray-400 hover:dark:text-blue-600 duration-700 "
              >
                {location.name}
              </Link>
            </div>
          ))
        : null}
    </div>
  );
}
