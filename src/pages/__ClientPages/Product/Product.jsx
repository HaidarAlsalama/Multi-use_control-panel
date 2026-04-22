import { useClientProduct, useCreateOrder } from "api/Client/product";
import { Spinner } from "components";
import CustomInput from "components/ClientLayoutPages/ClientInputField/CustomInput";
import Container from "components/ClientLayoutPages/Container/Container";
import useParam from "Hooks/useParam";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";

export default function Product() {
  const { currency } = useSelector((x) => x.balance);
  const productId = useParam("productId");
  const [fields, setFields] = useState([]);
  const [fieldsValue, setFieldsValue] = useState({});
  const [price, setPrice] = useState(0);
  const [total, setTotal] = useState(0);
  const [showConfirmButtons, setShowConfirmButtons] = useState(false);
  const [timer, setTimer] = useState(10);
  const countdownRef = useRef(null);

  const {
    data: product,
    isLoading: productIsLoading,
    isSuccess: productIsSuccess,
  } = useClientProduct(productId);

  const {
    mutate: createOrder,
    isPending: createOrderIsPending,
    isSuccess: createOrderIsSuccess,
  } = useCreateOrder(productId);

  useEffect(() => {
    if (productIsSuccess) {
      setFields(JSON.parse(product.data.product?.fields) || []);
      setPrice(product.data.product?.price);
    }
  }, [productIsSuccess, product]);

  useEffect(() => {
    if (product?.data?.product.is_quantity) {
      setTotal(fieldsValue?.quantity * price || 0);
    } else setTotal(price);
  }, [fieldsValue, price, product?.data?.product.is_quantity]);

  useEffect(() => {
    if (createOrderIsSuccess) {
      setFieldsValue((prev) =>
        Object.keys(prev).reduce((acc, key) => {
          acc[key] = "";
          return acc;
        }, {}),
      );
      setTotal(0);
      setShowConfirmButtons(false);
      setTimer(10);
      console.log("الطلب تم بنجاح!");
    }
  }, [createOrderIsSuccess]);

  const startCountdown = () => {
    setShowConfirmButtons(true);
    setTimer(10);
    clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(countdownRef.current);
          handleConfirmOrder();
          return 10;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleConfirmOrder = () => {
    clearInterval(countdownRef.current);
    setShowConfirmButtons(false);
    createOrder(fieldsValue);
  };

  const handleCancel = () => {
    clearInterval(countdownRef.current);
    setShowConfirmButtons(false);
    setTimer(10);
  };

  if (productIsLoading) return <Spinner page />;
  if (productIsSuccess)
    return (
      <Container
        title={product.data.product.name}
        message={product.data.product_full_path}
        back
      >
        {product.data.product?.description != `<p><br></p>` &&
          product.data.product?.description != null && (
            <div
              className="p-4 text-white rounded-md mb-4 bg-zinc-800"
              dangerouslySetInnerHTML={{
                __html: product.data.product.description,
              }}
            />
          )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            startCountdown();
          }}
          className="p-4 grid grid-cols-1 gap-4 rounded-md bg-zinc-800"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 _lg:grid-cols-4 gap-4">
            {fields.length > 0 &&
              fields.map((field) => (
                <CustomInput
                  key={field.fieldId}
                  id={field.fieldId}
                  title={field.name}
                  type={field.type}
                  max={field.max}
                  min={field.min}
                  options={field.options}
                  value={fieldsValue[field.fieldId] || ""}
                  onChange={(v) =>
                    setFieldsValue((prev) => ({
                      ...prev,
                      [field.fieldId]: v.value,
                    }))
                  }
                  direction="ltr"
                  required
                />
              ))}
            {/* <CustomInput
              id={"price"}
              title={"السعر"}
              value={parseFloat(price.toString()).toLocaleString()}
              isDisabled
              direction="ltr"
            /> */}
            <CustomInput
              id={"total"}
              title={"الاجمالي"}
              value={
                currency == "USD"
                  ? Math.ceil(total * 1000) / 1000
                  : currency == "S.P"
                    ? parseFloat(total).toLocaleString()
                    : ""
              }
              isDisabled
              direction="ltr"
            />
            {/* <CustomInput
              id={"total"}
              title={"الاجمالي"}
              value={
                currency == "USD"
                  ? Math.ceil(total * 1000) / 1000
                  : currency == "S.P"
                  ? Math.ceil(parseFloat(total)).toLocaleString()
                  : ""
              }
              isDisabled
              direction="ltr"
            /> */}
          </div>
          {product.data.product.is_available == 0 ? (
            <button
              className="btn btn-smart md:col-span-2 mx-auto mt-4 w-44"
              disabled
            >
              هذا المنتج غير متوفر حالياً
            </button>
          ) : (
            <>
              {!showConfirmButtons ? (
                <button
                  className="btn btn-smart md:col-span-2 mx-auto mt-4 w-40"
                  disabled={createOrderIsPending}
                  type="submit"
                >
                  {createOrderIsPending ? <Spinner sm /> : "انشاء الطلب"}
                </button>
              ) : (
                <div className="flex justify-center flex-wrap gap-4 md:col-span-2 mx-auto mt-4">
                  <button
                    className="btn btn-success w-40"
                    onClick={handleConfirmOrder}
                    disabled={createOrderIsPending}
                  >
                    تأكيد انشاء الطلب({timer})
                  </button>
                  <button
                    className="btn btn-danger w-40"
                    onClick={handleCancel}
                  >
                    إلغاء
                  </button>
                </div>
              )}
            </>
          )}
        </form>
      </Container>
    );
}
