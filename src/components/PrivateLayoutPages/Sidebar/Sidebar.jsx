import { __APP_NAME__ } from "config/static";
import { BsPersonFillGear } from "react-icons/bs";
import { CgMenuLeft } from "react-icons/cg";
import { FaIdCard, FaLayerGroup, FaUsersCog } from "react-icons/fa";
import { FaBuildingColumns } from "react-icons/fa6";
import {
  FcAdvertising,
  FcApproval,
  FcBusinessman,
  FcContacts,
  FcExport,
  FcGenealogy,
  FcHome,
  FcManager,
  FcMoneyTransfer,
  FcPackage,
  FcPaid,
  FcSupport,
} from "react-icons/fc";
import { GrTransaction } from "react-icons/gr";
import { IoReceiptSharp } from "react-icons/io5";
import { useSelector } from "react-redux";
import "./Sidebar.scss";
import GroupLinks from "./sidebarCompo/SidebarGroupLinks/SidebarGroupLinks.component";

const listLinks = [
  {
    title: "لوحة التحكم",
    url: "/dashboard",
    icon: FcHome,
    role: ["admin"],
  },
  {
    title: "صناديق المستخدمين",
    url: "/dashboard/admin-box",
    icon: FcMoneyTransfer,
    role: ["admin"],
  },
  {
    title: "إدارة المستخدمين",
    url: "/dashboard",
    icon: FcManager,
    role: ["admin"],
    type: "list",
    permission: ["view_users", "view_roles"],
    content: [
      {
        title: "المستخدمين",
        url: "/dashboard/users",
        icon: BsPersonFillGear,
        count: 0,
        permission: "view_users",
      },
      {
        title: "الأدوار والصلاحيات",
        url: "/dashboard/role-and-permission",
        icon: FaIdCard,
        count: 0,
        permission: "view_roles",
      },
    ],
  },
  {
    title: "إدارة الزبائن",
    url: "/dashboard",
    icon: FcContacts,
    role: ["admin"],
    type: "list",
    permission: ["view_customer"],
    content: [
      {
        title: "الزبائن",
        url: "/dashboard/customers",
        icon: FaUsersCog,
        count: 0,
        permission: "view_customer",
      },
      // {
      //   title: "تصنيفات الزبائن",
      //   url: "/dashboard/customers-groups",
      //   icon: FaLayerGroup,
      //   count: 0,
      //   permission: "view_customer_groups",
      // },
    ],
  },
  {
    title: "الدفعات وتغذيه الحسابات",
    url: "/dashboard/charge-balance",
    icon: GrTransaction,
    role: ["admin"],
    permission: "view_banks",
  },
  // {
  //   title: "البنوك وشحن الرصيد",
  //   url: "/dashboard",
  //   icon: FcMoneyTransfer,
  //   role: ["admin"],
  //   type: "list",
  //   permission: ["view_banks"],
  //   content: [
  //     // {
  //     //   title: "البنوك",
  //     //   url: "/dashboard/banks",
  //     //   icon: FaBuildingColumns,
  //     //   count: 0,
  //     //   permission: "view_banks",
  //     // },
  //     // {
  //     //   title: "الاشعارات البنكية",
  //     //   url: "/dashboard/bank-notice",
  //     //   icon: IoReceiptSharp,
  //     //   count: 0,
  //     // },
  //     {
  //       title: "الدفعات وتغذيه الحسابات",
  //       url: "/dashboard/charge-balance",
  //       icon: GrTransaction,
  //       count: 0,
  //     },
  //   ],
  // },
  {
    title: "التصنيفات",
    url: "/dashboard/categories",
    icon: FcGenealogy,
    role: ["admin"],
    permission: "view_category",
  },
  {
    title: "المنتجات",
    url: "/dashboard/products",
    icon: FcPackage,
    role: ["admin"],
    permission: "view_products",
  },
  {
    title: "طلبات الزبائن",
    url: "/dashboard/services-orders",
    icon: FcPaid,
    permission: ["view_orders"],
    role: ["admin"],
  },
  // {
  //   title: "الوكلاء",
  //   url: "/dashboard/agents",
  //   icon: FcBusinessman,
  //   role: ["admin"],
  //   permission: "view_agents",
  // },
  {
    title: "الموردين",
    url: "/dashboard/suppliers",
    icon: FcBusinessman,
    role: ["admin"],
    // permission: "view_suppliers",
  },
  {
    title: "الارصدة",
    url: "/dashboard/balances",
    icon: FcBusinessman,
    role: ["admin"],
    // permission: "view_suppliers",
  },
  {
    title: "الأرباح",
    url: "/dashboard/products-profit",
    icon: FcApproval,
    role: ["admin"],
  },
];

const listLinks2 = [
  // {
  //   title: "الاعلانات",
  //   url: "/dashboard/ads",
  //   icon: FcAdvertising,
  //   role: ["admin"],
  //   permission: "view_advertisements",
  // },
  {
    title: "الاعدادات",
    url: "/dashboard/settings",
    icon: FcSupport,
    role: ["admin"],
  },
  { title: "تسجيل الخروج", url: "/logout", icon: FcExport, role: ["admin"] },
];

export default function Sidebar({ handleStateSidebar }) {
  const sidebarState = useSelector((state) => state.layout.layoutState);
  const { name, roles } = useSelector((state) => state.auth);

  return (
    <>
      {sidebarState == "openSmall" ? (
        <div
          className="fixed top-0 left-0 z-40 w-full h-full bg-gray-900/50 right-0"
          onClick={() => handleStateSidebar()}
        ></div>
      ) : null}
      <aside
        className={`${sidebarState} fixed top-0 ltr:left-0 rtl:right-0-0 z-50 lg:w-64 md:w-16 w-0 h-full duration-150 sidebar`}
      >
        <div
          className="grid grid-cols-1 h-full md:px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800 sidebar-content"
          style={{ gridTemplateRows: "min-content auto min-content" }}
        >
          <div
            className={`w-full flex md:flex-col lg:flex-row items-center justify-between overflow-hidden  sidebar-head`}
          >
            <button
              className="text-xl hover:bg-gray-300 hover:text-white_ rounded-md p-2 duration-200 text-gray-600 dark:text-gray-300 dark:hover:bg-blue-600"
              onClick={handleStateSidebar}
            >
              <CgMenuLeft />
            </button>
            <h1 className="text-2xl font-extrabold mb-1 w-full flex mr-4 ltr:ml-4 items-center_ gap-3 text-red-600 dark:text-blue-600">
              <img
                src="/assets/images/logo.png"
                alt="logo"
                className="w-8 h-8 my-auto"
              />
              <div className=" text-gray-700 w-full text-nowrap font-bold dark:text-white">
                <h5>{__APP_NAME__}</h5>
              </div>
            </h1>
          </div>
          <GroupLinks
            list={[
              {
                title: `${name}`,
                url: "#",
                icon: FcApproval,
                role: ["admin"],
                count: `${roles[0]?.name || null}`,
              },
              ...listLinks,
            ]}
          />
          <GroupLinks list={listLinks2} />
        </div>
      </aside>
    </>
  );
}
