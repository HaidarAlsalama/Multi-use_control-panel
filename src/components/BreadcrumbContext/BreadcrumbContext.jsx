import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { RiArrowDropLeftFill, RiArrowDropRightFill } from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";
import sitemap from "./../../config/siteMap.json";
export default function BreadcrumbContext() {
  const {t} = useTranslation()
  const location = useLocation();
  const [locationLine, setLocationLine] = useState([]);

  useEffect(() => {
    setLocationLine(findMatchingObjects(location.pathname));
  }, [location]);

  return (
    <div className={" md:mb-2 flex gap-2"}>
      {locationLine.length > 0
        ? locationLine.map((item, index) => (
            <div className="flex items-center" key={index}>
              <span className="text-xl  font-bold text-gray-500 dark:text-gray-400">
                {document.documentElement.lang == "ar" ? (
                  <RiArrowDropLeftFill />
                ) : (
                  <RiArrowDropRightFill />
                )}
              </span>

              <Link
                to={item.url}
                className="text-md font-bold text-gray-500 hover:text-red-600 dark:text-gray-400 hover:dark:text-blue-600 duration-700 "
              >
                {t(item.title)}
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
