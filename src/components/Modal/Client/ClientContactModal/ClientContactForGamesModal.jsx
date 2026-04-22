import { useEffect, useState, useMemo } from "react";
import ClientActionModal from "../ClientActionModal/ClientActionModal";
import { Edit2, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { createAlert } from "components/Alert/Alert";
import { db } from "lib/contactsDb";

export { db } from "lib/contactsDb";

const FIELD_LABELS_AR = {
  name: "الاسم",
  phone: "رقم الهاتف",
  code: "الكود",
  quantity: "الكمية",
  speed: "السرعة",
  total: "السعر",
};

// مودال لإضافة جهة اتصال جديدة
function AddContactModal({
  isOpen,
  toggle,
  productKey,
  subKey,
  onSave,
  editingContact,
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [speed, setSpeed] = useState("");
  const [company, setCompany] = useState("");
  const [companyId, setCompanyId] = useState("");

  useEffect(() => {
    if (editingContact) {
      setName(editingContact.name || "");
      setPhone(editingContact.data?.phone || "");
      setSpeed(editingContact.data?.speed || "");
      setCompany(editingContact.subKey || "");
      setCompanyId(editingContact.data?.code || "");
    } else {
      setName("");
      setPhone("");
      setSpeed("");
      setCompany("");
      setCompanyId("");
    }
  }, [editingContact]);

  const handleCompanyChange = (e) => {
    const id = Number(e.target.value);
    const selected = subKey.find((s) => s.id === id);

    setCompanyId(id);
    setCompany(selected?.name || "");
  };

  const handleSave = async () => {
    if (!name.trim()) {
      createAlert("Warning", "الرجاء إدخال الاسم");
      return;
    }

    if (!phone.trim()) {
      createAlert("Warning", "الرجاء إدخال رقم الهاتف");
      return;
    }

    if (phone.length !== 7) {
      createAlert("Warning", "رقم الهاتف يجب أن يكون 7 أرقام");
      return;
    }

    if (!speed.trim()) {
      createAlert("Warning", "الرجاء إدخال السرعة");
      return;
    }

    if (!companyId) {
      createAlert("Warning", "الرجاء اختيار الشركة");
      return;
    }

    const contactData = {
      name,
      key: productKey,
      subKey: company,
      data: {
        phone,
        code: companyId,
        speed,
      },
    };

    if (editingContact) {
      await db.contacts.update(editingContact.id, contactData);
    } else {
      await db.contacts.add(contactData);
    }

    toggle(false);

    if (onSave) onSave();
  };

  return (
    <ClientActionModal
      open={isOpen}
      close={() => toggle(false)}
      size="xSmall"
      title={editingContact ? "تعديل" : "إضافة"}
    >
      <div className="flex flex-col gap-5">
        {/* الاسم */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            الاسم
          </label>

          <input
            type="text"
            placeholder="أدخل الاسم"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="
              w-full px-4 py-3 rounded-xl
              bg-white/70 dark:bg-white/5
              backdrop-blur-md
              border border-gray-300 dark:border-white/10
              text-gray-800 dark:text-white
              placeholder-gray-400
              shadow-sm
              focus:outline-none
              focus:ring-2 focus:ring-blue-500/50
              focus:border-blue-500
              transition-all duration-200
            "
          />
        </div>

        {/* الرقم */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            رقم الهاتف
          </label>

          <input
            type="text"
            placeholder="أدخل الرقم"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            dir="ltr"
            className="
              w-full px-4 py-3 rounded-xl
              bg-white/70 dark:bg-white/5
              backdrop-blur-md
              border border-gray-300 dark:border-white/10
              text-gray-800 dark:text-white
              placeholder-gray-400
              shadow-sm
              focus:outline-none
              focus:ring-2 focus:ring-blue-500/50
              focus:border-blue-500
              transition-all duration-200
            "
          />
        </div>

        {/* الشركة */}
        {subKey?.length > 0 && (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              الشركة
            </label>

            <select
              value={companyId}
              onChange={handleCompanyChange}
              className="
                w-full px-4 py-3 rounded-xl
                bg-white/70 dark:bg-white/5
                backdrop-blur-md
                border border-gray-300 dark:border-white/10
                text-gray-800 dark:text-white
                shadow-sm
                focus:outline-none
                focus:ring-2 focus:ring-blue-500/50
                focus:border-blue-500
                transition-all duration-200
              "
            >
              <option value="" disabled>
                اختر الشركة
              </option>

              {subKey.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* الرقم */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            السرعة او الدفعة{" "}
          </label>

          <input
            type="text"
            placeholder="أدخل السرعة"
            value={speed}
            onChange={(e) => setSpeed(e.target.value)}
            dir="ltr"
            className="
              w-full px-4 py-3 rounded-xl
              bg-white/70 dark:bg-white/5
              backdrop-blur-md
              border border-gray-300 dark:border-white/10
              text-gray-800 dark:text-white
              placeholder-gray-400
              shadow-sm
              focus:outline-none
              focus:ring-2 focus:ring-blue-500/50
              focus:border-blue-500
              transition-all duration-200
            "
          />
        </div>

        {/* زر الحفظ */}
        <button
          onClick={handleSave}
          className="
            mt-4 py-3 rounded-xl
            bg-gradient-to-r from-blue-500 to-indigo-600
            hover:from-blue-600 hover:to-indigo-700
            text-white font-semibold
            shadow-lg hover:shadow-xl
            transition-all duration-300
            active:scale-95
          "
        >
          {editingContact ? "تحديث" : "حفظ"}
        </button>
      </div>
    </ClientActionModal>
  );
}

// المودال الأساسي لعرض جهات الاتصال
export default function ClientContactForInternetModal({
  isOpen,
  toggle,
  productKey,
  subKey,
  fields,
}) {
  const [contacts, setContacts] = useState([]);
  const [editingContact, setEditingContact] = useState(null);
  const [openAddContactModal, setOpenAddContactModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // تحميل جهات الاتصال
  const loadContacts = async () => {
    const all = await db.contacts.toArray();
    const filtered = all.filter((c) => c.key === productKey);
    setContacts(filtered);
  };

  useEffect(() => {
    if (isOpen) loadContacts();
  }, [isOpen, productKey]);

  // حذف جهة اتصال
  const handleDelete = async (id) => {
    await db.contacts.delete(id);
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  // تعديل
  const handleEdit = (contact) => {
    setEditingContact(contact);
    setOpenAddContactModal(true);
  };

  // البحث الشامل
  const filteredContacts = useMemo(() => {
    if (!searchTerm) return contacts;

    return contacts.filter((c) => {
      if (c.name.toLowerCase().includes(searchTerm.toLowerCase())) return true;
      return Object.values(c.data).some((val) =>
        val?.toString().toLowerCase().includes(searchTerm.toLowerCase()),
      );
    });
  }, [contacts, searchTerm]);

  return (
    <>
      <ClientActionModal
        open={isOpen}
        close={toggle}
        size="small"
        title="الحافظة"
      >
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 mt-2 items-center">
            {" "}
            {/* زر لإضافة جهة اتصال */}
            <button
              onClick={() => {
                setEditingContact(null);
                setOpenAddContactModal(true);
              }}
              className="bg-green-500 h-10 dark:bg-green-600 text-white px-4 py-1.5 rounded self-start hover:bg-green-600 dark:hover:bg-green-700"
            >
              إضافة
            </button>
            {/* حقل البحث */}
            <div>
              <input
                type="text"
                placeholder="البحث ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-1.5 h-10 rounded-xl border outline-none bg-white border-gray-200 dark:bg-black/20 dark:border-white/10 text-black dark:text-white"
              />
            </div>
          </div>

          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            💡 تلميح: عند إضافة جهة اتصال هنا، يمكنك الضغط عليها لاحقاً للانتقال
            مباشرةً إلى شركة هذا الزبون، وسيتم تعبئة رقم الهاتف تلقائياً بعد
            اختيار الخدمة.
          </div>

          {/* قائمة جهات الاتصال */}
          <div className="flex flex-col gap-4 max-h-full overflow-auto pr-1">
            {filteredContacts.length === 0 && (
              <div className="text-center text-gray-400 dark:text-gray-300 py-10">
                لا توجد جهات اتصال
              </div>
            )}

            {filteredContacts.map((c) => (
              <div
                key={c.id}
                className="group relative p-4 rounded-2xl 
      bg-white/60 dark:bg-white/5
      hover:bg-white/70 dark:hover:bg-white/10
      backdrop-blur-xl
      border border-white/40 dark:border-white/10
      shadow-lg 
      transition-all duration-300
      flex justify-between items-center"
              >
                {/* الرابط */}
                <Link
                  to={`?id=${c.id}&name=${encodeURIComponent(c.name)}&phone=${encodeURIComponent(c.data.phone)}&internetId=${encodeURIComponent(c.data.code)}&productKey=${encodeURIComponent(c.key)}&subKey=${encodeURIComponent(c.subKey)}`}
                  replace
                  className="flex-1"
                  onClick={() => toggle(false)}
                >
                  <div className="flex flex-col gap-2">
                    {/* الاسم */}
                    <div className="text-lg font-bold text-gray-800 dark:text-white group-hover:text-blue-500 transition">
                      {c.name}
                    </div>

                    {/* البيانات */}
                    <div className="text-sm text-gray-600 dark:text-gray-300 flex flex-col gap-1">
                      {fields.map(
                        (f) =>
                          c.data[f] && (
                            <span key={f} className="flex gap-1">
                              <span className="font-semibold text-gray-700 dark:text-gray-200">
                                {FIELD_LABELS_AR[f] || f}:
                              </span>
                              <span>{c.data[f]}</span>
                            </span>
                          ),
                      )}
                    </div>

                    {/* الشركة كبادج */}
                    {c.subKey && (
                      <span
                        className="mt-1 w-fit px-3 py-1 text-xs font-medium 
              bg-blue-100 text-blue-600 
              dark:bg-blue-500/20 dark:text-blue-300
              rounded-full"
                      >
                        {c.subKey}
                      </span>
                    )}
                  </div>
                </Link>

                {/* الأزرار */}
                <div className="flex gap-2 ml-3 opacity-80 group-hover:opacity-100 transition">
                  {/* <button
                    onClick={() => handleEdit(c)}
                    className="h-10 w-10 flex items-center justify-center 
          rounded-xl 
          bg-yellow-400/80 hover:bg-yellow-500
          text-white shadow-md transition"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button> */}

                  <button
                    onClick={() => handleDelete(c.id)}
                    className="h-8 w-8 flex items-center justify-center absolute top-0 left-0
          rounded-tl-2xl rounded-br-2xl 
          bg-red-500/80 hover:bg-red-600
          text-white shadow-md transition"
                  >
                    X
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ClientActionModal>

      {/* مودال الإضافة / التعديل */}
      {openAddContactModal && (
        <AddContactModal
          isOpen={openAddContactModal}
          toggle={setOpenAddContactModal}
          productKey={productKey}
          subKey={subKey}
          fields={fields}
          onSave={loadContacts} // إعادة تحميل بعد الحفظ
          editingContact={editingContact} // إذا كان تعديل
        />
      )}
    </>
  );
}
