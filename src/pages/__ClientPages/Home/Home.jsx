import Container from "components/ClientLayoutPages/Container/Container";
import {
  FcGlobe,
  FcManager,
  FcMoneyTransfer,
  FcReadingEbook,
  FcShipped,
  FcSimCard,
  FcSimCardChip,
} from "react-icons/fc";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
const cards = [
  {
    title: "رصيد مفرق",
    description: "إدارة عمليات التحويل",
    url: "abili",
    icon: FcSimCard, // تم التعديل هنا لاسم موجود فعلياً
  },
  {
    title: "رصيد كازيات",
    description: "إدارة التحويل بالجملة",
    url: "abili-jomla",
    icon: FcSimCardChip,
  },
  {
    title: "الانترنت",
    description: "إدارة خدمات الانترنت",
    url: "internet",
    icon: FcGlobe,
  },
  {
    title: "الالعاب",
    description: "pubg, free fire, Jawaker",
    url: "games",
    icon: FcReadingEbook,
  },
  {
    title: "رصيد بنوك",
    description: "",
    url: "banks",
    description: "شام كاش",

    icon: FcMoneyTransfer,
  },
];

export default function Home() {
  const { name } = useSelector((state) => state.auth);
  const { balance } = useSelector((state) => state.balance);
  return (
    <Container>
      <div className="w-full px-4 mx-auto">
        <div
          className="w-full max-w-2xl p-4 px-10 rounded-[2.5rem] 
         backdrop-blur-xl shadow-md my-4 transition-all duration-500
        flex justify-between items-center gap-6 mx-auto  bg-gray-200/60 dark:bg-gray-900 
                 border border-black/10 dark:border-white/5"
        >
          <div>
            {" "}
            <h1 className="text-sm_ font-bold text-gray-800 dark:text-white">
              {name}
            </h1>
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-800 dark:text-white">
              الرصيد
            </h1>
            {balance < 0 ? (
              <span
                // dir="ltr"
                className="text-[10px]_ text-red-500 font-bold uppercase tracking-wider"
              >
                {balance} <span className="text-xs">ل.س</span>
              </span>
            ) : (
              <span
                // dir="ltr"
                className="text-[10px]_ text-mainLight font-bold uppercase tracking-wider"
              >
                {balance} <span className="text-xs">ل.س</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* تحسين عرض الشبكة لتكون متناسقة مع المربعات */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto p-4 pt-2">
        {cards.map((card) => (
          <NavigationCard key={card.url} data={card} />
        ))}
      </div>
    </Container>
  );
}

function NavigationCard({ data }) {
  return (
    <Link
      to={data.url}
      className="group relative aspect-square flex flex-col items-center justify-center p-6 rounded-[2.5rem] 
                 bg-gray-100 dark:bg-gray-900 
                 border border-black/10 dark:border-white/5
                 dark:shadow-none shadow-md
                 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 overflow-hidden"
    >
      {/* تأثير توهج خلفي (Backlight Effect) */}
      <div className="absolute -inset-full bg-gradient-to-tr from-mainLight/10 via-transparent to-transparent group-hover:rotate-180 transition-all duration-1000 opacity-0 group-hover:opacity-100" />

      <div className="relative z-10_ flex flex-col items-center text-center space-y-4">
        {/* الأيقونة بحجم أكبر ومركزية */}
        <div className="p-4 bg-white/50 dark:bg-white/5 rounded-3xl shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
          <data.icon className="text-5xl md:text-6xl" />
        </div>

        <div>
          <h5 className="text-lg md:text-xl font-black text-gray-800 dark:text-white mb-1 transition-colors duration-300">
            {data.title}
          </h5>
          <p className="hidden md:block text-[11px] md:text-[13px] font-medium text-gray-500 dark:text-gray-400 leading-tight opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            {data.description}
          </p>
        </div>
      </div>

      {/* لمسة جمالية: دائرة صغيرة في الزاوية */}
      <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-mainLight/30 group-hover:bg-mainLight transition-colors" />
    </Link>
  );
}
