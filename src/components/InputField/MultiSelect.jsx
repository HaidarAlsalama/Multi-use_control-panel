import { Spinner } from "components";
import React, { useState, useEffect, useRef } from "react";

export default function MultiSelect({
  apiResponse: apiResp,
  title,
  name,
  reset,
  errors,
  loadingFetch,
  successFetch,
  className,
  currentValue = [],
}) {
  const [apiResponse, setApiResponse] = useState(apiResp);
  const [selectedIds, setSelectedIds] = useState(currentValue);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    console.log(filteredUsers);
  }, [filteredUsers]);

  useEffect(() => {
    reset((prev) => {
      return { ...prev, [name]: selectedIds };
    });
  }, [selectedIds]);

  useEffect(() => {
    if (successFetch) {
      if (searchTerm === "") {
        setFilteredUsers(
          apiResponse.filter((item) => !selectedIds.includes(item.id))
        );
      } else {
        const filtered = apiResponse.filter(
          (item) =>
            item?.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !selectedIds.includes(item.id) // استبعاد المستخدمين المختارين
        );
        setFilteredUsers(filtered);
      }
    }
  }, [searchTerm, apiResponse, selectedIds]);

  const handleSelectUser = (user) => {
    if (!selectedIds.includes(user.id)) {
      setSelectedIds([...selectedIds, user.id]);
    }
  };

  const handleRemoveUser = (id) => {
    setSelectedIds(selectedIds.filter((userId) => userId !== id));

    const index = apiResponse.findIndex((temp) => temp.id === id);
    if (index !== -1) {
      setApiResponse((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], hidden: false };
        return updated;
      });
    }
  };

  const handleFocus = () => {
    setDropdownOpen(true);
  };

  const handleClickOutside = (event) => {
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loadingFetch) return <Spinner />;

  return (
    <div className={`relative w-full min-h-44 ${className}`} ref={inputRef}>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
        {title}
      </label>
      <div
        className="border mt-1 border-gray-300 rounded-lg p-2 bg-white dark:bg-gray-800 dark:border-gray-600 focus:border-blue-500
            dark:focus:border-blue-500 focus:outline-none"
      >
        <div className="flex flex-wrap gap-2">
          {selectedIds.map((id) => {
            const user = apiResponse.find((item) => item.id === id);
            return (
              <div
                key={id}
                className="flex items-center bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded-lg dark:bg-gray-600 dark:text-gray-100"
              >
                {user?.name}
                <button
                  onClick={() => handleRemoveUser(id)}
                  className="mr-2 text-blue-600 dark:text-gray-100 hover:text-blue-900"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={handleFocus}
          className="w-full p-2 mt-2 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500  dark:bg-gray-600 dark:placeholder-gray-400 dark:text-white
          dark:border-gray-600 focus:border-blue-500
            dark:focus:border-blue-500 focus:outline-none"
        />
      </div>
      {errors[name] && (
        <p className="text-xs text-center text-red-500 dark:text-red-600 mt-0.5">
          {errors[name].message}
        </p>
      )}
      {dropdownOpen && (
        <ul className="absolute_ z-[99] w-full bg-white border border-gray-300 rounded-lg shadow-md max-h-20 overflow-y-auto dark:bg-gray-700  dark:border-gray-600 dark:text-white">
          {filteredUsers.length > 0 ? (
            filteredUsers.map(
              (item) =>
                item.hidden === false && (
                  <li
                    key={item.id}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                    onClick={() => handleSelectUser(item)}
                  >
                    {item?.name}
                  </li>
                )
            )
          ) : (
            <li className="p-2 text-gray-500 dark:text-gray-400">
              No results found
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
