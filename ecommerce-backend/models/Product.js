import { DataTypes } from "sequelize";
import { sequelize } from "./index.js";

export const Product = sequelize.define(
  "Product",
  {
    // =========================================
    // PRODUCT ID
    // =========================================

    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    // =========================================
    // BASIC PRODUCT INFORMATION
    // =========================================

    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    brand: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    subCategory: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // =========================================
    // RATING
    // =========================================

    rating: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    // =========================================
    // PRICE
    // =========================================

    priceCents: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    originalPriceCents: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    discountPercent: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    // =========================================
    // STOCK
    // =========================================

    stock: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },

    // =========================================
    // SEARCH KEYWORDS
    // =========================================

    keywords: {
      type: DataTypes.TEXT,
      allowNull: true,

      get() {
        const value = this.getDataValue("keywords");

        if (!value) {
          return [];
        }

        if (Array.isArray(value)) {
          return value;
        }

        try {
          const parsed = JSON.parse(value);

          if (Array.isArray(parsed)) {
            return parsed;
          }
        } catch (error) {
          // Not JSON, so continue below.
        }

        return value
          .split(",")
          .map((keyword) => keyword.trim())
          .filter(Boolean);
      },

      set(value) {
        if (Array.isArray(value)) {
          this.setDataValue(
            "keywords",
            value.join(",")
          );
        } else {
          this.setDataValue("keywords", value);
        }
      },
    },

    // =========================================
    // MULTIPLE PRODUCT IMAGES
    // =========================================

    images: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    // =========================================
    // PRODUCT FEATURES
    // =========================================

    features: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    // =========================================
    // PRODUCT SPECIFICATIONS
    // =========================================

    specifications: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    // =========================================
    // WARRANTY
    // =========================================

    warranty: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // =========================================
    // RETURN POLICY
    // =========================================

    returnPolicy: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // =========================================
    // PRODUCT VARIANTS
    // =========================================
    /*
      Examples:

      Clothing:
      {
        options: {
          color: "Black",
          size: "M"
        },
        priceCents: 79900,
        stock: 15
      }

      Laptop:
      {
        options: {
          ram: "16 GB",
          storage: "512 GB",
          color: "Black"
        },
        priceCents: 6999900,
        stock: 8
      }
    */

    variants: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    tableName: "Products",
    timestamps: true,
  }
);