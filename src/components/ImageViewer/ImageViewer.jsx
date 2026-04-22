import { useDeleteImage } from "api/admin/global";
import { Spinner } from "components";
import { image_host } from "config/api_host";
import React from "react";
import { RiDeleteBin3Line } from "react-icons/ri";

export default function ImageViewer({ id, imagePath, type }) {
  const {
    mutate: deleteImage,
    isPending: deleteImageIsPending,
    isSuccess: deleteImageIsSuccess,
  } = useDeleteImage();

  const openImageInPopup = (url, title, width = 600, height = 400) => {
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    const newWindow = window.open(
      "",
      title,
      `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
    );

    if (newWindow) {
      // كتابة HTML مخصص داخل النافذة المنبثقة
      newWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
        </head>
        <body style="margin: 0; padding: 0;">
          <img src="${url}" style="width: 100%; height: 100%; object-fit: contain;" />
        </body>
      </html>
    `);
      newWindow.document.close(); // إغلاق المستند لضمان ظهور المحتوى
    }
  };

  const handleDeleteImage = () => {
    deleteImage({
      id,
      type,
    });
  };

  return (
    <div className="relative w-full flex flex-col justify-center p-4 gap-4 items-center border-t-2 border-b-2 ">
      {/* الصورة مع إخفائها حتى يتم تحميلها */}
      <div
        className="btn btn-danger w-40 h-8 !p-1.5 cursor-pointer"
        onClick={handleDeleteImage}
        title="حذف"
      >
        {deleteImageIsPending ? (
          <Spinner xs />
        ) : (
          <>
            <RiDeleteBin3Line /> حذف الصورة القديمة
          </>
        )}
      </div>{" "}
      <img
        src={`${image_host}${imagePath}`}
        alt=""
        className={`w-full max-w-[455px] h-full max-h-[256px] mx-auto rounded-lg cursor-pointer`}
        onClick={() =>
          openImageInPopup(
            `${image_host}${imagePath}`,
            `الصورة`,
            800, // العرض
            600 // الارتفاع
          )
        }
      />
    </div>
  );
}
