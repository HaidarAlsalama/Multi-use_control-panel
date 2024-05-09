import SidebarLink from "../SidebarLink/SidebarLink.component";
import SidebarListLinks from "../SidebarListLinks/SidebarListLinks.component";

export default function GroupLinks({ list, sidebarState }) {
  return (
    <ul className="w-full flex flex-col gap-1 text-gray-600 dark:text-gray-300">
      {list.map((item, index) =>
        item.type ? (
          <SidebarListLinks
            key={index}
            list={item}
            sidebarState={sidebarState}
          />
        ) : (
          <SidebarLink key={index} item={item} sidebarState={sidebarState} />
        )
      )}
    </ul>
  );
}
