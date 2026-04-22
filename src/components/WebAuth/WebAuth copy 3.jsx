import axios from "axios";
import { api_host } from "config/api_host";
import { useState } from "react";
import { useSelector } from "react-redux";

function WebAuth() {
  const { token } = useSelector((state) => state.auth);
  const [userKeys, setUserKeys] = useState(() => {
    const storedKeys = localStorage.getItem("webauthn_users");
    return storedKeys ? JSON.parse(storedKeys) : [];
  });

  function getDeviceInfo() {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform || "Unknown Device";
    let os = "Unknown OS";
    let browser = "Unknown Browser";

    if (userAgent.includes("Windows")) os = "Windows";
    else if (userAgent.includes("Mac")) os = "MacOS";
    else if (userAgent.includes("Linux")) os = "Linux";
    else if (/Android/.test(userAgent)) os = "Android";
    else if (/iPhone|iPad|iPod/.test(userAgent)) os = "iOS";

    if (userAgent.includes("Chrome")) browser = "Chrome";
    else if (userAgent.includes("Firefox")) browser = "Firefox";
    else if (userAgent.includes("Safari") && !userAgent.includes("Chrome"))
      browser = "Safari";
    else if (userAgent.includes("Edge")) browser = "Edge";

    return { os, browser, deviceName: platform };
  }

  async function register() {
    try {
      console.log("🔵 بدء التسجيل...");
      const email = "haidar.y.alsalama@gmail.com";
      const deviceInfo = getDeviceInfo();

      const data = await navigator.credentials.create({
        publicKey: {
          challenge: new Uint8Array([0, 1, 2, 3, 4, 5, 6]),
          rp: { name: "nemoo" },
          user: {
            id: new Uint8Array(16),
            name: email,
            displayName: "nemoo key",
          },
          pubKeyCredParams: [
            { type: "public-key", alg: -7 },
            { type: "public-key", alg: -8 },
            { type: "public-key", alg: -257 },
          ],
          authenticatorSelection: {
            residentKey: "preferred",
            userVerification: "preferred",
          },
        },
      });

      const newKey = {
        id: data.id,
        rawId: Array.from(new Uint8Array(data.rawId)),
        type: data.type,
        deviceName: deviceInfo.deviceName, // اسم الجهاز المستخرج تلقائيًا
        os: deviceInfo.os, // نظام التشغيل
        browser: deviceInfo.browser, // المتصفح
      };

      await registerKey({
        webauthn_id: JSON.stringify(newKey.rawId),
        device_name: 123,
      });

      const updatedKeys = [...userKeys, newKey];

      localStorage.setItem("webauthn_users", JSON.stringify(updatedKeys));
      setUserKeys(updatedKeys);
      console.log("✅ تم التسجيل بنجاح!", updatedKeys);
    } catch (error) {
      console.error("❌ فشل التسجيل:", error);
      alert("⚠️ فشل التسجيل! تحقق من وحدة التحكم.");
    }
  }

  async function registerKey(keyData) {
    const response = await fetch(`${api_host}webauthn/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(keyData),
    });

    // const result = await response.json();
    // console.log(result);
  }
  function bufferToBase64URL(buffer) {
    const uint8Array = new Uint8Array(buffer);
    const base64String = btoa(String.fromCharCode.apply(null, uint8Array));
    return base64String
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }

  async function login() {
    try {
      if (userKeys.length === 0) {
        alert("⚠️ لا يوجد أي مفتاح مسجل. الرجاء التسجيل أولًا.");
        return;
      }

      console.log("🔵 بدء تسجيل الدخول...");

      let d = bufferToBase64URL(userKeys[0].rawId);
      const data = await navigator.credentials.get({
        publicKey: {
          challenge: new Uint8Array([0, 1, 2, 3, 4, 5, 6]),
          allowCredentials: [
            {
              type: "public-key",
              id: new Uint8Array(userKeys[0].rawId).buffer,
            },
          ],
          userVerification: "preferred",
        },
      });
      alert(JSON.stringify(userKeys[0].rawId));
      await axios
        .post(
          `${api_host}webauthn/login`,
          {
            webauthn_id: JSON.stringify(userKeys[0].rawId),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          console.log("Response:", response.data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });

      console.log("✅ تسجيل الدخول ناجح!", data);
      alert("✅ تم تسجيل الدخول بنجاح!");
    } catch (error) {
      console.error("❌ فشل تسجيل الدخول:", error);
      alert("⚠️ فشل تسجيل الدخول! تحقق من وحدة التحكم.");
    }
  }

  function logout() {
    localStorage.removeItem("webauthn_users");
    setUserKeys([]);
    alert("✅ تم تسجيل الخروج!");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">
        تسجيل الدخول باستخدام WebAuthn
      </h1>
      {userKeys.length > 0 ? (
        <>
          <p className="text-lg">✅ الأجهزة المسجلة:</p>
          <ul className="mb-4">
            {userKeys.map((key, index) => (
              <li key={index} className="text-sm">
                🖥️ {key.deviceName} - {key.os} / {key.browser}
              </li>
            ))}
          </ul>
          <button
            onClick={login}
            className="mt-4 px-4 py-2 bg-blue-600 rounded"
          >
            🔑 تسجيل الدخول
          </button>
          <button
            onClick={logout}
            className="mt-2 px-4 py-2 bg-red-600 rounded"
          >
            🚪 تسجيل الخروج
          </button>
        </>
      ) : (
        <button onClick={register} className="px-4 py-2 bg-green-600 rounded">
          🆕 تسجيل جهاز جديد (Passkey)
        </button>
      )}
    </div>
  );
}

export default WebAuth;
