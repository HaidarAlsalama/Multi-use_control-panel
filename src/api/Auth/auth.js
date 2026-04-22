import { useMutation, useQuery } from "@tanstack/react-query";
import { createAlert } from "components/Alert/Alert";
import { useAxiosWithAuth } from "Hooks/useAxiosWithAuth";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { login } from "store/reducers/authReducer";

export const useLogin = () => {
  const api = useAxiosWithAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginProcess = async (user) => {
    const { data } = await api.post("auth/login-admin", user);
    // const { data } = await api.post("auth/login-admin", user);
    return data;
  };

  return useMutation({
    mutationFn: loginProcess,
    onSuccess: ({ data, type, message }) => {
      if (data.role_name == "admin") {
        createAlert(type, message);
        navigate("/dashboard");
        dispatch(login(data));
      }
    },
  });
};
export const useLoginCustomer = () => {
  const api = useAxiosWithAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginProcess = async (user) => {
    const { data } = await api.post("auth/login", user);
    // const { data } = await api.post("auth/login-admin", user);
    return data;
  };

  return useMutation({
    mutationFn: loginProcess,
    onSuccess: ({ data, type, message }) => {

      if (data.role_name == "customer") {
        createAlert(type, message);
        navigate("/my-account");
        dispatch(login(data));
      }
    },
  });
};

export const useForgotMyPassword = () => {
  const api = useAxiosWithAuth();

  const forgotPass = async (user) => {
    const { data } = await api.post("auth/forget-password", user);
    return data;
  };

  return useMutation({
    mutationFn: forgotPass,
    onSuccess: ({ type, message }) => {
      createAlert(type, message);

    },
  });
};

export const useCheckOtp = () => {
  const api = useAxiosWithAuth();

  const checkOtp = async (user) => {
    const { data } = await api.post("auth/verify-otp", user);
    return data;
  };

  return useMutation({
    mutationFn: checkOtp,
    onSuccess: ({ type, message }) => {
      createAlert(type, message);

    },
  });
};

export const useNewPass = () => {
  const api = useAxiosWithAuth();
  const navigate = useNavigate();

  const newPass = async (user) => {
    const { data } = await api.post("auth/rest-password", user);
    return data;
  };

  return useMutation({
    mutationFn: newPass,
    onSuccess: ({ type, message }) => {
      createAlert(type, message);
      navigate('/login')
    },
  });
};

export const useRegister = () => {
  const api = useAxiosWithAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const registerProcess = async (user) => {
    const { data } = await api.post("auth/register", user);
    return data;
  };

  return useMutation({
    mutationFn: registerProcess,
    onSuccess: ({ data, type, message }) => {
      createAlert(type, message);
      if (data.role_name == "admin")
        navigate("/dashboard");
      if (data.role_name == "customer")
        navigate("/my-account");
      dispatch(login(data));
    },
  });
};

export const useEditPass = () => {
  const api = useAxiosWithAuth();

  const editPass = async (user) => {
    const { data } = await api.post("edit-password", user);
    return data;
  };

  return useMutation({
    mutationFn: editPass,
    onSuccess: ({ type, message }) => {
      createAlert(type, message);
    },
  });
};

export const useCheckPIN = () => {
  const api = useAxiosWithAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/"; // fallback
  const checkOtp = async (formData) => {
    const { data } = await api.post("auth/verify-pin", formData);
    return data;
  };

  return useMutation({
    mutationFn: checkOtp,
    onSuccess: ({ type, message }) => {
      createAlert(type, message);

      let redirectPath = from;

      // إذا كان جاي من صفحة التحقق نفسها
      if (redirectPath.includes("/verify-pin")) {
        redirectPath = redirectPath.replace("/verify-pin", "");
      }

      setTimeout(() => navigate(redirectPath, { replace: true }), 700);
    },
  });
};

export const useEditPIN = () => {
  const api = useAxiosWithAuth();

  const editPass = async (formData) => {
    const { data } = await api.post("auth/change-pin", formData);
    return data;
  };

  return useMutation({
    mutationFn: editPass,
    onSuccess: ({ type, message }) => {
      createAlert(type, message);
    },
  });
};

export const useHelloMyServer = () => {
  const api = useAxiosWithAuth();

  const getData = async () => {
    const { data } = await api.get(`user/hello-my-server`);
    return data;
  };

  return useQuery({
    queryKey: ["helloMyServer"],
    queryFn: getData,
    retry: false,
  });
};

export const useLogout = () => {
  const api = useAxiosWithAuth();

  const getData = async () => {
    const { data } = await api.get('auth/logout');
    return data;
  };

  return useQuery({
    refetchOnWindowFocus: false,
    queryKey: ['logout'],
    queryFn: getData,
    enabled: true,
    retry: false,
  });
};