import { useState } from "react";
import { Link } from "react-router";
import { formatMoney } from "../../utils/Money.js";
import "./ProductsGrid.css";

export function ProductsGrid({ products, cart, setCart }) {
  return (
    <div className="products-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          cart={cart}
          setCart={setCart}
        />
      ))}
    </div>
  );
}

function ProductCard({ product, cart, setCart }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  function addToCart() {
    const existingItem = cart.find(
      (cartItem) => cartItem.productId === product.id
    );

    if (existingItem) {
      setCart(
        cart.map((cartItem) => {
          if (cartItem.productId === product.id) {
            return {
              ...cartItem,
              quantity: cartItem.quantity + quantity,
            };
          }

          return cartItem;
        })
      );
    } else {
      setCart([
        ...cart,
        {
          productId: product.id,
          quantity: quantity,
        },
      ]);
    }

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1500);
  }

  /*
    Use the real review summary when available.

    reviewSummary comes from:
    /api/products

    If it isn't available, we fall back to the
    original product rating.
  */
  const rating =
    product.reviewSummary?.averageRating ??
    product.rating?.stars ??
    0;

  const reviewCount =
    product.reviewSummary?.reviewCount ??
    product.rating?.count ??
    0;

  const ratingStars = Math.round(rating);

  /*
    Check whether the product has a discount.
  */
  const hasDiscount =
    product.originalPriceCents &&
    product.originalPriceCents > product.priceCents;

  /*
    Check whether stock information exists.
  */
  const hasStock =
    product.stock !== undefined &&
    product.stock !== null;

  /*
    Make sure the product doesn't show
    more than 5 stars.
  */
  const safeRatingStars = Math.min(
    Math.max(ratingStars, 0),
    5
  );

  return (
    <article className="product-card">

      {/* ================================
          PRODUCT IMAGE
      ================================= */}

      <Link
        to={`/product/${product.id}`}
        className="product-image-link"
      >
        <div className="product-image-container">

          {/* SALE BADGE */}
          {hasDiscount && (
            <span className="product-sale-badge">
              {product.discountPercent
                ? `${product.discountPercent}% OFF`
                : "SALE"}
            </span>
          )}

          {/* WISHLIST BUTTON */}
          <button
            type="button"
            className="product-wishlist"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
            aria-label="Add to wishlist"
          >
            ♡
          </button>

          {/* PRODUCT IMAGE */}
          <img
            className="product-image"
            src={
              product.image?.startsWith("http")
                ? product.image
                : `/${product.image}`
            }
            alt={product.name}
          />
        </div>
      </Link>

      {/* ================================
          PRODUCT INFORMATION
      ================================= */}

      <div className="product-card-content">

        {/* BRAND */}
        {product.brand && (
          <div className="product-brand">
            {product.brand}
          </div>
        )}

        {/* PRODUCT NAME */}
        <Link
          to={`/product/${product.id}`}
          className="product-name-link"
        >
          <h3 className="product-name">
            {product.name}
          </h3>
        </Link>

        {/* ================================
            RATING
        ================================= */}

        <div className="product-rating-container">

          <div className="product-rating-stars">
            {"★".repeat(safeRatingStars)}
            {"☆".repeat(5 - safeRatingStars)}
          </div>

          <strong>
            {Number(rating).toFixed(1)}
          </strong>

          <span>
            ({reviewCount})
          </span>

        </div>

        {/* ================================
            PRICE
        ================================= */}

        <div className="product-price-section">

          <span className="product-price">
            {formatMoney(product.priceCents)}
          </span>

          {hasDiscount && (
            <span className="product-original-price">
              {formatMoney(
                product.originalPriceCents
              )}
            </span>
          )}

        </div>

        {/* ================================
            STOCK
        ================================= */}

        {hasStock && (
          <div
            className={
              product.stock > 0
                ? "product-stock in-stock"
                : "product-stock out-of-stock"
            }
          >
            <span className="stock-dot"></span>

            {product.stock > 0
              ? "In Stock"
              : "Out of Stock"}
          </div>
        )}

        {/* ================================
            QUANTITY + ADD TO CART
        ================================= */}

        <div className="product-card-actions">

          <select
            className="product-quantity"
            value={quantity}
            onChange={(event) => {
              setQuantity(
                Number(event.target.value)
              );
            }}
            aria-label={`Quantity for ${product.name}`}
          >
            {[1, 2, 3, 4, 5].map((number) => (
              <option
                key={number}
                value={number}
              >
                {number}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="add-to-cart-button"
            onClick={addToCart}
            disabled={product.stock === 0}
          >
            {product.stock === 0
              ? "Out of Stock"
              : added
                ? "✓ Added"
                : "Add to Cart"}
          </button>

        </div>

        {/* ================================
            ADDED MESSAGE
        ================================= */}

        {added && (
          <div className="added-message">
            ✓ Added to your cart
          </div>
        )}

      </div>
    </article>
  );
}