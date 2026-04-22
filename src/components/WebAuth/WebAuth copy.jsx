import { useEffect, useState } from "react";
import {
  startAuthentication,
  startRegistration,
} from "@simplewebauthn/browser";

function WebAuth() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("webauthn_user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("webauthn_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("webauthn_user");
    }
  }, [user]);

  // تحويل Uint8Array إلى base64url string
  function bufferToBase64URL(buffer) {
    const uint8Array = new Uint8Array(buffer);
    const base64String = btoa(String.fromCharCode.apply(null, uint8Array));
    return base64String
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }

  async function register() {
    try {
      console.log("🔵 بدء التسجيل...");

      // إنشاء challenge عشوائي
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      // تحويل challenge إلى base64url string
      const challengeBase64Url = bufferToBase64URL(challenge);

      // إنشاء معرف مستخدم فريد
      const userId = new Uint8Array(16);
      window.crypto.getRandomValues(userId);

      const options = {
        publicKey: {
          challenge: challengeBase64Url,
          rp: { name: "lsl" },
          user: {
            id: bufferToBase64URL(userId),
            name: "user@example.com",
            displayName: "User",
          },
          pubKeyCredParams: [
            { type: "public-key", alg: -7 },
            { type: "public-key", alg: -257 },
          ],
          authenticatorSelection: {
            residentKey: "preferred",
            userVerification: "preferred",
          },
          timeout: 60000,
        },
      };

      console.log("📜 خيارات التسجيل:", options);

      // بدء التسجيل
      const registration = await startRegistration(options.publicKey);

      console.log("✅ تسجيل ناجح!", registration);

      // حفظ بيانات المستخدم في localStorage
      setUser({
        email: "user@example.com",
        credential: {
          id: registration.id,
          rawId: Array.from(new Uint8Array(registration.rawId)), // حفظ rawId كـ Array
          type: registration.type,
        },
      });

      alert("✅ تم إنشاء المفتاح بنجاح!");
    } catch (error) {
      console.error("❌ فشل التسجيل:", error);
      alert("⚠️ فشل التسجيل! تحقق من وحدة التحكم (Console) لرؤية التفاصيل.");
    }
  }

  async function login() {
    if (!user) {
      alert("⚠️ لم يتم العثور على بيانات تسجيل، الرجاء التسجيل أولًا.");
      return;
    }

    // تحقق إذا كان المتصفح يدعم WebAuthn
    if (!window.PublicKeyCredential) {
      alert("⚠️ المتصفح لا يدعم WebAuthn.");
      return;
    }

    try {
      console.log("🔵 بدء تسجيل الدخول...");

      // إنشاء challenge جديد
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      // تحويل challenge إلى base64url
      const challengeBase64Url = bufferToBase64URL(challenge);

      // تحويل rawId إلى base64url string
      const rawIdBase64Url = bufferToBase64URL(user.credential.rawId);

      // إعداد الخيارات الخاصة بتسجيل الدخول
      const options = {
        publicKey: {
          challenge: challengeBase64Url, // التحدي هنا سيكون base64url
          rp: { name: "lsl" },
          allowCredentials: [
            {
              type: "public-key",
              id: rawIdBase64Url, // استخدام rawIdBase64Url بدلاً من ArrayBuffer
            },
          ],
          userVerification: "preferred", // يفضل التحقق من المستخدم
          timeout: 60000, // مهلة 60 ثانية للمصادقة
        },
      };

      console.log("📜 خيارات تسجيل الدخول:", options);

      // بدء المصادقة
      const assertion = await startAuthentication(options.publicKey);

      console.log("✅ المصادقة ناجحة:", assertion);

      // تحقق من المصادقة باستخدام assertion
      if (assertion && assertion.authenticatorData) {
        alert(`✅ مرحبًا بك ${user.email}! تم تسجيل الدخول بنجاح.`);
      } else {
        alert("⚠️ فشل المصادقة.");
      }
    } catch (error) {
      console.error("❌ فشل تسجيل الدخول:", error);
      alert(
        "⚠️ فشل تسجيل الدخول! تحقق من وحدة التحكم (Console) لرؤية التفاصيل."
      );
    }
  }

  function logout() {
    setUser(null);
    alert("✅ تم تسجيل الخروج!");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">
        تسجيل الدخول باستخدام WebAuthn
      </h1>

      {user ? (
        <>
          <p className="text-lg">✅ مسجل كمستخدم: {user.email}</p>
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
          🆕 إنشاء حساب (Passkey)
        </button>
      )}
    </div>
  );
}

export default WebAuth;
