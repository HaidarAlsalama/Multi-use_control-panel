import { useMemo } from "react";
import { RiArrowDropLeftFill, RiArrowDropRightFill } from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";
import sitemap from "config/siteMap.json";

export default function BreadcrumbContext() {
  const location = useLocation();

  const locationLine = useMemo(
    () => findMatchingObjects(location.pathname),
    [location.pathname]
  );
  return (
    <div className={"flex gap-2 flex-wrap p-2 py-2 rounded-2xl"}>
      {locationLine.length > 0
        ? locationLine.map((item, index) => (
            <div className="flex items-center" key={index}>
              <span className="text-xl font-bold dark:text-white text-gray-500">
                {document.documentElement.lang == "ar" ? (
                  <RiArrowDropLeftFill />
                ) : (
                  <RiArrowDropRightFill />
                )}
              </span>

              <Link
                to={item.url}
                className="text-sm font-bold text-nowrap dark:text-white hover:text-red-600 text-gray-500 hover:dark:text-blue-600 duration-700 "
              >
                {item.title}
              </Link>
            </div>
          ))
        : null}
    </div>
  );
}

function removeParts(textUrl) {
  const resultArray = [];
  resultArray.push(textUrl);
  let remainingText = textUrl;
  while (remainingText.includes("/")) {
    const index = remainingText.lastIndexOf("/");
    remainingText = remainingText.substring(0, index);
    resultArray.push(remainingText);
  }
  return resultArray.reverse();
}

function findMatchingObjects(mainLocation) {
  let afterRemoveParts = removeParts(mainLocation);
  const resultArray = [];
  for (let part of afterRemoveParts) {
    sitemap.forEach((obj) => {
      if (obj.url == part) {
        resultArray.push(obj);
      }
    });
  }

  return resultArray;
}
