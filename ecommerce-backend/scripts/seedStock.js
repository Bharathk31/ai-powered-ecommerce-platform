import { sequelize } from "../models/index.js";
import { Product } from "../models/Product.js";

async function seedStock() {
  try {
    console.log("Connecting to database...");

    await sequelize.sync();

    const products = await Product.findAll();

    console.log(`Found ${products.length} products.`);

    for (const product of products) {
      const stock = Math.floor(Math.random() * 46) + 5;

      await product.update({
        stock,
      });

      console.log(
        `${product.name} -> stock: ${stock}`
      );
    }

    console.log("Stock updated successfully.");
  } catch (error) {
    console.error("Failed to seed stock:");
    console.error(error);
  } finally {
    await sequelize.close();
  }
}

seedStock();