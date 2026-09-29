import { Routes, Route } from "react-router";
import { HomePage } from "./pages/HomePage";
import { OrdersPage } from "./pages/OrdersPage";
import { CheckoutPages } from "./pages/CheckoutPages";
import { TrackingPage } from "./pages/TrackingPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/checkout" element={<CheckoutPages />} />
      <Route path="/tracking" element={<TrackingPage />} />
    </Routes>
  );
}

export default App;