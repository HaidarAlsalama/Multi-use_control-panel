import { HiOutlineLanguage } from "react-icons/hi2";
import { IoColorPaletteOutline } from "react-icons/io5";
import NavigationCard from "../../../components/NavigationCard/NavigationCard";
import { changeLanguage } from "../../../lang";

const cards = [
  {
    title: "Toggle theme",
    description: "You can toggle the theme of your application between light or night mode",
    url: "#",
    fun() {
        document.documentElement.classList.toggle("dark");
        if (document.documentElement.classList.contains("dark")) {
          localStorage.setItem("themeMode", "dark");
        } else {
          localStorage.setItem("themeMode", "");
        }
      },
    icon: IoColorPaletteOutline,
  },
  {
    title: "Language",
    description: "You can toggle the language of your application",
    url: "#",
    fun() {
      if (document.documentElement.lang === "en") {
        document.documentElement.lang = "ar";
        document.documentElement.dir = "rtl";
        changeLanguage("ar");
      } else {
        document.documentElement.lang = "en";
        document.documentElement.dir = "ltr";
        changeLanguage("en");
      }
    },
    icon: HiOutlineLanguage,
  },
];

export default function Settings() {
  return (
    <>
      <div className="flex gap-6 w-full flex-wrap justify-center md:justify-start h-fit">
        {cards.map((card, index) => (
          <NavigationCard data={card} key={index} />
        ))}
      </div>
    </>
  );
}
