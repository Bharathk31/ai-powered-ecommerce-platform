import { useState } from "react";
import { Link } from "react-router";
import "./header.css";

export function Header({ cart, onSearch }) {
    const [searchText, setSearchText] = useState("");

    let totalQuantity = 0;

    cart.forEach((cartItem) => {
        totalQuantity += cartItem.quantity;
    });

    function handleSearch() {
        onSearch(searchText);
    }

    function handleKeyDown(event) {
        if (event.key === "Enter") {
            handleSearch();
        }
    }

    return (
        <div className="header">

            {/* Left section */}
            <div className="left-section">
                <Link to="/" className="header-link logo-container">
                    <img
                        className="brand-logo"
                        src="/images/bharath-logo.png"
                        alt="Bharath logo"
                    />
                </Link>
            </div>

            {/* Middle section */}
            <div className="middle-section">
                <input
                    className="search-bar"
                    type="text"
                    placeholder="Search products..."
                    value={searchText}
                    onChange={(event) =>
                        setSearchText(event.target.value)
                    }
                    onKeyDown={handleKeyDown}
                />

                <button
                    className="search-button"
                    onClick={handleSearch}
                >
                    <img
                        className="search-icon"
                        src="/images/icons/search-icon.png"
                        alt="Search"
                    />
                </button>
            </div>

            {/* Right section */}
            <div className="right-section">

                <Link
                    className="orders-link header-link"
                    to="/orders"
                >
                    <span className="orders-text">
                        Orders
                    </span>
                </Link>

                <Link
                    className="cart-link header-link"
                    to="/checkout"
                >
                    <img
                        className="cart-icon"
                        src="/images/icons/cart-icon.png"
                        alt="Cart"
                    />

                    <div className="cart-quantity">
                        {totalQuantity}
                    </div>

                    <div className="cart-text">
                        Cart
                    </div>
                </Link>

            </div>
        </div>
    );
}