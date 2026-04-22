import { useAddContactUs, useContactUs } from "api/admin/contactUs";
import { Spinner } from "components";
import { useEffect, useState } from "react";
import { FaPlus, FaSave, FaTrashAlt } from "react-icons/fa";

export default function ContactUs() {
  const [cards, setCards] = useState([]);

  const {
    data: dataContactUs,
    isLoading: dataContactUsIsLoading,
    isSuccess: dataContactUsIsSuccess,
  } = useContactUs();

  const { mutate: submitCards, isPending: submitCardsIsPending } =
    useAddContactUs();

  useEffect(() => {
    if (dataContactUsIsSuccess) setCards(dataContactUs);
  }, [dataContactUs]);

  const addCard = () => {
    setCards([...cards, { title: "", details: "", phone: "" }]);
  };

  const removeCard = (index) => {
    const newCards = [...cards];
    newCards.splice(index, 1);
    setCards(newCards);
  };

  const updateCard = (index, field, value) => {
    const newCards = [...cards];
    newCards[index][field] = value;
    setCards(newCards);
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-center gap-3 flex-wrap">
        <button
          onClick={addCard}
          className="btn btn-success flex items-center gap-2 w-20"
        >
          <FaPlus /> إضافة
        </button>

        <button
          onClick={() => submitCards(cards)}
          className="btn btn-primary flex items-center gap-2 w-20"
          disabled={submitCardsIsPending}
        >
          {submitCardsIsPending ? (
            <Spinner xs />
          ) : (
            <>
              <FaSave /> حفظ
            </>
          )}
        </button>
      </div>
      {dataContactUsIsLoading && <Spinner page />}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-lg space-y-3 border dark:border-gray-700"
          >
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-lg text-gray-800 dark:text-white">
                كرت رقم {index + 1}
              </h2>
              <button
                onClick={() => removeCard(index)}
                className="btn btn-danger flex items-center gap-2"
                title="حذف الكرت"
              >
                <FaTrashAlt /> حذف
              </button>
            </div>

            <input
              type="text"
              placeholder="العنوان"
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:outline-none"
              value={card?.title}
              onChange={(e) => updateCard(index, "title", e.target.value)}
            />

            <textarea
              placeholder="التفاصيل"
              rows={4}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:outline-none"
              value={card?.details}
              onChange={(e) => updateCard(index, "details", e.target.value)}
            />

            <input
              type="tel"
              placeholder="رقم الجوال"
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:outline-none"
              value={card?.phone}
              onChange={(e) => updateCard(index, "phone", e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
