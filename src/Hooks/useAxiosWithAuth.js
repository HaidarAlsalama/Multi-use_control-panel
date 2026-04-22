import { useSelector } from "react-redux"; // Importing useSelector correctly
import axios from "axios";
import { createAlert } from "components/Alert/Alert";
import { api_host } from "config/api_host";
import { useLocation, useNavigate } from "react-router-dom";

// Custom hook to get token from Redux state
export const useAxiosWithAuth = (host = null) => {
  const { token, role } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  // Creating a custom Axios instance
  const api = axios.create({
    baseURL: `${host ? host : api_host}`, // Set your API base URL here
    headers: {
      // "Content-Type": "application/json", // Example of content type
      Authorization: `Bearer ${token}`, // Adding the access token if available
    },
    withCredentials: true,
  });

  // Setting up an error handler for common response statuses
  api.interceptors.response.use(
    (response) => response, // Returning response if successful
    (error) => {
      if (error.response) {
        // Handling common errors based on response status
        switch (error.response.status) {
          case 400:
            if (error.response.data.type) {
              createAlert(
                error.response.data.type,
                error.response.data.message
              );
            }
            console.error("Invalid request: Check your inputs.");
            break;
          case 401:
            navigate('/logout')

            // createAlert(
            //   "Warning",
            //   "يرجى اعادة تسجيل الدخول."
            // );
            // console.error("Unauthorized: Please ensure you're logged in.");
            break;
          case 403:
            navigate("/my-account/verify-pin", {
              replace: true,
              state: {
                from: location.pathname,
              },
            });
            break;
          case 404:
            if (error.response.data.type) {
              createAlert(
                error.response.data.type,
                error.response.data.message
              );
            }
            console.error("No data found", 404);
            break;
          case 429:
            if (error.response.data.type) {
              createAlert(
                error.response.data.type,
                error.response.data.message
              );
            }
            console.warn("too many requests", 429);
            break;
          case 503:
            if (role == 'customer')
              navigate('/my-account/under-maintenance')
            console.warn("Service Unavailable", 503);
            break;
          case 422:
            Object.values(error.response.data.errors || {}).forEach((errorMessages) => {
              errorMessages.forEach((errorMessage) => {
                createAlert("Warning", errorMessage);
              });
            });
            break;
          default: {
            console.error(error.response.status);
          }
        }
      } else {
        createAlert(
          "Warning",
          "لا يمكن الاتصال بالمخدم. يرجى التأكد من توفر الانترنت."
        );
        console.error(
          "لا يمكن الاتصال بالمخدم. يرجى التأكد من توفر الانترنت."
        );
      }

      // Pass the error to queries or functions that may need to handle it
      return Promise.reject(error);
    }
  );

  return api;
};
