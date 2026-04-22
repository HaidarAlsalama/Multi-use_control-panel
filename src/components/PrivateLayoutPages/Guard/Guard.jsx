import { useSelector } from "react-redux";

export default function Guard({ children, permission }) {
  const { role, permissions } = useSelector((state) => state.auth);

  if (role == "superAdmin") return <>{children}</>;
  if (permissions.includes(permission)) return <>{children}</>;
  return null;
}
