import React, { useState, useEffect } from "react";

const SystemInfo = () => {
  const [info, setInfo] = useState({});

  useEffect(() => {
    const getHardwareConcurrency = () => navigator.hardwareConcurrency || "N/A";
    const getMemory = () =>
      navigator.deviceMemory ? `${navigator.deviceMemory} GB` : "N/A";
    const getUserAgent = () => navigator.userAgent || "N/A";
    const getPlatform = () => {
      const userAgent = navigator.userAgent || "";
      if (userAgent.includes("Android")) {
        return "Android 📱";
      }
      return navigator.platform || "N/A";
    };
    const getLanguage = () => navigator.language || "N/A";
    const getOnlineStatus = () =>
      navigator.onLine ? "Online 🌐" : "Offline ❌";
    const getScreenResolution = () =>
      `${window.screen.width} x ${window.screen.height} 🖥️`;
    const getZoomLevel = () => window.devicePixelRatio || "N/A";
    const getCookieEnabled = () =>
      navigator.cookieEnabled ? "Enabled ✅" : "Disabled ❌";
    const getDoNotTrack = () => navigator.doNotTrack || "N/A";
    const getPageLoadTime = () => performance.now() || "N/A";

    // Detecting device type
    const getDeviceType = () => {
      const userAgent = navigator.userAgent;
      if (/Mobi|Android|iPhone|iPad|iPod/i.test(userAgent)) {
        return "Mobile 📱";
      }
      return "Desktop 💻";
    };

    const getBrowserInfo = () => {
      const userAgent = navigator.userAgent;
      let browserName = "Unknown 🌐";
      let browserVersion = "Unknown 🔢";

      if (userAgent.includes("Chrome")) {
        browserName = "Chrome 🟢";
        browserVersion =
          userAgent.split("Chrome/")[1]?.split(" ")[0] || "Unknown";
      } else if (userAgent.includes("Firefox")) {
        browserName = "Firefox 🔥";
        browserVersion = userAgent.split("Firefox/")[1] || "Unknown";
      } else if (userAgent.includes("Safari")) {
        browserName = "Safari 🍏";
        browserVersion =
          userAgent.split("Version/")[1]?.split(" ")[0] || "Unknown";
      } else if (userAgent.includes("Edge")) {
        browserName = "Edge 🔵";
        browserVersion = userAgent.split("Edg/")[1] || "Unknown";
      }

      return { browserName, browserVersion };
    };

    const getWebGLRenderer = () => {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl");
      if (gl) {
        return gl.getParameter(gl.RENDERER) || "N/A";
      }
      return "N/A";
    };

    const getBatteryStatus = async () => {
      try {
        const battery = await navigator.getBattery();
        return (
          battery.level * 100 +
          "% (Charging: " +
          (battery.charging ? "Yes ⚡" : "No 🔋") +
          ")"
        );
      } catch (error) {
        return "N/A";
      }
    };

    const getPreferredLanguages = () => {
      return navigator.languages ? navigator.languages.join(", ") : "N/A";
    };

    const getOperatingSystem = () => {
      const userAgent = navigator.userAgent;
      if (userAgent.includes("Windows NT")) return "Windows 🖥️";
      if (userAgent.includes("Mac OS X")) return "MacOS 🍏";
      if (userAgent.includes("Linux")) return "Linux 🐧";
      if (userAgent.includes("Android")) return "Android 📱";
      if (userAgent.includes("iPhone") || userAgent.includes("iPad"))
        return "iOS 🍏";
      return "Unknown OS ❓";
    };

    // Fetching battery data asynchronously
    Promise.all([getBatteryStatus()])
      .then(([batteryStatus]) => {
        setInfo({
          userAgent: getUserAgent(),
          platform: getPlatform(),
          language: getLanguage(),
          onlineStatus: getOnlineStatus(),
          screenResolution: getScreenResolution(),
          zoomLevel: `${getZoomLevel()} 🧑‍💻`,
          cpuCores: `${getHardwareConcurrency()} ⚙️`,
          memory: `${getMemory()} 💾`,
          deviceType: getDeviceType(),
          browserInfo: getBrowserInfo(),
          webGLRenderer: `${getWebGLRenderer()} 🎮`,
          cookieEnabled: getCookieEnabled(),
          doNotTrack: `${getDoNotTrack()} 🚫`,
          pageLoadTime: `${getPageLoadTime()} ⏱️`,
          batteryStatus,
          preferredLanguages: getPreferredLanguages(),
          operatingSystem: getOperatingSystem(),
        });
      })
      .catch((error) => {
        setInfo({ error: error.message });
      });
  }, []);

  return (
    <div
      className="p-4 shadow-lg rounded-2xl bg-gray-800 text-white max-w-lg mx-auto mt-10"
      style={{ direction: "ltr" }}
    >
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">معلومات النظام والمتصفح</h2>
        <ul className="space-y-2">
          {Object.entries(info).map(([key, value]) => {
            if (key === "browserInfo") {
              return (
                <li key={key} className="border-b border-gray-700 pb-2">
                  <strong className="capitalize">
                    {key.replace(/([A-Z])/g, " $1")}:
                  </strong>
                  <div>
                    <strong>Browser Name:</strong> {value.browserName}
                    <br />
                    <strong>Browser Version:</strong> {value.browserVersion}
                  </div>
                </li>
              );
            }
            return (
              <li key={key} className="border-b border-gray-700 pb-2">
                <strong className="capitalize">
                  {key.replace(/([A-Z])/g, " $1")}:
                </strong>{" "}
                {value}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default SystemInfo;
