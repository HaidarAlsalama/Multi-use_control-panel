import { useEffect } from 'react'
import { useSelector } from 'react-redux';
// دالة تحويل مفتاح VAPID إلى Uint8Array
const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/\_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
};

export default function PushNotifications() {

    const { email, phone } = useSelector(state => state.auth)

    useEffect(() => {
        // طلب إذن الإشعارات
        const requestNotificationPermission = async () => {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                console.log('إذن الإشعارات تم منحه');
            } else {
                console.log('إذن الإشعارات تم رفضه');
            }
        };

        requestNotificationPermission();
    }, []);

    useEffect(() => {
        if ('serviceWorker' in navigator && 'PushManager' in window && phone) {
            navigator.serviceWorker.ready.then((registration) => {
                registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array('BLM1wxPZvKgMyEuxtmSJl4vHbIxOGmU1eKoFNfBam5MAqLUF5mZXwh0jcrp1JI1u7o0COvchGlUKYTFohxU6Wyg'),
                }).then((subscription) => {
                    // إرسال الاشتراك إلى الخادم
                    fetch('http://127.0.0.1:3003/push-notifications/register-subscribe', {
                        method: 'POST',
                        body: JSON.stringify({ userId: phone, subscription }),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                });
            });
        }
    }, [email]);

    return null
}
