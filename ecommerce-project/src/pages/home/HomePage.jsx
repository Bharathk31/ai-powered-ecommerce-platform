import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Header } from "../../Components/Header.jsx";
import { ProductsGrid } from "./ProductsGrid.jsx";
import "./HomePage.css";

export function HomePage({ cart, setCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getProducts();
  }, []);

  async function getProducts(searchText = "") {
    try {
      setLoading(true);

      const url = searchText
        ? `/api/products?search=${encodeURIComponent(searchText)}`
        : "/api/products";

      const response = await axios.get(url);

      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(searchText) {
    getProducts(searchText);
  }

  const categories = useMemo(() => {
    const categorySet = new Set();

    products.forEach((product) => {
      if (product.category) {
        categorySet.add(product.category);
      }
    });

    return Array.from(categorySet).slice(0, 6);
  }, [products]);

  function handleCategoryClick(category) {
    getProducts(category);
  }

  function scrollToProducts() {
    document
      .getElementById("featured-products")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  }

  return (
    <div className="storefront">
      <Header cart={cart} onSearch={handleSearch} />

      <main>
        {/* HERO SECTION */}
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-badge">
              ✨ Smart Shopping Experience
            </div>

            <h1>
              Shop smarter.
              <br />
              <span>Live better.</span>
            </h1>

            <p>
              Discover quality products, great prices and
              everything you need — all in one place.
            </p>

            <div className="hero-buttons">
              <button
                className="hero-primary-button"
                onClick={scrollToProducts}
              >
                Explore Products
                <span>→</span>
              </button>

              <button
                className="hero-secondary-button"
                onClick={() => getProducts()}
              >
                View All Products
              </button>
            </div>

            <div className="hero-stats">
              <div>
                <strong>{products.length}+</strong>
                <span>Products</span>
              </div>

              <div className="hero-stat-divider"></div>

              <div>
                <strong>4.5★</strong>
                <span>Average Rating</span>
              </div>

              <div className="hero-stat-divider"></div>

              <div>
                <strong>24/7</strong>
                <span>Shopping</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-glow"></div>

            <div className="hero-card hero-card-main">
              <div className="hero-card-icon">🛍️</div>
              <span>Premium Shopping</span>
              <strong>Made Simple</strong>
            </div>

            <div className="hero-floating-card hero-floating-card-top">
              <span>⭐</span>
              <div>
                <strong>Top Rated</strong>
                <small>Customer favorites</small>
              </div>
            </div>

            <div className="hero-floating-card hero-floating-card-bottom">
              <span>🚚</span>
              <div>
                <strong>Fast Delivery</strong>
                <small>Delivered to your door</small>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST STRIP */}
        <section className="trust-section">
          <div className="trust-item">
            <div className="trust-icon">🚚</div>
            <div>
              <strong>Fast Delivery</strong>
              <span>Quick and reliable shipping</span>
            </div>
          </div>

          <div className="trust-item">
            <div className="trust-icon">🔒</div>
            <div>
              <strong>Secure Payments</strong>
              <span>Your payment is protected</span>
            </div>
          </div>

          <div className="trust-item">
            <div className="trust-icon">↩️</div>
            <div>
              <strong>Easy Returns</strong>
              <span>Simple return process</span>
            </div>
          </div>

          <div className="trust-item">
            <div className="trust-icon">⭐</div>
            <div>
              <strong>Trusted Products</strong>
              <span>Rated by real customers</span>
            </div>
          </div>
        </section>

        {/* CATEGORIES */}
        {!loading && categories.length > 0 && (
          <section className="categories-section">
            <div className="section-heading">
              <div>
                <span className="section-label">
                  DISCOVER
                </span>

                <h2>Shop by Category</h2>

                <p>
                  Find exactly what you're looking for.
                </p>
              </div>
            </div>

            <div className="category-list">
              {categories.map((category, index) => (
                <button
                  key={category}
                  className="category-card"
                  onClick={() =>
                    handleCategoryClick(category)
                  }
                >
                  <div className={`category-icon category-icon-${index}`}>
                    {getCategoryIcon(category)}
                  </div>

                  <span>{formatCategory(category)}</span>

                  <small>Explore →</small>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* PRODUCTS */}
        <section
          className="products-section"
          id="featured-products"
        >
          <div className="section-heading products-heading">
            <div>
              <span className="section-label">
                OUR COLLECTION
              </span>

              <h2>
                {loading
                  ? "Finding products..."
                  : "Featured Products"}
              </h2>

              <p>
                Explore our collection and find something
                you'll love.
              </p>
            </div>

            {!loading && products.length > 0 && (
              <div className="products-count">
                {products.length} products
              </div>
            )}
          </div>

          {loading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Finding the best products for you...</p>
            </div>
          )}

          {!loading && products.length === 0 && (
            <div className="no-products">
              <div className="no-products-icon">🔍</div>

              <h2>No products found</h2>

              <p>
                Try searching for another product or
                category.
              </p>

              <button
                onClick={() => getProducts()}
                className="reset-search-button"
              >
                View All Products
              </button>
            </div>
          )}

          {!loading && products.length > 0 && (
            <ProductsGrid
              products={products}
              cart={cart}
              setCart={setCart}
            />
          )}
        </section>
      </main>
    </div>
  );
}

function formatCategory(category) {
  return category
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function getCategoryIcon(category) {
  const value = category.toLowerCase();

  if (
    value.includes("electronic") ||
    value.includes("laptop") ||
    value.includes("phone")
  ) {
    return "💻";
  }

  if (
    value.includes("beauty") ||
    value.includes("skin") ||
    value.includes("fragrance")
  ) {
    return "✨";
  }

  if (
    value.includes("furniture") ||
    value.includes("home")
  ) {
    return "🛋️";
  }

  if (
    value.includes("cloth") ||
    value.includes("fashion") ||
    value.includes("shirt") ||
    value.includes("shoe")
  ) {
    return "👕";
  }

  if (
    value.includes("sport") ||
    value.includes("fitness")
  ) {
    return "⚽";
  }

  if (
    value.includes("food") ||
    value.includes("grocery")
  ) {
    return "🍎";
  }

  return "🛍️";
}