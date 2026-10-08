import { sequelize } from "../models/index.js";
import { Product } from "../models/Product.js";

async function importProducts() {
  try {
    console.log("Connecting to database...");

    await sequelize.sync();

    console.log("Fetching products from DummyJSON...");

    const response = await fetch(
      "https://dummyjson.com/products?limit=94&skip=100"
    );
    if (!response.ok) {
      throw new Error(
        `DummyJSON request failed: ${response.status}`
      );
    }

    const data = await response.json();

    console.log(
      `Received ${data.products.length} products.`
    );

    const productsToImport = data.products.map((product) => {
      return {
        name: product.title,

        description: product.description,

        brand: product.brand || null,

        category: product.category || null,

        subCategory: null,

        image: product.thumbnail,

        images: product.images || [],

        rating: {
          stars: product.rating,
          count: 0
        },

        priceCents: Math.round(product.price * 100),

        originalPriceCents: Math.round(
          product.price *
                    (1 + product.discountPercentage / 100) *
                    100
        ),

        discountPercent: product.discountPercentage,

        stock: product.stock,

        keywords: [
          product.category,
          product.brand,
          product.title
        ].filter(Boolean),

        features: [],

        specifications: {
          sku: product.sku || null,
          weight: product.weight || null,
          dimensions: product.dimensions || null
        },

        warranty: product.warrantyInformation || null,

        returnPolicy: product.returnPolicy || null
      };
    });

    console.log("Importing products into database...");

    await Product.bulkCreate(productsToImport);

    console.log(
      `Successfully imported ${productsToImport.length} products.`
    );

    const totalProducts = await Product.count();

    console.log(
      `Total products in database: ${totalProducts}`
    );

  } catch (error) {
    console.error("Product import failed:");
    console.error(error);

  } finally {
    await sequelize.close();
  }
}

importProducts();