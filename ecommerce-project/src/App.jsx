import {Routes , Route} from 'react-router';
import {HomePage} from './pages/HomePage';
import {CheckoutPages} from './pages/CheckoutPages';
import {OrdersPage} from './pages/OrdersPage';

function App() {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="checkout" element={ <CheckoutPages />} />
      <Route path="orders" element={ <OrdersPage />} />
      <Route path = "orders" element={<OrdersPage />} />
    </Routes>
  )
}

export default App
 