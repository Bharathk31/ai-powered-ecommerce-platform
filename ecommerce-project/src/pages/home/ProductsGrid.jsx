import { formatMoney } from "../../utils/Money.js";
export function ProductsGrid({ products }) {
  return (
      <div className="products-grid">
          {products.map((product) => {
            return (
              <div
                key={product.id}
                className="product-container"
              >
                {/* Product Image */}
                <div className="product-image-container">
                  <img
                    className="product-image"
                    src={`/${product.image}`}
                    alt={product.name}
                  />
                </div>

                {/* Product Name */}
                <div className="product-name limit-text-to-2-lines">
                  {product.name}
                </div>

                {/* Rating */}
                <div className="product-rating-container">
                  <img
                    className="product-rating-stars"
                    src={`/images/ratings/rating-${product.rating.stars * 10}.png`}
                    alt={`${product.rating.stars} stars`}
                  />

                  <div className="product-rating-count link-primary">
                    {product.rating.count}
                  </div>
                </div>

                {/* Price */}
                <div className="product-price">
                  {formatMoney(product.priceCents)}
                </div>

                {/* Quantity */}
                <div className="product-quantity-container">
                  <select defaultValue="1">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                  </select>
                </div>

                <div className="product-spacer"></div>

                {/* Added to Cart */}
                <div className="added-to-cart">
                  <img
                    src="/images/icons/checkmark.png"
                    alt=""
                  />
                  Added
                </div>

                {/* Add to Cart Button */}
                <button className="add-to-cart-button button-primary">
                  Add to Cart
                </button>
              </div>
            );
          })}
        </div>
    
  );
}