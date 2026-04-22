import { createAlert } from "components/Alert/Alert";
import { useState } from "react";
import { FcFlashOn, FcLock, FcUnlock } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { authnDelete, authnReg } from "store/reducers/authReducer";

function generateChallenge() {
  const challenge = new Uint8Array(32); // 32 بايت من البيانات العشوائية
  window.crypto.getRandomValues(challenge);
  return challenge;
}

function getDeviceInfo() {
  const userAgent = navigator.userAgent;
  const platform = navigator.platform || "Unknown Device";
  let os = "Unknown OS";
  let browser = "Unknown Browser";

  // ✅ تصحيح تحديد نظام التشغيل
  if (/Windows NT/.test(userAgent)) os = "Windows";
  else if (/Mac OS X/.test(userAgent)) os = "MacOS";
  else if (/Android/.test(userAgent)) os = "Android";
  else if (/iPhone|iPad|iPod/.test(userAgent)) os = "iOS";
  else if (/Linux/.test(userAgent) && !/Android/.test(userAgent)) os = "Linux";

  // ✅ تصحيح تحديد المتصفح
  if (/Chrome\/\d+/.test(userAgent) && !/Edg/.test(userAgent))
    browser = "Chrome";
  else if (/Edg\/\d+/.test(userAgent)) browser = "Edge";
  else if (/Firefox\/\d+/.test(userAgent)) browser = "Firefox";
  else if (/Safari\/\d+/.test(userAgent) && !/Chrome/.test(userAgent))
    browser = "Safari";

  return { os, browser, deviceName: platform };
}

export default function EnhanceSecurity() {
  const { email, stateoops, rawId, deviceName, os, browser } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const [userKeys, setUserKeys] = useState(() => {
    const storedKey = localStorage.getItem("webauthn_users");
    return storedKey ? JSON.parse(storedKey) : null;
  });

  async function register() {
    try {
      console.log("🔵 بدء التسجيل...");
      const deviceInfo = getDeviceInfo();

      // إنشاء معرف فريد للمستخدم باستخدام البريد الإلكتروني
      const userId = new TextEncoder().encode(email);

      const data = await navigator.credentials.create({
        publicKey: {
          challenge: generateChallenge(),
          rp: { name: "Smart phone" },
          user: {
            id: userId,
            name: email,
            displayName: "smart phone key",
          },
          pubKeyCredParams: [
            { type: "public-key", alg: -7 }, // ES256 (Elliptic Curve P-256)
            { type: "public-key", alg: -257 }, // RS256 (RSA 2048-bit)
            { type: "public-key", alg: -8 }, // Ed25519 (EdDSA)
            { type: "public-key", alg: -35 }, // RS384 (RSA 3072-bit)
            { type: "public-key", alg: -36 }, // RS512 (RSA 4096-bit)
            { type: "public-key", alg: -37 }, // PS256 (RSA PSS 2048-bit)
            { type: "public-key", alg: -38 }, // PS384 (RSA PSS 3072-bit)
            { type: "public-key", alg: -39 }, // PS512 (RSA PSS 4096-bit)
            { type: "public-key", alg: -257 }, // RS256 (RSA)
            { type: "public-key", alg: -259 }, // ES384 (Elliptic Curve P-384)
          ],
          authenticatorSelection: {
            residentKey: "preferred",
            userVerification: "required",
            authenticatorAttachment: "platform", // 🔹 يفرض استخدام المصادقة عبر الجهاز (Face ID، Windows Hello...)
          },
        },
      });

      dispatch(
        authnReg({
          id: data.id,
          rawId: Array.from(new Uint8Array(data.rawId)),
          type: data.type,
          deviceName: deviceInfo.deviceName,
          os: deviceInfo.os,
          browser: deviceInfo.browser,
        })
      );

      createAlert("Success", "✅ تم التسجيل بنجاح!");
    } catch (error) {
      console.error("❌ فشل التسجيل:", error);
      createAlert("Error", "⚠️ فشل التسجيل! تحقق من وحدة التحكم.");
    }
  }

  async function login() {
    try {
      if (!stateoops) {
        createAlert("Error", "⚠️ لا يوجد جهاز مسجل لهذا الحساب.");
        return;
      }

      console.log("🔵 بدء تسجيل الدخول...");

      const data = await navigator.credentials.get({
        publicKey: {
          challenge: generateChallenge(),
          allowCredentials: [
            {
              type: "public-key",
              id: new Uint8Array(rawId).buffer,
              transports: ["internal"], // 🔹 يجبر المصادقة عبر الجهاز (مثل Face ID, Windows Hello)
            },
          ],
          userVerification: "required",
        },
      });

      createAlert("Success", "✅ تم تسجيل الدخول بنجاح!");
    } catch (error) {
      console.error("❌ فشل تسجيل الدخول:", error);
      createAlert("Error", "⚠️ فشل تسجيل الدخول! تحقق من وحدة التحكم.");
    }
  }

  function logout() {
    dispatch(authnDelete());
    createAlert("Success", "تم ازالة تعزيز الأمان.");
  }

  return (
    <div className="flex gap-6 w-full flex-wrap justify-center md:justify-start h-fit">
      {!stateoops ? (
        <div
          onClick={register} // تحقق من وجود fun قبل استدعائها
          className="
                  group relative flex flex-col overflow-hidden items-start w-80 h-28 p-6 pt-4  bg-white border border-gray-200 
                  rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700
                  hover:bg-gray-100 cursor-pointer select-none"
        >
          <h5 className="mb-1 text-xl font-semibold text-gray-600 dark:text-white group-hover:text-white_">
            تفعيل معزز الامان
          </h5>
          <p className="text-sm font-semibold max-w-52 text-gray-500 dark:text-gray-400  group-hover:text-white_">
            انقر لبدأ اختبار ان هذا الجهاز يدعم هذه الميزة وتفعيلها
          </p>
          <FcLock className="group-hover:scale-125 absolute rtl:left-4 ltr:right-4 bottom-4  text-7xl  text-gray-400 dark:text-gray-500 duration-700  group-hover:text-white" />
        </div>
      ) : (
        <>
          <div
            onClick={login} // تحقق من وجود fun قبل استدعائها
            className="
                  group relative flex flex-col overflow-hidden items-start w-80 h-28 p-6 pt-4  bg-white border border-gray-200 
                  rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700
                  hover:bg-gray-100 cursor-pointer select-none"
          >
            <h5 className="mb-1 text-xl font-semibold text-gray-600 dark:text-white group-hover:text-white_">
              اختبار معزز الامان
            </h5>
            <p className="text-sm font-semibold max-w-52 text-gray-500 dark:text-gray-400  group-hover:text-white_">
              انقر لاختبار هذه الخدمة
            </p>
            <FcFlashOn className="group-hover:scale-125 absolute rtl:left-4 ltr:right-4 bottom-4  text-7xl  text-gray-400 dark:text-gray-500 duration-700  group-hover:text-white" />
          </div>
          <div
            onClick={logout} // تحقق من وجود fun قبل استدعائها
            className="
                  group relative flex flex-col overflow-hidden items-start w-80 h-28 p-6 pt-4  bg-white border border-gray-200 
                  rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700
                  hover:bg-gray-100 cursor-pointer"
          >
            <h5 className="mb-1 text-xl font-semibold text-gray-600 dark:text-white group-hover:text-white_">
              تعطيل معزز الامان
            </h5>
            <p className="text-sm font-semibold max-w-52 text-gray-500 dark:text-gray-400  group-hover:text-white_">
              انقر لتعطيل هذه الخدمة
            </p>
            <FcUnlock className="group-hover:scale-125 absolute rtl:left-4 ltr:right-4 bottom-4  text-7xl  text-gray-400 dark:text-gray-500 duration-700  group-hover:text-white" />
          </div>
        </>
      )}
    </div>
  );

  // return (
  //   <>
  //     {stateoops ? (
  //       <>
  //         <p className="text-lg">✅ الجهاز المسجل:</p>
  //         <ul className="mb-4">
  //           <li className="text-sm">
  //             🖥️ {deviceName} - {os} / {browser}
  //           </li>
  //         </ul>
  //         <button
  //           onClick={login}
  //           className="mt-4 px-4 py-2 bg-blue-600 rounded"
  //         >
  //           🔑 تسجيل الدخول
  //         </button>
  //         <button
  //           onClick={logout}
  //           className="mt-2 px-4 py-2 bg-red-600 rounded"
  //         >
  //           🚪 تسجيل الخروج
  //         </button>
  //       </>
  //     ) : (
  //       <button onClick={register} className="px-4 py-2 bg-green-600 rounded">
  //         🆕 تسجيل جهاز جديد (Passkey)
  //       </button>
  //     )}
  //   </>
  // );
}
