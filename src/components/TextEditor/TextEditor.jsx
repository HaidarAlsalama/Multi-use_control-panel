import React, { useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./TextEditor.scss";
const module = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { header: [3, 4, 5, 6, false] }],
    [{ size: ["small", false, "large"] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ direction: "rtl" }], // أزرار لتغيير
    ["link", "image", "video"],
    ["blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML content
    matchVisual: false,
  },
};

export default function TextEditor({ title = "", content, setContent }) {
  return (
    <div className="rounded-md overflow-hidden">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
        {title}
      </span>
      <ReactQuill
        theme="snow"
        value={content}
        onChange={setContent}
        modules={module}
        style={{ direction: "ltr", height: "150px" }} // هنا ضبط الارتفاع مباشرة
      />
    </div>
  );
}
