import { createSlice } from "@reduxjs/toolkit";
import { decryptData, encryptData } from "../../config/lib";

// Helper function to get user info from session storage
const getUserInfoFromLocal = () => {

  const userInfo = localStorage.getItem("userInfo");
  if (userInfo) {
    return JSON.parse(decryptData(userInfo));
  }
  // return { role: "customer", token: null, permissions: [] };
  return {
    role: "guest", token: null, permissions: []
  };
};

export const authSlice = createSlice({
  name: "auth",
  initialState: getUserInfoFromLocal(),
  reducers: {
    login: (state, action) => {
      const userAuthInfo = {
        role: action.payload.role_name,
        roles: action.payload.role,
        token: action.payload.token,
        name: action.payload.name,
        id: action.payload.id,
        email: action.payload.email,
        phone: action.payload.phone,
        permissions: action.payload.permissions?.map(p => p.name) || [],
        stateoops: false
      };

      // Update session storage
      localStorage.setItem("userInfo", encryptData(JSON.stringify(userAuthInfo)));

      // Return the new state
      return userAuthInfo;
    },

    authnReg: (state, action) => {

      const temp = {
        stateoops: true, // إضافة هذا الحقل دائمًا
        authnId: action.payload.id,
        rawId: action.payload.rawId,
        type: action.payload.type,
        deviceName: action.payload.deviceName,
        os: action.payload.os,
        browser: action.payload.browser,
      }
      localStorage.setItem("userInfo", encryptData(JSON.stringify({ ...state, ...temp })));
      return {
        ...state, // الاحتفاظ بالحالة الحالية
        ...temp
      };
    },

    authnDelete: (state, action) => {

      const temp = {
        stateoops: false, // إضافة هذا الحقل دائمًا
        authnId: null,
        rawId: null,
        type: null,
        deviceName: null,
        os: null,
        browser: null,
      }
      localStorage.setItem("userInfo", encryptData(JSON.stringify({ ...state, ...temp })));


      return {
        ...state, // الاحتفاظ بالحالة الحالية
        ...temp
      };
    },


    logout: (state) => {
      // Clear session storage
      localStorage.removeItem("userInfo");
      // Reset state to initial values
      return { role: "guest", token: null, permissions: [] };
    },
  },
});

// Export action creators
export const { login, authnReg, authnDelete, logout } = authSlice.actions;

// Export reducer
export default authSlice.reducer;
