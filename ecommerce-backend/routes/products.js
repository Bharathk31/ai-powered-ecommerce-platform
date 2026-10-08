import express from "express";
import { Product } from "../models/Product.js";
import { Review } from "../models/Review.js";

const router = express.Router();


/*
    ==========================================
    CREATE REVIEW SUMMARY
    ==========================================

    We fetch all review ratings once and
    calculate the average/count for each product.
*/

async function getReviewSummaries() {

  const reviews = await Review.findAll({
    attributes: [
      "productId",
      "rating",
    ],

    raw: true,
  });


  const summaryMap = {};


  reviews.forEach((review) => {

    const productId =
            review.productId;


    if (!summaryMap[productId]) {

      summaryMap[productId] = {
        totalRating: 0,
        reviewCount: 0,
      };
    }


    summaryMap[productId].totalRating +=
            Number(review.rating);


    summaryMap[productId].reviewCount +=
            1;
  });


  Object.keys(summaryMap).forEach(
    (productId) => {

      const summary =
                summaryMap[productId];


      summary.averageRating =
                summary.totalRating /
                summary.reviewCount;
    }
  );


  return summaryMap;
}


/*
    ==========================================
    GET ALL PRODUCTS
    ==========================================

    GET /api/products

    GET /api/products?search=phone
*/

router.get("/", async (req, res) => {

  try {

    const search =
            req.query.search
              ?.trim()
              .toLowerCase();


    /*
            Get products
        */

    let products =
            await Product.findAll();


    /*
            Search products
        */

    if (search) {

      products =
                products.filter(
                  (product) => {

                    const name =
                            product.name
                              ?.toLowerCase() ||
                            "";

                    const brand =
                            product.brand
                              ?.toLowerCase() ||
                            "";

                    const category =
                            product.category
                              ?.toLowerCase() ||
                            "";

                    const subCategory =
                            product.subCategory
                              ?.toLowerCase() ||
                            "";

                    const description =
                            product.description
                              ?.toLowerCase() ||
                            "";

                    const keywords =
                            Array.isArray(
                              product.keywords
                            )
                              ? product.keywords
                              : [];


                    const keywordMatch =
                            keywords.some(
                              (keyword) =>
                                keyword
                                  .toLowerCase()
                                  .includes(
                                    search
                                  )
                            );


                    return (
                      name.includes(search) ||
                            brand.includes(search) ||
                            category.includes(search) ||
                            subCategory.includes(search) ||
                            description.includes(search) ||
                            keywordMatch
                    );
                  }
                );
    }


    /*
            Get real review summaries
        */

    const reviewSummaries =
            await getReviewSummaries();


    /*
            Add review information
            to every product
        */

    const productsWithReviews =
            products.map((product) => {

              const productData =
                    product.toJSON();


              const summary =
                    reviewSummaries[
                      product.id
                    ];


              if (summary) {

                return {

                  ...productData,

                  reviewSummary: {

                    averageRating:
                                Number(
                                  summary.averageRating.toFixed(
                                    1
                                  )
                                ),

                    reviewCount:
                                summary.reviewCount,

                  },

                };

              }


              /*
                    Product has no reviews yet
                */

              return {

                ...productData,

                reviewSummary: {

                  averageRating: null,

                  reviewCount: 0,

                },

              };

            });


    res.json(productsWithReviews);

  } catch (error) {

    console.error(
      "Error fetching products:",
      error
    );


    res.status(500).json({

      error:
                "Failed to fetch products",

    });

  }

});


/*
    ==========================================
    GET SINGLE PRODUCT
    ==========================================

    GET /api/products/:id
*/

router.get("/:id", async (req, res) => {

  try {

    const product =
            await Product.findByPk(
              req.params.id
            );


    if (!product) {

      return res.status(404).json({

        error:
                    "Product not found",

      });

    }


    /*
            Get review summary for this
            particular product.
        */

    const reviews =
            await Review.findAll({

              where: {
                productId:
                        req.params.id,
              },

              attributes: [
                "rating",
              ],

              raw: true,

            });


    let averageRating = null;


    if (reviews.length > 0) {

      const totalRating =
                reviews.reduce(
                  (total, review) =>
                    total +
                        Number(
                          review.rating
                        ),

                  0
                );


      averageRating =
                Number(
                  (
                    totalRating /
                        reviews.length
                  ).toFixed(1)
                );
    }


    res.json({

      ...product.toJSON(),

      reviewSummary: {

        averageRating,

        reviewCount:
                    reviews.length,

      },

    });

  } catch (error) {

    console.error(
      "Error fetching product:",
      error
    );


    res.status(500).json({

      error:
                "Failed to fetch product",

    });

  }

});


export default router;