import express from "express";
import { Review } from "../models/Review.js";

const router = express.Router();


/*
    ==========================================
    GET REVIEWS
    ==========================================

    Example:

    GET /api/reviews?productId=PRODUCT_ID
*/

router.get("/", async (req, res) => {
  try {

    const { productId } = req.query;


    if (!productId) {
      return res.status(400).json({
        error: "productId is required",
      });
    }


    const reviews = await Review.findAll({
      where: {
        productId,
      },

      order: [
        ["createdAt", "DESC"],
      ],
    });


    res.json(reviews);

  } catch (error) {

    console.error(
      "Error fetching reviews:",
      error
    );

    res.status(500).json({
      error: "Failed to fetch reviews",
    });
  }
});


/*
    ==========================================
    CREATE REVIEW
    ==========================================

    POST /api/reviews

    Body:

    {
        "productId": "...",
        "reviewerName": "Bharath",
        "rating": 5,
        "reviewText": "Very good product."
    }
*/

router.post("/", async (req, res) => {
  try {

    const {
      productId,
      reviewerName,
      rating,
      reviewText,
    } = req.body;


    /*
            Validate product ID
        */

    if (!productId) {
      return res.status(400).json({
        error: "Product ID is required",
      });
    }


    /*
            Validate reviewer name
        */

    if (
      !reviewerName ||
            !reviewerName.trim()
    ) {
      return res.status(400).json({
        error: "Reviewer name is required",
      });
    }


    /*
            Validate rating
        */

    const numericRating =
            Number(rating);


    if (
      !Number.isInteger(
        numericRating
      ) ||
            numericRating < 1 ||
            numericRating > 5
    ) {
      return res.status(400).json({
        error:
                    "Rating must be between 1 and 5",
      });
    }


    /*
            Validate review text
        */

    if (
      !reviewText ||
            !reviewText.trim()
    ) {
      return res.status(400).json({
        error:
                    "Review comment is required",
      });
    }


    /*
            Create review
        */

    const review =
            await Review.create({

              productId,

              reviewerName:
                    reviewerName.trim(),

              rating:
                    numericRating,

              reviewText:
                    reviewText.trim(),

            });


    /*
            Return newly created review
        */

    res.status(201).json(review);

  } catch (error) {

    console.error(
      "Error creating review:",
      error
    );

    res.status(500).json({
      error: "Failed to create review",
    });
  }
});


export default router;