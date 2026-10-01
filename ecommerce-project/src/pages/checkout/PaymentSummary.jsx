import { formatMoney } from "../../utils/Money.js";
export function PaymentSummary({ paymentSummary }) {
    return(
          <div className="payment-summary">

            <div className="payment-summary-title">
              Payment Summary
            </div>

            {/* Items */}
            <div className="payment-summary-row">
              <div>
                Items ({paymentSummary.totalItems}):
              </div>

              <div className="payment-summary-money">
                {formatMoney(paymentSummary.productCostCents)}
              </div>
            </div>

            {/* Shipping */}
            <div className="payment-summary-row">
              <div>
                Shipping &amp; handling:
              </div>

              <div className="payment-summary-money">
                {formatMoney(paymentSummary.shippingCostCents)}
              </div>
            </div>

            {/* Total before tax */}
            <div className="payment-summary-row subtotal-row">
              <div>
                Total before tax:
              </div>

              <div className="payment-summary-money">
                {formatMoney(
                  paymentSummary.totalCostBeforeTaxCents
                )}
              </div>
            </div>

            {/* Tax */}
            <div className="payment-summary-row">
              <div>
                Estimated tax:
              </div>

              <div className="payment-summary-money">
                {formatMoney(paymentSummary.taxCents)}
              </div>
            </div>

            {/* Order total */}
            <div className="payment-summary-row total-row">
              <div>
                Order total:
              </div>

              <div className="payment-summary-money">
                {formatMoney(paymentSummary.totalCostCents)}
              </div>
            </div>

            {/* Place order */}
            <button className="place-order-button button-primary">
              Place your order
            </button>

          </div>

     );

}