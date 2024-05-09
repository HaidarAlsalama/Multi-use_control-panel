import React, { useEffect, useState } from "react";
import BarChart from "../../components/Charts/BarChart";
import LineChart from "../../components/Charts/LineChart";
import NotificationComponent from "../../components/NotificationComponent/NotificationComponent";
// import LineChart from "../../components/Charts/LineChart";
import io from "socket.io-client";
const socket = io("http://localhost:5000/"); // تغيير الرابط حسب عنوان الخادم

export default function Dashboard() {
  const [postData, setPostData] = useState(null);

  useEffect(() => {
    socket.emit("userId", localStorage.getItem("userId"));
    // Listen for 'post' event from the server
    socket.on("post", (data) => {
      // Update the state with the received data
      setPostData(data);
    });

    // Listen for 'error' event from the server
    socket.on("error", (error) => {
      console.error("An error occurred:", error); // طباعة الخطأ في الكونسول
    });

    return () => {
      socket.off("post");
      socket.off("error");
    };
  }, []);
  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 w-full gap-3 h-fit">
        {/* <div>
          <h1>Real-time React App</h1>
          {postData && (
            <div>
              <p>New POST request received!</p>
              <p>Data: {JSON.stringify(postData)}</p>
            </div>
          )}
        </div> */}
        <LineChart />
        <BarChart />
      </div>
    </>
  );
}
