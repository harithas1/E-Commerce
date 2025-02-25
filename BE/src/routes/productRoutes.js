const express = require("express");
const {
  add_product,
  update_product,
  delete_product,
  list_products,
  add_category,
  get_all_categories,
  get_product_by_id,
  getAllProductsController,
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
router.get("/:id", get_product_by_id);


router.get("/", getAllProductsController);



module.exports = router;
