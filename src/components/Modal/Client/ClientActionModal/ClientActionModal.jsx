import React, { useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import "./ClientActionModal.scss";
export default function ClientActionModal({
  title,
  children,
  open = false,
  close,
  size = 2,
}) {
  const ref = useRef();
  const modalRef = useRef();

  const handleClick = (e) => {
    if (e.target === ref.current) {
      handleCloseodalAnimate();
    }
  };

  useEffect(() => {
    if (open) {
      if (modalRef && modalRef.current)
        modalRef.current.classList.add("modalOpen");
      ref.current.focus();
      document.body.classList.add("overflow-hidden");
      return () => {
        document.body.classList.remove("overflow-hidden");
      };
    }
  }, [open]);

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      handleCloseodalAnimate();
    }
  };

  const handleCloseodalAnimate = () => {
    ref.current.classList.add("!bg-opacity-0");
    // modalRef.current.classList.add("modalClose");
    // modalRef.current.classList.remove("modalOpen");

    // setTimeout(() => {
    close(false);
    // }, 300);
  };

  const getSize = () => {
    switch (size) {
      case "xxxSmall":
        return "w-full max-w-md";
      case "xxSmall":
        return "w-full max-w-lg";
      case "xSmall":
        return "w-full max-w-xl";
      case "small":
        return "w-full max-w-3xl";
      case "medium":
        return "w-full max-w-5xl";
      case "large":
        return "w-full max-w-7xl";
      default:
        return "w-full";
    }
  };

  return (
    <>
      <div
        id="default-modal"
        // onClick={handleClick}
        onKeyDown={handleKeyDown}
        ref={ref}
        tabIndex="-1"
        // aria-hidden="true"
        className="show-info-modal p-4 fixed top-0 right-0 bottom-0 left-0 z-40 backdrop-blur-sm bg-black/25"
      >
        <div
          ref={modalRef}
          className={`duration-700 relative w-full mx-auto ${getSize()}`}
        >
          <div
            className="relative h-full  rounded-lg shadow-md bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-gray-900 dark:via-gray-950 dark:to-black border border-gray-200 dark:border-white/10  grid grid-cols-1"
            style={{ gridTemplateRows: "min-content auto min-content" }}
          >
            <div className="flex items-center justify-between h-12 px-4 md:px-5 p-1 md:p-2 border-b rounded-t border-green-500/80">
              <h3 className="font-semibold text-gray-600 dark:text-white">
                {title}
              </h3>
              <button
                type="button"
                className="w-fit text-green-600/80 hover:bg-green-500/80 hover:bg-gray-800 hover:text-zinc-900  rounded-lg text-2xl p-1 ms-auto inline-flex md:justify-center items-center"
                onClick={handleCloseodalAnimate}
              >
                <IoClose />
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div
              className="body-modal flex flex-col gap-2 px-4 md:px-5 p-1  md:p-2 pb-2 space-y-4 overflow-auto"
              style={{ maxHeight: "80vh" }}
            >
              {children}
            </div>
            <div className="flex items-center justify-center h-12 px-4 md:px-5 p-1 md:p-2 border-t rounded-b  border-green-500/80">
              <button
                type="button"
                onClick={handleCloseodalAnimate}
                className="btn btn-danger w-20 !py-1 !px-4"
              >
                اغلاق
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
