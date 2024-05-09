import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend";

// Get language from localStorage or default to document language
let currentLang = localStorage.getItem("lang") || document.documentElement.lang;

// Define function to update language dynamically
const changeLanguage = (newLang) => {
  currentLang = newLang;
  localStorage.setItem("lang", newLang);
  i18n.changeLanguage(newLang);
};

const i18nConfig = {
  lng: currentLang,
  backend: {
    loadPath: "/locale/{{lng}}/translation.json",
  },
};

i18n.use(initReactI18next).use(HttpApi).init(i18nConfig);

export { i18nConfig, changeLanguage };
