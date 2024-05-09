import React, { useState } from "react";
const style = {
  marginRight: "20px",
  padding: "5px 10px",
  width: "50px",
  border: "1px solid",
};
const arrayOfProducts = [
  { id: "1", name: "Product-1", price: 2500, quantity: 10 },
  { id: "2", name: "Product-2", price: 3000, quantity: 5 },
  { id: "3", name: "Product-3", price: 3500, quantity: 20 },
  { id: "4", name: "Product-4", price: 4000, quantity: 100 },
];

export default function Testing_1() {
  const [productState, setProductState] = useState(arrayOfProducts);



  return (
    <div>
      {productState.length > 0 ? (
        productState.map((product) => (
          <div key={product.id}>
            <div>
              {`${product.name}: ${product.quantity}  `}
              <button style={style}>
                +
              </button>
              <button style={style}>
                -
              </button>
            </div>
            <br />
          </div>
        ))
      ) : (
        <h1>No data</h1>
      )}
    </div>
  );
}


// const Button = ({ children, action }) => {
//     useEffect(() =>{
//         return () => {
//             console.log('delete component')
//         }
//     },[])
//   return (
//     <button style={style} onClick={action}>
//       {children}
//     </button>
//   );
// };

// const handleAdd = (id) => {
//     let tempArray = [];
//     for (let product of productState) {
//       if (product.id === id) {
//         product = {
//           ...product,
//           quantity: product.quantity + 1,
//         };
//         tempArray.push(product);
//       } else {
//         tempArray.push(product);
//       }
//     }
//     setProductState(tempArray);
//   };

//   const handleRemove = (id) => {
//     let tempArray = [];
//     for (let product of productState) {
//       if (product.id === id) {
//         if (product.quantity > 1) {
//           product = {
//             ...product,
//             quantity: product.quantity - 1,
//           };
//           tempArray.push(product);
//         }
//       } else {
//         tempArray.push(product);
//       }
//     }
//     setProductState(tempArray);
//   };
