import { useSelector } from "react-redux";
import SidebarLink from "../SidebarLink/SidebarLink.component";
import SidebarListLinks from "../SidebarListLinks/SidebarListLinks.component";

export default function GroupLinks({ list }) {
  const { role, permissions } = useSelector((state) => state.auth);

  // Function to check if the user's role is valid
  const hasValidRole = (itemRole) => {
    return itemRole && (itemRole.includes(role) || itemRole.includes("any"));
  };

  // Function to check if the user has the required permission
  const hasValidPermission = (itemPermission) => {
    return itemPermission ? checkIfExists(itemPermission) : true; // If permission is not defined, return true
  };

  function checkIfExists(input) {
    if (typeof input === "string") {
      return permissions.includes(input);
    } else if (Array.isArray(input)) {
      return input.some((item) => permissions.includes(item));
    }
    return false;
  }

  return (
    <ul className="w-full flex flex-col gap-1 text-gray-600 dark:text-gray-300">
      {list.map((item, index) => {
        // Check if the role is valid for this item
        const isRoleValid = hasValidRole(item.role);

        // Check if the permission is valid for this item or if no permission exists
        const isPermissionValid = hasValidPermission(item.permission);

        // Only render the item if both role and permission are valid
        if (isRoleValid && isPermissionValid) {
          return item.type ? (
            <SidebarListLinks key={index} list={item} />
          ) : (
            <SidebarLink key={index} item={item} />
          );
        }

        return null; // Return null if role or permission doesn't match
      })}
    </ul>
  );
}
