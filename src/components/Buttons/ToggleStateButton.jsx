import { useToggleStatus } from "api/admin/global";
import { Spinner } from "components";
import React from "react";
import { BsToggles } from "react-icons/bs";

export default function ToggleStateButton({ type, currentState, id }) {
  const { mutate: toggleStatus, isPending: toggleStatusIsPending } =
    useToggleStatus(type);
  return (
    <button
      className={`btn ${
        currentState ? "btn-success" : "btn-warning"
      } text-xs_ !p-1.5`}
      onClick={() => toggleStatus(id)}
      title={`${currentState ? "تعطيل" : "تفعيل"}`}
      disabled={toggleStatusIsPending}
    >
      {toggleStatusIsPending ? <Spinner xs /> : <BsToggles />}
    </button>
  );
}
