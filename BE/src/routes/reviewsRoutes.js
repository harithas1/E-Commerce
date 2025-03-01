const express = require("express");
const { add_review,
  get_reviews_by_product,
  get_reviews_by_user} = require("../controller/reviewsController");

const router = express.Router();

// Add a review
router.post("/add", add_review);

// Get reviews for a product
router.get("/product/:productId", get_reviews_by_product);

// Get reviews for a user
router.get("/user/:userId", get_reviews_by_user);

module.exports = router;

// get all routes with prefix /api/reviews with params/query

// 1. add review -- method: POST -- endpoint: https://e-commerce-ecuo.onrender.com/api/reviews/add -- body: {userId, productId, rating, comment}


// 2. get reviews by product -- method: GET -- endpoint: https://e-commerce-ecuo.onrender.com/api/reviews/product/:productId -- params: {productId}
// example: https://e-commerce-ecuo.onrender.com/api/reviews/product/123

// 3. get reviews by user -- method: GET -- endpoint: https://e-commerce-ecuo.onrender.com/api/reviews/user/:userId -- params: {userId}
