import NavigationCard from "components/PrivateLayoutPages/NavigationCard/NavigationCard";
import { FcSupport } from "react-icons/fc";

import {
  FcAdvertising,
  FcBusinessman,
  FcComboChart,
  FcCustomerSupport,
  FcDiploma2,
  FcDonate,
  FcExport,
  FcGenealogy,
  FcLibrary,
  FcManager,
  FcPackage,
  FcRules,
  FcSurvey,
} from "react-icons/fc";
const cards = [
  {
    title: "المستخدمين",
    description: "إدارة حسابات المستخدمين وصلاحياتهم",
    url: "/dashboard/users",
    icon: FcManager,
    count: 0,
    role: ["admin"],
    permission: "view_users",
  },
  {
    title: "الأدوار والصلاحيات",
    description: "تنظيم الأدوار وتوزيع الصلاحيات",
    url: "/dashboard/role-and-permission",
    icon: FcRules,
    count: 0,
    role: ["admin"],
    permission: "view_roles",
  },

  {
    title: "الزبائن",
    description: "عرض وإدارة بيانات العملاء",
    url: "/dashboard/customers",
    icon: FcCustomerSupport,
    count: 0,
    role: ["admin"],
    permission: "view_customer",
  },
  // {
  //   title: "تصنيفات الزبائن",
  //   description: "إدارة مجموعات وتصنيفات العملاء",
  //   url: "/dashboard/customers-groups",
  //   icon: FcComboChart,
  //   count: 0,
  //   role: ["admin"],
  //   permission: "view_customer_groups",
  // },

  {
    title: "البنوك",
    description: "إدارة الحسابات والمعاملات البنكية",
    url: "/dashboard/banks",
    icon: FcLibrary,
    count: 0,
    role: ["admin"],
    permission: "view_banks",
  },
  {
    title: "الاشعارات البنكية",
    description: "متابعة الإشعارات والمعاملات البنكية",
    url: "/dashboard/bank-notice",
    icon: FcDiploma2,
    count: 0,
    role: ["admin"],
    permission: "view_banks",
  },
  {
    title: "الدفعات وتغذيه الحسابات",
    description: "إدارة عمليات الشحن والمعاملات المالية",
    url: "/dashboard/charge-balance",
    icon: FcDonate,
    count: 0,
    role: ["admin"],
    permission: "view_banks",
  },

  {
    title: "التصنيفات",
    description: "إدارة التصنيفات وتحديثها",
    url: "/dashboard/categories",
    icon: FcGenealogy,
    role: ["admin"],
    permission: "view_category",
  },
  {
    title: "المنتجات",
    description: "إدارة المنتجات وتحديث المخزون",
    url: "/dashboard/products",
    icon: FcPackage,
    role: ["admin"],
    permission: "view_products",
  },
  {
    title: "طلبات الرصيد",
    description: "متابعة طلبات الرصيد وإدارتها",
    url: "/dashboard/services-orders",
    icon: FcSurvey,
    permission: "view_orders",
    role: ["admin"],
  },
  // {
  //   title: "الوكلاء",
  //   description: "إدارة حسابات الوكلاء وتفاصيلهم",
  //   url: "/dashboard/agents",
  //   icon: FcBusinessman,
  //   role: ["admin"],
  //   permission: "view_agents",
  // },

  // {
  //   title: "الاعلانات",
  //   description: "إدارة الحملات الإعلانية والمحتوى",
  //   url: "/dashboard/ads",
  //   icon: FcAdvertising,
  //   role: ["admin"],
  //   permission: "view_advertisements",
  // },
  {
    title: "الاعدادات",
    description: "إدارة إعدادات النظام وتخصيصها",
    url: "/dashboard/settings",
    icon: FcSupport,
    role: ["admin"],
  },
  {
    title: "تسجيل الخروج",
    description: "تسجيل الخروج من الحساب",
    url: "/logout",
    icon: FcExport,
    role: ["admin"],
  },
];

export default function Dashboard() {
  return (
    <>
      {/* <FastInfo /> */}
      <div className="flex gap-4 w-full col-span-2 flex-wrap justify-center h-fit">
        {cards.map((card, index) => (
          <NavigationCard key={index} data={card} />
        ))}
      </div>
    </>
  );
}
