import axios from "axios";
import { useEffect, useState } from "react";
import { Header } from "../../Components/Header.jsx";
import { ProductsGrid } from "./ProductsGrid.jsx";
import "./HomePage.css";

export function HomePage({ cart }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("/api/products")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  return (
    <>
      <Header cart={cart} />

      <div className="home-page">
        <ProductsGrid products={products} />
      
      </div>
    </>
  );
}