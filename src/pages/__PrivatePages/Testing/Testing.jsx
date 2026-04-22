import ActionModal from "components/Modal/ActionModal/ActionModal";
import { useState } from "react";

export default function Testing() {
  const [openModal, setOpenModal] = useState(false);
  return (
    <>
      <div className="flex gap-6 w-full flex-wrap justify-center md:justify-start h-fit px-4">
        <button
          className="btn btn-info btn-sm__"
          onClick={() => setOpenModal((prev) => !prev)}
        >
          فتح / اغلاق
        </button>
        {openModal && (
          <ActionModal
            open={openModal}
            close={setOpenModal}
            title={"تجريبي"}
            size={"medium"}
          ></ActionModal>
        )}
      </div>
    </>
  );
}
