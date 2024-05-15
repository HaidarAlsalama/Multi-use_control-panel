import React, { useState } from "react";

const NotificationComponent = () => {
  const [message, setMessage] = useState("");

  const handleNotificationClick = () => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
      new Notification("Hello, world!");
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function (permission) {
        if (permission === "granted") {
          new Notification("Hello, world!");
        }
      });
    }
  };

  return (
    <div>
      <button onClick={handleNotificationClick}>Send Notification</button>
      <p>{message}</p>
    </div>
  );
};

export default NotificationComponent;
