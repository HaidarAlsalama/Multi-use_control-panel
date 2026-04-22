import { useCategoriesForOrder, useCategoriesOrder } from "api/admin/category";
import { Spinner } from "components";
import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { TiWarning } from "react-icons/ti";
import ActionModal from "../../ActionModal/ActionModal";

export default function OrderCategories({ isOpen, toggle, idCategory }) {
  const [items, setItems] = useState([]);
  const [newOrder, setNewOrder] = useState([]);

  const {
    data: categoies,
    isSuccess: categoiesIsSuccess,
    isLoading: categoiesIsLoading,
    isError: categoiesIsError,
  } = useCategoriesForOrder(idCategory);

  const {
    mutate: orderIt,
    isPending: orderItIsPending,
    isSuccess: orderItIsSuccess,
  } = useCategoriesOrder("category");

  useEffect(() => {
    if (categoiesIsSuccess) {
      setItems(categoies?.data);
    }
  }, [categoies]);

  useEffect(() => {
    if (orderItIsSuccess) {
      toggle(false);
    }
  }, [orderItIsSuccess, toggle]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reordered = Array.from(items);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);

    setItems(reordered);

    const updatedOrder = reordered.map((item, index) => ({
      id: item.id,
      order: index + 1,
    }));

    setNewOrder(updatedOrder);
  };

  return (
    <ActionModal
      open={isOpen}
      close={toggle}
      size="xSmall"
      title="ترتيب التصنيفات"
    >
      {categoiesIsLoading ? (
        <Spinner />
      ) : !categoiesIsError && items.length > 0 ? (
        <div className="rounded-xl shadow-lg">
          <div className="grid grid-cols-2 bg-blue-500 rounded-md text-white font-bold mb-1 text-center py-2 px-2 ">
            <div>#</div>
            <div>اسم التصنيف</div>
          </div>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="product-list">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-1"
                >
                  {items.map((product, index) => (
                    <Draggable
                      key={product.id}
                      draggableId={product.id.toString()}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`grid grid-cols-2 items-center text-center px-4 py-3 border border-zinc-700 rounded-md transition-all duration-200 
                            odd:bg-white text-lg_ odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 select-none
                        hover:dark:bg-gray-700 hover:bg-gray-200 ${
                          snapshot.isDragging
                            ? "bg-blue-200 text-zinc-900 shadow-lg"
                            : "hover:bg-red-800 text-gray-900 dark:text-white"
                        }`}
                          style={{
                            ...provided.draggableProps.style,
                            minHeight: "48px",
                            backgroundColor: snapshot.isDragging
                              ? "#FEF08A"
                              : undefined,
                          }}
                        >
                          <div className="font-semibold">{index + 1}</div>
                          <div>{product.name}</div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <button
            onClick={() => orderIt(newOrder)}
            disabled={orderItIsPending}
            className="btn btn-primary w-20 !p-1 float-end my-4 "
          >
            حفظ
          </button>
        </div>
      ) : (
        <div className="w-full text-7xl text-yellow-500 flex justify-center">
          <TiWarning />
        </div>
      )}
    </ActionModal>
  );
}
