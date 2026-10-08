import { Product } from "../models/Product.js";
import { sequelize } from "../models/index.js";

function createVariant(options, priceCents, stock) {
  return {
    options,
    priceCents,
    stock,
  };
}

function getVariantsForProduct(product) {
  const category = (
    product.category || ""
  ).toLowerCase();

  const subCategory = (
    product.subCategory || ""
  ).toLowerCase();

  const basePrice = product.priceCents || 0;
  const baseStock =
    product.stock !== null &&
    product.stock !== undefined
      ? product.stock
      : 10;

  // =========================================
  // CLOTHING
  // =========================================

  if (
    category.includes("shirt") ||
    category.includes("tops") ||
    category.includes("dress") ||
    category.includes("clothing")
  ) {
    return [
      createVariant(
        {
          color: "Black",
          size: "S",
        },
        basePrice,
        Math.max(baseStock, 5)
      ),

      createVariant(
        {
          color: "Black",
          size: "M",
        },
        basePrice,
        Math.max(baseStock, 8)
      ),

      createVariant(
        {
          color: "Black",
          size: "L",
        },
        basePrice,
        Math.max(baseStock, 6)
      ),

      createVariant(
        {
          color: "White",
          size: "M",
        },
        basePrice,
        Math.max(baseStock, 7)
      ),

      createVariant(
        {
          color: "Blue",
          size: "L",
        },
        basePrice,
        Math.max(baseStock, 4)
      ),
    ];
  }

  // =========================================
  // SHOES
  // =========================================

  if (
    category.includes("shoes") ||
    category.includes("shoe")
  ) {
    return [
      createVariant(
        {
          color: "Black",
          size: "7",
        },
        basePrice,
        Math.max(baseStock, 5)
      ),

      createVariant(
        {
          color: "Black",
          size: "8",
        },
        basePrice,
        Math.max(baseStock, 8)
      ),

      createVariant(
        {
          color: "Black",
          size: "9",
        },
        basePrice,
        Math.max(baseStock, 6)
      ),

      createVariant(
        {
          color: "White",
          size: "8",
        },
        basePrice,
        Math.max(baseStock, 5)
      ),

      createVariant(
        {
          color: "Blue",
          size: "9",
        },
        basePrice,
        Math.max(baseStock, 4)
      ),
    ];
  }

  // =========================================
  // SMARTPHONES
  // =========================================

  if (
    category.includes("smartphone") ||
    category.includes("mobile")
  ) {
    return [
      createVariant(
        {
          color: "Black",
          ram: "8 GB",
          storage: "128 GB",
        },
        basePrice,
        Math.max(baseStock, 5)
      ),

      createVariant(
        {
          color: "Black",
          ram: "8 GB",
          storage: "256 GB",
        },
        basePrice + 5000,
        Math.max(baseStock, 4)
      ),

      createVariant(
        {
          color: "Blue",
          ram: "12 GB",
          storage: "256 GB",
        },
        basePrice + 10000,
        Math.max(baseStock, 3)
      ),

      createVariant(
        {
          color: "Silver",
          ram: "12 GB",
          storage: "512 GB",
        },
        basePrice + 15000,
        Math.max(baseStock, 2)
      ),
    ];
  }

  // =========================================
  // LAPTOPS
  // =========================================

  if (category.includes("laptop")) {
    return [
      createVariant(
        {
          color: "Black",
          ram: "8 GB",
          storage: "512 GB",
        },
        basePrice,
        Math.max(baseStock, 5)
      ),

      createVariant(
        {
          color: "Black",
          ram: "16 GB",
          storage: "512 GB",
        },
        basePrice + 10000,
        Math.max(baseStock, 4)
      ),

      createVariant(
        {
          color: "Silver",
          ram: "16 GB",
          storage: "1 TB",
        },
        basePrice + 20000,
        Math.max(baseStock, 3)
      ),

      createVariant(
        {
          color: "Gray",
          ram: "32 GB",
          storage: "1 TB",
        },
        basePrice + 35000,
        Math.max(baseStock, 2)
      ),
    ];
  }

  // =========================================
  // TABLETS
  // =========================================

  if (category.includes("tablet")) {
    return [
      createVariant(
        {
          color: "Black",
          storage: "128 GB",
        },
        basePrice,
        Math.max(baseStock, 5)
      ),

      createVariant(
        {
          color: "Silver",
          storage: "256 GB",
        },
        basePrice + 5000,
        Math.max(baseStock, 4)
      ),

      createVariant(
        {
          color: "Blue",
          storage: "512 GB",
        },
        basePrice + 10000,
        Math.max(baseStock, 3)
      ),
    ];
  }

  // =========================================
  // FURNITURE
  // =========================================

  if (
    category.includes("furniture") ||
    category.includes("home-decoration")
  ) {
    return [
      createVariant(
        {
          color: "Brown",
          material: "Wood",
        },
        basePrice,
        Math.max(baseStock, 5)
      ),

      createVariant(
        {
          color: "Black",
          material: "Wood",
        },
        basePrice,
        Math.max(baseStock, 4)
      ),

      createVariant(
        {
          color: "White",
          material: "Metal",
        },
        basePrice + 5000,
        Math.max(baseStock, 3)
      ),
    ];
  }

  // =========================================
  // FRAGRANCES
  // =========================================

  if (
    category.includes("fragrance") ||
    category.includes("perfume")
  ) {
    return [
      createVariant(
        {
          volume: "30 ml",
        },
        basePrice,
        Math.max(baseStock, 8)
      ),

      createVariant(
        {
          volume: "50 ml",
        },
        basePrice + 5000,
        Math.max(baseStock, 6)
      ),

      createVariant(
        {
          volume: "100 ml",
        },
        basePrice + 10000,
        Math.max(baseStock, 4)
      ),
    ];
  }

  // =========================================
  // BEAUTY / SKINCARE
  // =========================================

  if (
    category.includes("beauty") ||
    category.includes("skin")
  ) {
    return [
      createVariant(
        {
          size: "50 ml",
        },
        basePrice,
        Math.max(baseStock, 8)
      ),

      createVariant(
        {
          size: "100 ml",
        },
        basePrice + 5000,
        Math.max(baseStock, 6)
      ),

      createVariant(
        {
          size: "200 ml",
        },
        basePrice + 10000,
        Math.max(baseStock, 4)
      ),
    ];
  }

  // =========================================
  // SUNGLASSES
  // =========================================

  if (category.includes("sunglass")) {
    return [
      createVariant(
        {
          color: "Black",
        },
        basePrice,
        Math.max(baseStock, 7)
      ),

      createVariant(
        {
          color: "Brown",
        },
        basePrice,
        Math.max(baseStock, 5)
      ),

      createVariant(
        {
          color: "Blue",
        },
        basePrice + 500,
        Math.max(baseStock, 4)
      ),
    ];
  }

  // =========================================
  // WATCHES
  // =========================================

  if (category.includes("watch")) {
    return [
      createVariant(
        {
          color: "Black",
        },
        basePrice,
        Math.max(baseStock, 6)
      ),

      createVariant(
        {
          color: "Silver",
        },
        basePrice + 1000,
        Math.max(baseStock, 5)
      ),

      createVariant(
        {
          color: "Gold",
        },
        basePrice + 2000,
        Math.max(baseStock, 3)
      ),
    ];
  }

  // =========================================
  // NO VARIANTS FOR THIS PRODUCT
  // =========================================

  return null;
}

async function seedVariants() {
  try {
    console.log("Connecting to database...");

    await sequelize.authenticate();

    console.log("Connected to database.");

    const products = await Product.findAll();

    console.log(
      `Found ${products.length} products.`
    );

    let updatedProducts = 0;
    let productsWithoutVariants = 0;

    for (const product of products) {
      const variants =
        getVariantsForProduct(product);

      if (!variants) {
        productsWithoutVariants++;
        continue;
      }

      product.variants = variants;

      await product.save();

      updatedProducts++;

      console.log(
        `Added variants: ${product.name}`
      );
    }

    console.log("");
    console.log(
      `Products updated: ${updatedProducts}`
    );

    console.log(
      `Products without variants: ${productsWithoutVariants}`
    );

    console.log("Variant seeding completed.");

    process.exit(0);
  } catch (error) {
    console.error(
      "Error seeding variants:",
      error
    );

    process.exit(1);
  }
}

seedVariants();