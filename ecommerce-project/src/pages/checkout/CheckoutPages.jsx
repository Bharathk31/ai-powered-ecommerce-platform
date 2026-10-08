import axios from "axios";
import { useEffect, useState } from "react";
import { PaymentSummary } from "./PaymentSummary.jsx";
import { OrderSummary } from "./OrderSummary.jsx";
import "./checkout-header.css";
import "./checkoutpage.css";

export function CheckoutPages({ cart }) {
  const [deliveryOptions, setDeliveryOptions] = useState([]);

  const [paymentSummary, setPaymentSummary] = useState({
    totalItems: 0,
    productCostCents: 0,
    shippingCostCents: 0,
    totalCostBeforeTaxCents: 0,
    taxCents: 0,
    totalCostCents: 0,
  });

  useEffect(() => {
    const fetchCheckoutData = async () => {
      let response = await axios.get(
        "/api/delivery-options?expand=estimatedDeliveryTime"
      );

      setDeliveryOptions(response.data);

      response = await axios.get("/api/payment-summary");

      setPaymentSummary(response.data);
    };

    fetchCheckoutData();
  }, []);

  return (
    <>
      {/* =========================================
          Checkout Header
          ========================================= */}

      <div className="checkout-header">
        <div className="header-content">

          {/* Logo */}
          <div className="checkout-header-left-section">
            <a href="/">
              <img
                className="logo"
                src="/images/bharath-logo.png"
                alt="Store logo"
              />
            </a>
          </div>


          {/* Checkout title */}
          <div className="checkout-header-middle-section">
            Checkout (
            <a
              className="return-to-home-link"
              href="/"
            >
              {paymentSummary.totalItems} items
            </a>
            )
          </div>


          {/* Secure checkout */}
          <div className="checkout-header-right-section">
            <img
              src="/images/icons/checkout-lock-icon.png"
              alt="Secure checkout"
            />
          </div>

        </div>
      </div>


      {/* =========================================
          Checkout Page
          ========================================= */}

      <div className="checkout-page">

        <div className="page-title">
          Review your order
        </div>

        <div className="checkout-grid">

          {/* Order Summary */}
          <OrderSummary
            cart={cart}
            deliveryOptions={deliveryOptions}
          />

          {/* Payment Summary */}
          <PaymentSummary
            paymentSummary={paymentSummary}
          />

        </div>

      </div>
    </>
  );
}