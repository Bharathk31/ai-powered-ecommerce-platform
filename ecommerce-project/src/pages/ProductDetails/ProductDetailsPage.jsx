import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { Header } from "../../Components/Header.jsx";
import { formatMoney } from "../../utils/Money.js";
import "./ProductDetailsPage.css";

export function ProductDetailsPage({
  cart,
  setCart,
}) {
  const { productId } = useParams();

  // =========================================
  // PRODUCT STATE
  // =========================================

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================
  // IMAGE STATE
  // =========================================

  const [selectedImage, setSelectedImage] =
    useState("");

  // =========================================
  // VARIANT STATE
  // =========================================

  const [selectedOptions, setSelectedOptions] =
    useState({});

  // =========================================
  // QUANTITY
  // =========================================

  const [quantity, setQuantity] = useState(1);

  // =========================================
  // CART MESSAGE
  // =========================================

  const [added, setAdded] = useState(false);

  // =========================================
  // REVIEWS
  // =========================================

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] =
    useState(true);

  // =========================================
  // REVIEW FORM
  // =========================================

  const [showReviewForm, setShowReviewForm] =
    useState(false);

  const [reviewerName, setReviewerName] =
    useState("");

  const [reviewRating, setReviewRating] =
    useState(5);

  const [reviewText, setReviewText] =
    useState("");

  const [reviewSubmitting, setReviewSubmitting] =
    useState(false);

  const [reviewError, setReviewError] =
    useState("");

  const [reviewSuccess, setReviewSuccess] =
    useState("");

  // =========================================
  // FETCH PRODUCT
  // =========================================

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  async function fetchProduct() {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `/api/products/${productId}`
      );

      const productData = response.data;

      setProduct(productData);

      // Set first image
      const productImages =
        getProductImages(productData);

      if (productImages.length > 0) {
        setSelectedImage(productImages[0]);
      }

      // Set default variant
      if (
        Array.isArray(productData.variants) &&
        productData.variants.length > 0
      ) {
        const firstVariant =
          productData.variants[0];

        setSelectedOptions(
          firstVariant.options || {}
        );
      }
    } catch (error) {
      console.error(
        "Error fetching product:",
        error
      );

      setError(
        "Unable to load this product."
      );
    } finally {
      setLoading(false);
    }
  }

  // =========================================
  // FETCH REVIEWS
  // =========================================

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  async function fetchReviews() {
    try {
      setReviewsLoading(true);

      const response = await axios.get(
        `/api/reviews?productId=${productId}`
      );

      setReviews(response.data);
    } catch (error) {
      console.error(
        "Error fetching reviews:",
        error
      );

      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  }

  // =========================================
  // PRODUCT IMAGES
  // =========================================

  function getProductImages(productData) {
    const images = [];

    if (productData?.image) {
      images.push(productData.image);
    }

    if (Array.isArray(productData?.images)) {
      productData.images.forEach((image) => {
        if (
          image &&
          !images.includes(image)
        ) {
          images.push(image);
        }
      });
    }

    return images;
  }

  const productImages = useMemo(() => {
    return getProductImages(product);
  }, [product]);

  // =========================================
  // VARIANTS
  // =========================================

  const variants = useMemo(() => {
    if (!Array.isArray(product?.variants)) {
      return [];
    }

    return product.variants;
  }, [product]);

  // =========================================
  // OPTION GROUPS
  // =========================================

  const optionGroups = useMemo(() => {
    const groups = {};

    variants.forEach((variant) => {
      const options = variant.options || {};

      Object.entries(options).forEach(
        ([optionName, optionValue]) => {
          if (!groups[optionName]) {
            groups[optionName] = [];
          }

          if (
            !groups[optionName].includes(
              optionValue
            )
          ) {
            groups[optionName].push(
              optionValue
            );
          }
        }
      );
    });

    return groups;
  }, [variants]);

  // =========================================
  // CHECK WHETHER OPTION IS AVAILABLE
  // =========================================

  function isOptionAvailable(
    optionName,
    optionValue
  ) {
    if (!variants.length) {
      return true;
    }

    return variants.some((variant) => {
      const options = variant.options || {};

      if (
        options[optionName] !== optionValue
      ) {
        return false;
      }

      return Object.entries(
        selectedOptions
      ).every(([name, value]) => {
        if (name === optionName) {
          return true;
        }

        return options[name] === value;
      });
    });
  }

  // =========================================
  // SELECT OPTION
  // =========================================

  function selectOption(
    optionName,
    optionValue
  ) {
    setSelectedOptions((current) => ({
      ...current,
      [optionName]: optionValue,
    }));

    setQuantity(1);
    setAdded(false);
  }

  // =========================================
  // FIND SELECTED VARIANT
  // =========================================

  const selectedVariant = useMemo(() => {
    if (!variants.length) {
      return null;
    }

    return (
      variants.find((variant) => {
        const options =
          variant.options || {};

        return Object.entries(
          optionGroups
        ).every(([optionName]) => {
          return (
            options[optionName] ===
            selectedOptions[optionName]
          );
        });
      }) || null
    );
  }, [
    variants,
    selectedOptions,
    optionGroups,
  ]);

  // =========================================
  // CURRENT PRICE
  // =========================================

  const currentPrice =
    selectedVariant?.priceCents ??
    product?.priceCents ??
    0;

  // =========================================
  // CURRENT STOCK
  // =========================================

  const currentStock =
    selectedVariant?.stock ??
    product?.stock ??
    0;

  const hasStock =
    currentStock !== null &&
    currentStock !== undefined;

  const isOutOfStock =
    hasStock && currentStock <= 0;

  // =========================================
  // RATING
  // =========================================

  const averageRating =
    reviews.length > 0
      ? reviews.reduce(
        (total, review) =>
          total + Number(review.rating),
        0
      ) / reviews.length
      : product?.reviewSummary
        ?.averageRating ??
      product?.rating?.stars ??
      0;

  const reviewCount =
    reviews.length > 0
      ? reviews.length
      : product?.reviewSummary
        ?.reviewCount ??
      product?.rating?.count ??
      0;

  const roundedRating =
    Math.round(averageRating);

  // =========================================
  // RATING DISTRIBUTION
  // =========================================

  const ratingCounts = {
    5: reviews.filter(
      (review) =>
        Number(review.rating) === 5
    ).length,

    4: reviews.filter(
      (review) =>
        Number(review.rating) === 4
    ).length,

    3: reviews.filter(
      (review) =>
        Number(review.rating) === 3
    ).length,

    2: reviews.filter(
      (review) =>
        Number(review.rating) === 2
    ).length,

    1: reviews.filter(
      (review) =>
        Number(review.rating) === 1
    ).length,
  };

  // =========================================
  // ADD TO CART
  // =========================================

  function addToCart() {
    if (isOutOfStock) {
      return;
    }

    // Make sure all variant options
    // have been selected.
    if (
      variants.length > 0 &&
      !selectedVariant
    ) {
      alert(
        "Please select all product options."
      );

      return;
    }

    const variantKey = selectedVariant
      ? JSON.stringify(
        selectedVariant.options || {}
      )
      : "";

    const existingItem = cart.find(
      (cartItem) => {
        if (
          cartItem.productId !==
          product.id
        ) {
          return false;
        }

        const existingVariantKey =
          JSON.stringify(
            cartItem.selectedOptions || {}
          );

        return (
          existingVariantKey === variantKey
        );
      }
    );

    if (existingItem) {
      setCart(
        cart.map((cartItem) => {
          if (
            cartItem.productId ===
            product.id &&
            JSON.stringify(
              cartItem.selectedOptions ||
              {}
            ) === variantKey
          ) {
            return {
              ...cartItem,
              quantity:
                cartItem.quantity +
                quantity,
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
          quantity,
          selectedOptions: {
            ...selectedOptions,
          },
          variant: selectedVariant
            ? {
              options:
                selectedVariant.options,
              priceCents:
                selectedVariant.priceCents,
              stock:
                selectedVariant.stock,
            }
            : null,
        },
      ]);
    }

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1800);
  }

  // =========================================
  // QUANTITY
  // =========================================

  function increaseQuantity() {
    if (
      hasStock &&
      quantity >= currentStock
    ) {
      return;
    }

    setQuantity((current) => current + 1);
  }

  function decreaseQuantity() {
    setQuantity((current) =>
      Math.max(1, current - 1)
    );
  }

  // =========================================
  // SUBMIT REVIEW
  // =========================================

  async function submitReview(event) {
    event.preventDefault();

    setReviewError("");
    setReviewSuccess("");

    if (!reviewerName.trim()) {
      setReviewError(
        "Please enter your name."
      );
      return;
    }

    if (!reviewText.trim()) {
      setReviewError(
        "Please write a review."
      );
      return;
    }

    try {
      setReviewSubmitting(true);

      await axios.post("/api/reviews", {
        productId,
        reviewerName:
          reviewerName.trim(),
        rating: reviewRating,
        reviewText:
          reviewText.trim(),
      });

      setReviewerName("");
      setReviewRating(5);
      setReviewText("");
      setShowReviewForm(false);

      setReviewSuccess(
        "Your review was added successfully."
      );

      await fetchReviews();
    } catch (error) {
      console.error(
        "Error submitting review:",
        error
      );

      setReviewError(
        error.response?.data?.error ||
        "Failed to submit your review."
      );
    } finally {
      setReviewSubmitting(false);
    }
  }

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="product-page">
        <Header cart={cart} />

        <div className="product-page-loading">
          <div className="product-loading-spinner"></div>
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  // =========================================
  // ERROR
  // =========================================

  if (error || !product) {
    return (
      <div className="product-page">
        <Header cart={cart} />

        <div className="product-page-error">
          <h2>
            {error || "Product not found"}
          </h2>

          <Link
            to="/"
            className="back-to-products"
          >
            ← Back to products
          </Link>
        </div>
      </div>
    );
  }

  // =========================================
  // RENDER
  // =========================================

  return (
    <div className="product-page">

      {/* HEADER */}

      <Header
        cart={cart}
        onSearch={() => { }}
      />

      <main className="product-page-container">

        {/* BACK */}

        <Link
          to="/"
          className="back-to-products"
        >
          ← Back to products
        </Link>

        {/* =====================================
            PRODUCT MAIN SECTION
        ====================================== */}

        <section className="product-main-card">

          {/* IMAGE SECTION */}

          <div
            className={
              productImages.length > 1
                ? "product-gallery has-thumbnails"
                : "product-gallery"
            }
          >

            {productImages.length > 1 && (
              <div className="product-thumbnails">
                {productImages.map(
                  (image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      className={
                        selectedImage === image
                          ? "product-thumbnail active"
                          : "product-thumbnail"
                      }
                      onClick={() =>
                        setSelectedImage(image)
                      }
                    >
                      <img
                        src={
                          image.startsWith(
                            "http"
                          )
                            ? image
                            : `/${image}`
                        }
                        alt={`${product.name} ${index + 1
                          }`}
                      />
                    </button>
                  )
                )}
              </div>
            )}

            <div className="main-product-image-container">
              <img
                src={
                  selectedImage.startsWith(
                    "http"
                  )
                    ? selectedImage
                    : `/${selectedImage}`
                }
                alt={product.name}
                className="main-product-image"
              />
            </div>

          </div>

          {/* PRODUCT INFORMATION */}

          <div className="product-information">

            {product.brand && (
              <div className="product-detail-brand">
                {product.brand}
              </div>
            )}

            <h1 className="product-detail-title">
              {product.name}
            </h1>

            {/* RATING */}

            <div className="product-detail-rating">

              <div className="detail-rating-stars">
                {"★".repeat(
                  Math.min(
                    roundedRating,
                    5
                  )
                )}
                {"☆".repeat(
                  5 -
                  Math.min(
                    roundedRating,
                    5
                  )
                )}
              </div>

              <strong>
                {Number(
                  averageRating
                ).toFixed(1)}
              </strong>

              <span>
                {reviewCount}{" "}
                {reviewCount === 1
                  ? "review"
                  : "reviews"}
              </span>

            </div>

            <div className="product-divider"></div>

            {/* PRICE */}

            <div className="product-detail-price-row">

              <span className="product-detail-price">
                {formatMoney(
                  currentPrice
                )}
              </span>

              {product.originalPriceCents &&
                product.originalPriceCents >
                currentPrice && (
                  <span className="detail-original-price">
                    {formatMoney(
                      product.originalPriceCents
                    )}
                  </span>
                )}

              {product.discountPercent && (
                <span className="detail-discount">
                  {product.discountPercent}%
                  OFF
                </span>
              )}

            </div>

            {/* DESCRIPTION */}

            {product.description && (
              <p className="product-detail-description">
                {product.description}
              </p>
            )}

            {/* =================================
                VARIANT OPTIONS
            ================================== */}

            {Object.keys(optionGroups)
              .length > 0 && (
                <div className="variant-section">

                  {Object.entries(
                    optionGroups
                  ).map(
                    ([
                      optionName,
                      optionValues,
                    ]) => (
                      <div
                        className="variant-group"
                        key={optionName}
                      >

                        <div className="variant-title">
                          {formatOptionName(
                            optionName
                          )}

                          {selectedOptions[
                            optionName
                          ] && (
                              <span>
                                {
                                  selectedOptions[
                                  optionName
                                  ]
                                }
                              </span>
                            )}
                        </div>

                        <div className="variant-options">

                          {optionValues.map(
                            (optionValue) => {
                              const available =
                                isOptionAvailable(
                                  optionName,
                                  optionValue
                                );

                              const selected =
                                selectedOptions[
                                optionName
                                ] ===
                                optionValue;

                              return (
                                <button
                                  key={
                                    optionValue
                                  }
                                  type="button"
                                  className={
                                    selected
                                      ? "variant-option selected"
                                      : "variant-option"
                                  }
                                  disabled={
                                    !available
                                  }
                                  onClick={() =>
                                    selectOption(
                                      optionName,
                                      optionValue
                                    )
                                  }
                                >
                                  {
                                    optionValue
                                  }
                                </button>
                              );
                            }
                          )}

                        </div>
                      </div>
                    )
                  )}

                </div>
              )}

            {/* SELECTED VARIANT STOCK */}

            {variants.length > 0 &&
              selectedVariant && (
                <div className="selected-variant-info">

                  <span className="variant-check">
                    ✓
                  </span>

                  {selectedVariant.stock >
                    0 ? (
                    <span>
                      In Stock —{" "}
                      {
                        selectedVariant.stock
                      } available
                    </span>
                  ) : (
                    <span>
                      This combination is
                      currently out of stock.
                    </span>
                  )}

                </div>
              )}

            {/* STOCK FOR PRODUCTS WITHOUT VARIANTS */}

            {variants.length === 0 &&
              hasStock && (
                <div
                  className={
                    isOutOfStock
                      ? "detail-stock out"
                      : "detail-stock"
                  }
                >
                  <span className="stock-dot"></span>

                  {isOutOfStock
                    ? "Out of Stock"
                    : `In Stock — ${currentStock} available`}
                </div>
              )}

            {/* QUANTITY */}

            <div className="quantity-section">

              <span className="quantity-label">
                Quantity
              </span>

              <div className="quantity-control">

                <button
                  type="button"
                  onClick={
                    decreaseQuantity
                  }
                  disabled={quantity <= 1}
                >
                  −
                </button>

                <span>
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={
                    increaseQuantity
                  }
                  disabled={
                    hasStock &&
                    quantity >=
                    currentStock
                  }
                >
                  +
                </button>

              </div>

            </div>

            {/* ACTION BUTTONS */}

            <div className="product-action-buttons">

              <button
                type="button"
                className="detail-add-cart-button"
                onClick={addToCart}
                disabled={isOutOfStock}
              >
                {added
                  ? "✓ Added to Cart"
                  : isOutOfStock
                    ? "Out of Stock"
                    : "Add to Cart"}
              </button>

              <button
                type="button"
                className="buy-now-button"
                disabled={isOutOfStock}
              >
                Buy Now
              </button>

            </div>

            {added && (
              <div className="cart-success-message">
                ✓ Product added to your cart
              </div>
            )}

            {/* DELIVERY */}

            <div className="delivery-info">

              <div className="delivery-item">
                <span>🚚</span>

                <div>
                  <strong>
                    Fast Delivery
                  </strong>

                  <small>
                    Delivery available to
                    your location
                  </small>
                </div>
              </div>

              <div className="delivery-item">
                <span>↩️</span>

                <div>
                  <strong>
                    Easy Returns
                  </strong>

                  <small>
                    Hassle-free return policy
                  </small>
                </div>
              </div>

              <div className="delivery-item">
                <span>🔒</span>

                <div>
                  <strong>
                    Secure Payment
                  </strong>

                  <small>
                    Your payment is protected
                  </small>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* =====================================
            PRODUCT INFORMATION
        ====================================== */}

        <section className="product-information-card">

          <div className="information-section">

            <h2>
              About this product
            </h2>

            <p>
              {product.description ||
                "This product is designed to provide quality, reliability and excellent value."}
            </p>

          </div>

          {/* FEATURES */}

          {Array.isArray(
            product.features
          ) &&
            product.features.length > 0 && (
              <div className="information-section">

                <h2>Key Features</h2>

                <ul className="product-features">
                  {product.features.map(
                    (feature, index) => (
                      <li key={index}>
                        ✓ {feature}
                      </li>
                    )
                  )}
                </ul>

              </div>
            )}

          {/* SPECIFICATIONS */}

          {product.specifications && (
            <div className="information-section">

              <h2>
                Specifications
              </h2>

              <div className="specifications-grid">
                {Object.entries(product.specifications).map(
                  ([name, value]) => {
                    let displayValue = value;

                    if (
                      typeof value === "object" &&
                      value !== null
                    ) {
                      displayValue = Object.values(value).join(" × ");
                    }

                    return (
                      <div
                        className="specification-row"
                        key={name}
                      >
                        <span>
                          {formatOptionName(name)}
                        </span>

                        <strong>
                          {displayValue}
                        </strong>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          )}

          {/* WARRANTY */}

          {product.warranty && (
            <div className="policy-row">
              <strong>
                Warranty
              </strong>

              <span>
                {product.warranty}
              </span>
            </div>
          )}

          {/* RETURN POLICY */}

          {product.returnPolicy && (
            <div className="policy-row">
              <strong>
                Return Policy
              </strong>

              <span>
                {product.returnPolicy}
              </span>
            </div>
          )}

        </section>

        {/* =====================================
            CUSTOMER REVIEWS
        ====================================== */}

        <section className="customer-reviews-section">

          <div className="reviews-title-row">

            <div>
              <span className="section-label">
                CUSTOMER FEEDBACK
              </span>

              <h2>
                Customer Reviews
              </h2>
            </div>

            <button
              type="button"
              className="write-review-button"
              onClick={() => {
                setShowReviewForm(
                  !showReviewForm
                );

                setReviewError("");
                setReviewSuccess("");
              }}
            >
              ✍ Write a Review
            </button>

          </div>

          {/* REVIEW FORM */}

          {showReviewForm && (
            <form
              className="write-review-form"
              onSubmit={submitReview}
            >

              <h3>
                Share your experience
              </h3>

              <div className="review-form-group">

                <label>
                  Your name
                </label>

                <input
                  type="text"
                  value={reviewerName}
                  onChange={(event) =>
                    setReviewerName(
                      event.target.value
                    )
                  }
                  placeholder="Enter your name"
                />

              </div>

              <div className="review-form-group">

                <label>
                  Rating
                </label>

                <div className="review-rating-selector">

                  {[1, 2, 3, 4, 5].map(
                    (star) => (
                      <button
                        key={star}
                        type="button"
                        className={
                          star <=
                            reviewRating
                            ? "rating-star-button selected"
                            : "rating-star-button"
                        }
                        onClick={() =>
                          setReviewRating(
                            star
                          )
                        }
                      >
                        ★
                      </button>
                    )
                  )}

                </div>

              </div>

              <div className="review-form-group">

                <label>
                  Your review
                </label>

                <textarea
                  value={reviewText}
                  onChange={(event) =>
                    setReviewText(
                      event.target.value
                    )
                  }
                  placeholder="What did you think about this product?"
                  maxLength={500}
                  rows={5}
                />

                <div className="review-character-count">
                  {reviewText.length}/500
                </div>

              </div>

              {reviewError && (
                <div className="review-error">
                  {reviewError}
                </div>
              )}

              <div className="review-form-actions">

                <button
                  type="button"
                  className="cancel-review-button"
                  onClick={() =>
                    setShowReviewForm(
                      false
                    )
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="submit-review-button"
                  disabled={
                    reviewSubmitting
                  }
                >
                  {reviewSubmitting
                    ? "Submitting..."
                    : "Submit Review"}
                </button>

              </div>

            </form>
          )}

          {reviewSuccess && (
            <div className="review-success">
              ✓ {reviewSuccess}
            </div>
          )}

          {/* REVIEW SUMMARY */}

          {!reviewsLoading &&
            reviews.length > 0 && (
              <div className="review-summary">

                <div className="average-rating">

                  <div className="average-rating-number">
                    {averageRating.toFixed(
                      1
                    )}
                  </div>

                  <div className="average-rating-stars">
                    {"★".repeat(
                      Math.min(
                        roundedRating,
                        5
                      )
                    )}
                  </div>

                  <div className="average-rating-count">
                    Based on{" "}
                    {reviewCount} reviews
                  </div>

                </div>

                <div className="rating-breakdown">

                  {[5, 4, 3, 2, 1].map(
                    (star) => {
                      const percentage =
                        reviewCount > 0
                          ? (ratingCounts[
                            star
                          ] /
                            reviewCount) *
                          100
                          : 0;

                      return (
                        <div
                          className="rating-breakdown-row"
                          key={star}
                        >

                          <span>
                            {star} ★
                          </span>

                          <div className="rating-bar">
                            <div
                              className="rating-bar-fill"
                              style={{
                                width: `${percentage}%`,
                              }}
                            ></div>
                          </div>

                          <span>
                            {
                              ratingCounts[
                              star
                              ]
                            }
                          </span>

                        </div>
                      );
                    }
                  )}

                </div>

              </div>
            )}

          {/* REVIEWS */}

          {reviewsLoading ? (
            <div className="reviews-loading">
              Loading reviews...
            </div>
          ) : reviews.length === 0 ? (
            <div className="no-reviews">
              <div>
                ★
              </div>

              <h3>
                No reviews yet
              </h3>

              <p>
                Be the first person to review
                this product.
              </p>
            </div>
          ) : (
            <div className="reviews-list">

              {reviews.map((review) => (
                <article
                  className="review-card"
                  key={review.id}
                >

                  <div className="review-card-header">

                    <div className="reviewer-info">

                      <div className="reviewer-avatar">
                        {review.reviewerName
                          ?.charAt(0)
                          ?.toUpperCase()}
                      </div>

                      <div>
                        <strong>
                          {
                            review.reviewerName
                          }
                        </strong>

                        <div className="review-date">
                          {new Date(
                            review.createdAt
                          ).toLocaleDateString()}
                        </div>
                      </div>

                    </div>

                    <div className="review-stars">
                      {"★".repeat(
                        Number(
                          review.rating
                        )
                      )}
                      {"☆".repeat(
                        5 -
                        Number(
                          review.rating
                        )
                      )}
                    </div>

                  </div>

                  <p className="review-text">
                    {review.reviewText}
                  </p>

                </article>
              ))}

            </div>
          )}

        </section>

      </main>
    </div >
  );
}

// =========================================
// HELPER
// =========================================

function formatOptionName(name) {
  return name
    .replace(/([A-Z])/g, " $1")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}