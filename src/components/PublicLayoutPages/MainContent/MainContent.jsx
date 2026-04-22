import React from "react";
import "./MainContent.css";
export default function MainContent({ children }) {
  return (
    <section
      className={`relative grid grid-cols-1 min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-gray-900 dark:via-gray-950 dark:to-black main-content gap-4_`}
    >
      <div
        className="fixed inset-0_ top-0 bottom-0 left-0 right-0 opacity-[0.07] dark:opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2300C853' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E\")",
        }}
      ></div>
      {children}
    </section>
  );
}
