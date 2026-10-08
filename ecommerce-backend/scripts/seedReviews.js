import { sequelize } from "../models/index.js";
import { Product } from "../models/Product.js";
import { Review } from "../models/Review.js";


const demoReviews = [
  {
    reviewerName: "Rahul",
    rating: 5,
    reviewText:
            "Very good product. The quality is better than I expected and it feels comfortable to use.",
  },

  {
    reviewerName: "Priya",
    rating: 4,
    reviewText:
            "Good product for the price. The quality is nice and the product looks exactly like the pictures.",
  },

  {
    reviewerName: "Arun",
    rating: 5,
    reviewText:
            "Really happy with this purchase. Good quality, good value and fast delivery.",
  },
];


async function seedReviews() {
  try {

    console.log(
      "Connecting to database..."
    );


    await sequelize.sync();


    console.log(
      "Fetching products..."
    );


    const products =
            await Product.findAll();


    console.log(
      `Found ${products.length} products.`
    );


    let reviewsCreated = 0;


    for (const product of products) {

      /*
                Check whether this product
                already has reviews.
            */

      const existingReviews =
                await Review.count({
                  where: {
                    productId:
                            product.id,
                  },
                });


      /*
                Don't create duplicate
                reviews if the script
                is run again.
            */

      if (existingReviews > 0) {
        continue;
      }


      /*
                Create demo reviews
                for this product.
            */

      for (const demoReview of demoReviews) {

        await Review.create({
          productId:
                        product.id,

          reviewerName:
                        demoReview.reviewerName,

          rating:
                        demoReview.rating,

          reviewText:
                        demoReview.reviewText,
        });


        reviewsCreated++;
      }
    }


    console.log(
      `Successfully created ${reviewsCreated} reviews.`
    );


    const totalReviews =
            await Review.count();


    console.log(
      `Total reviews in database: ${totalReviews}`
    );


  } catch (error) {

    console.error(
      "Review seeding failed:"
    );

    console.error(error);


  } finally {
    await sequelize.close();
  }
}


seedReviews();