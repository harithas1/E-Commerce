const express = require("express");
const {
  register_user,
  verify_email,
  login_user,
  add_review,
  create_order,
  get_all_products,
  get_Home_Page_Products,
  get_Filtered_Products,
} = require("../controller/userController");

const router = express.Router();

// Authentication Routes
router.post("/register", register_user);
router.get("/verify-email", verify_email);
router.post("/login", login_user);

// Review and Order Routes
router.post("/reviews", add_review); // Add a review
router.post("/orders", create_order); // Create an order

// Product Routes
router.get("/products", get_all_products);


// get home product
router.get("/homeproducts", get_Home_Page_Products);


// filter
router.get("/filter", get_Filtered_Products);

module.exports = router;
