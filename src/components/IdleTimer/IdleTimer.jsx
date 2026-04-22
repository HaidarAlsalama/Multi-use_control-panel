import React, { useState, useEffect } from "react";

const IdleTimer = () => {
  const [isIdle, setIsIdle] = useState(false);
  const [idleTime, setIdleTime] = useState(0); // لاحتساب وقت الخمول

  useEffect(() => {
    const resetIdleTimer = () => {
      setIdleTime(0);
      setIsIdle(false); // إعادة تعيين حالة الخمول
    };

    const handleActivity = () => {
      resetIdleTimer();
    };

    const idleInterval = setInterval(() => {
      setIdleTime((prevTime) => prevTime + 1); // زيادة الوقت عند الخمول
    }, 1000); // كل ثانية

    const inactivityTimeout = setTimeout(() => {
      setIsIdle(true); // تعيين الحالة إلى خمول بعد فترة معينة
    }, 5000); // إذا لم يحدث أي تفاعل لمدة 5 ثوانٍ

    // إضافة مستمعين لأحداث التفاعل
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);

    // تنظيف الأحداث عند التفكيك
    return () => {
      clearInterval(idleInterval);
      clearTimeout(inactivityTimeout);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
    };
  }, []);

  return (
    <div>
      <p>{isIdle ? "You are idle" : `Time idle: ${idleTime} seconds`}</p>
    </div>
  );
};

export default IdleTimer;
