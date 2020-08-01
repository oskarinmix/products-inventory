import React, { useEffect, useState } from "react";
import { app } from "./helpers/firebase";
import "firebase/firestore";
import "./form.scss";
const Form = () => {
  const [name, setName] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [bulkPrice, setBulkPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState(false);
  const validateForm = () => {
    return (
      name.length > 0 &&
      costPrice.length > 0 &&
      bulkPrice.length > 0 &&
      unitPrice.length > 0 &&
      quantity.length > 0
    );
  };

  useEffect(() => {
    const db = app.firestore();
    const fetchData = async () => {
      const data = await db.collection("products").get();
      const products = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setProducts(products);
    };
    fetchData();
  }, [newProduct]);

  const resetForm = () => {
    setName("");
    setCostPrice("");
    setBulkPrice("");
    setUnitPrice("");
    setQuantity("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const product = {
      name,
      costPrice,
      unitPrice,
      bulkPrice,
      quantity,
    };
    const db = app.firestore();

    try {
      console.log("Empezando la transacción");
      const resp = await db.collection("products").add(product);
      console.log(resp);
      resetForm();
      setNewProduct(!newProduct);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteProduct = (id) => {
    const db = app.firestore();
    db.collection("products").doc(id).delete();
    setNewProduct(!newProduct);
  };

  return (
    <React.Fragment>
      <div className="register-product">
        <h1>Crear Nuevo Producto</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              value={name}
              placeholder="Nombre del Producto"
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              value={quantity}
              placeholder="Cantidad de Productos"
              onChange={(e) => setQuantity(e.target.value.replace(/[^\d]/, ""))}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              value={costPrice}
              placeholder="Precio de Costo del Producto"
              onChange={(e) =>
                setCostPrice(e.target.value.replace(/[^\d]/, ""))
              }
            />
            <input
              type="text"
              value={unitPrice}
              placeholder="Precio al Detal del Producto"
              onChange={(e) =>
                setUnitPrice(e.target.value.replace(/[^\d]/, ""))
              }
            />
            <input
              type="text"
              value={bulkPrice}
              placeholder="Precio al Mayor del Producto"
              onChange={(e) =>
                setBulkPrice(e.target.value.replace(/[^\d]/, ""))
              }
            />
          </div>

          <button disabled={!validateForm()} type="submit">
            Guardar
          </button>
        </form>
        {products.length > 0 ? (
          <table align="center">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Precio de Costo</th>
                <th>Precio al Mayor</th>
                <th>Precio al detal</th>
                <th>Cantidad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={index}>
                  <td>{product.name}</td>
                  <td>{product.costPrice}</td>
                  <td>{product.bulkPrice}</td>
                  <td>{product.unitPrice}</td>
                  <td>{product.quantity}</td>
                  <td>
                    <button onClick={() => deleteProduct(product.id)}>
                      Borrar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <h2>No hay Productos Agregados...</h2>
        )}
      </div>
    </React.Fragment>
  );
};

export default Form;
