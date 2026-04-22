import { useNavigate } from "react-router-dom";

// Custom Hook لتفعيل الانتقال بين الصفحات باستخدام View Transition API
const useViewTransitionNavigate = () => {
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        // التحقق مما إذا كان View Transition مدعوم
        if (document.startViewTransition) {
            const transition = document.startViewTransition(() => {
                navigate(path);
            });
        } else {
            // في حال لم يكن View Transition مدعوم، نستخدم navigate مباشرة
            navigate(path);
        }
    };

    return handleNavigate;
};

export default useViewTransitionNavigate;
