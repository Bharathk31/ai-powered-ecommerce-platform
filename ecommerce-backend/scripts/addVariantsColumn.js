import { DataTypes } from "sequelize";
import {
  sequelize,
  saveDatabaseToFile,
} from "../models/index.js";

async function addVariantsColumn() {
  try {
    console.log("Connecting to database...");

    await sequelize.authenticate();

    console.log("Database connected.");

    const queryInterface =
      sequelize.getQueryInterface();

    const tableDescription =
      await queryInterface.describeTable("Products");

    if (tableDescription.variants) {
      console.log(
        "variants column already exists."
      );
    } else {
      console.log(
        "Adding variants column..."
      );

      await queryInterface.addColumn(
        "Products",
        "variants",
        {
          type: DataTypes.JSON,
          allowNull: true,
          defaultValue: null,
        }
      );

      console.log(
        "variants column added successfully."
      );

      // sql.js keeps the database in memory,
      // so explicitly save the updated database.
      await saveDatabaseToFile();

      console.log(
        "Updated database saved to database.sqlite."
      );
    }

    console.log("Migration completed.");

    process.exit(0);
  } catch (error) {
    console.error(
      "Error adding variants column:",
      error
    );

    process.exit(1);
  }
}

addVariantsColumn();