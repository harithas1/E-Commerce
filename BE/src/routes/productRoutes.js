const express = require("express");
const {
  add_product,
  update_product,
  delete_product,
  list_products,
  add_category,
  get_all_categories,
  product_by_id,
  // getAllProductsController,
  get_Home_Page_Products,
  get_Filtered_Products
} = require("../controller/productController");

const router = express.Router();

// Seller adds a product
router.post("/add", add_product);

// Seller updates an existing product
router.put("/update", update_product);

// Seller deletes a product
router.delete("/delete", delete_product);

// List all products of a seller
router.get("/list", list_products);

// Add a new category
router.post("/add-category", add_category);

// Get all categories
router.get("/category-list", get_all_categories);

// Get a product by ID
router.get("/:productId", product_by_id);


// router.get("/", getAllProductsController);


// get_Home_Page_Products
router.get("/home", get_Home_Page_Products);


// get_Filtered_Products
router.get("/filter", get_Filtered_Products);

module.exports = router;
