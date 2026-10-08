import { useEffect, useState } from "react";
import axios from "axios";
import { Routes, Route } from "react-router";

import { ProductDetailsPage } from "./pages/ProductDetails/ProductDetailsPage";
import { HomePage } from "./pages/home/HomePage";
import { OrdersPage } from "./pages/Orders/OrdersPage";
import { CheckoutPages } from "./pages/checkout/CheckoutPages";
import { TrackingPage } from "./pages/TrackingPage";

function App() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchAppData = async () => {
      const response = await axios.get(
        "/api/cart-items?expand=product"
      );

      setCart(response.data);
    };

    fetchAppData();
  }, []);

  return (
    <Routes>

      {/* Home */}
      <Route
        path="/"
        element={
          <HomePage
            cart={cart}
            setCart={setCart}
          />
        }
      />

      {/* Product Details */}
      <Route
        path="/product/:productId"
        element={
          <ProductDetailsPage
            cart={cart}
            setCart={setCart}
          />
        }
      />

      {/* Orders */}
      <Route
        path="/orders"
        element={
          <OrdersPage
            cart={cart}
          />
        }
      />

      {/* Checkout */}
      <Route
        path="/checkout"
        element={
          <CheckoutPages
            cart={cart}
          />
        }
      />

      {/* Tracking */}
      <Route
        path="/tracking"
        element={
          <TrackingPage />
        }
      />

    </Routes>
  );
}

export default App;