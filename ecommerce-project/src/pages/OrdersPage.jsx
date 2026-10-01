import axios from "axios";
import dayjs from "dayjs";
import { Link } from "react-router";
import { useEffect, useState, Fragment } from "react";

import { formatMoney } from "../utils/Money.js";
import { Header } from "../Components/Header.jsx";
import "./OrdersPage.css";

export function OrdersPage({ cart }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios
      .get("/api/orders?expand=products")
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
  }, []);

  return (
    <>
      <Header cart={cart} />

      <div className="orders-page">
        <div className="page-title">Your Orders</div>

        <div className="orders-grid">
          {orders.map((order) => {
            return (
              <div className="order-container" key={order.id}>

                {/* Order Header */}
                <div className="order-header">

                  <div className="order-header-left-section">

                    <div className="order-date">
                      <div className="order-header-label">
                        Order Placed:
                      </div>

                      <div>
                        {dayjs(order.orderTimeMs).format("MMMM D")}
                      </div>
                    </div>

                    <div className="order-total">
                      <div className="order-header-label">
                        Total:
                      </div>

                      <div>
                        {formatMoney(order.totalCostCents)}
                      </div>
                    </div>

                  </div>

                  <div className="order-header-right-section">

                    <div className="order-header-label">
                      Order ID:
                    </div>

                    <div>
                      {order.id}
                    </div>

                  </div>

                </div>

                {/* Order Products */}
                <div className="order-details-grid">

                  {order.products.map((orderProduct) => {
                    return (
                      <Fragment key={orderProduct.product.id}>

                        {/* Product Image */}
                        <div className="product-image-container">
                          <img
                            src={`/${orderProduct.product.image}`}
                            alt={orderProduct.product.name}
                          />
                        </div>

                        {/* Product Details */}
                        <div className="product-details">

                          <div className="product-name">
                            {orderProduct.product.name}
                          </div>

                          <div className="product-delivery-date">
                            Arriving on:{" "}
                            {dayjs(
                              orderProduct.estimatedDeliveryTimeMs
                            ).format("MMMM D")}
                          </div>

                          <div className="product-quantity">
                            Quantity: {orderProduct.quantity}
                          </div>

                          <button className="buy-again-button button-primary">
                            <img
                              className="buy-again-icon"
                              src="/images/icons/buy-again.png"
                              alt=""
                            />

                            <span className="buy-again-message">
                              Add to Cart
                            </span>
                          </button>

                        </div>

                        {/* Product Actions */}
                        <div className="product-actions">

                          <Link to="/tracking">
                            <button className="track-package-button button-secondary">
                              Track package
                            </button>
                          </Link>

                        </div>

                      </Fragment>
                    );
                  })}

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}