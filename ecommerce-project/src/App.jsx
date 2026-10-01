import { useEffect, useState } from "react";
import axios from "axios";
import { Routes, Route } from "react-router";
import { HomePage } from "./pages/HomePage";
import { OrdersPage } from "./pages/OrdersPage";
import { CheckoutPages } from "./pages/CheckoutPages";
import { TrackingPage } from "./pages/TrackingPage";

function App() {
      const [cart, setCart] = useState([]);
      useEffect(() => {
        axios.get('/api/cart-items?expand=product')
      .then((response) => {
        setCart(response.data);
      })
      .catch((error) => {
        console.error('Error fetching cart items:', error);
      });
      }, []);

  return (
    <Routes>
      <Route path="/" element={<HomePage cart={cart} />} />
      <Route path="/orders" element={<OrdersPage  cart={cart}/>} />
      <Route path="/checkout" element={<CheckoutPages cart = {cart} />} />
      <Route path="/tracking" element={<TrackingPage />} />
    </Routes>
  );
}

export default App;