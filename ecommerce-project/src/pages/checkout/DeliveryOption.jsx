import { formatMoney } from "../../utils/Money.js";
import dayjs from "dayjs";
export function DeliveryOption({ deliveryOptions, cartItem }) {
    return (

        <div className="delivery-options">
            <div className="delivery-options-title">
                Choose a delivery option:
            </div>

            {deliveryOptions.map((deliveryOption) => {
                let priceString = "FREE Shipping";

                if (deliveryOption.priceCents > 0) {
                    priceString =
                        `$${formatMoney(deliveryOption.priceCents)} - Shipping`;
                }

                return (
                    <div
                        className="delivery-option"
                        key={deliveryOption.id}
                    >
                        <input
                            type="radio"
                            checked={
                                deliveryOption.id === cartItem.deliveryOptionId
                            }
                            className="delivery-option-input"
                            name={`delivery-option-${cartItem.productId}`}
                            readOnly
                        />

                        <div>
                            <div className="delivery-option-date">
                                {dayjs(deliveryOption.estimatedDeliveryTimeMS).format(
                                    "dddd, MMMM D"
                                )}
                            </div>

                            <div className="delivery-option-price">
                                {priceString}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>

    );
}