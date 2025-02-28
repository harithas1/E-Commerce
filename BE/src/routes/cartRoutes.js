const express = require("express");
const {
  add_to_cart,
  get_cart_items,
  remove_from_cart,
  clear_cart,
} = require("../controller/cartController");

const router = express.Router();

// Add a product to the cart
router.post("/add", add_to_cart);

// Get all items in the cart
router.get("/items", get_cart_items);

// Remove a product from the cart
router.delete("/remove", remove_from_cart);

// Clear the cart
router.delete("/clear", clear_cart);

module.exports = router;


// get all routes with prefix /api/cart with params/query

// 1. add to cart -- method: POST -- endpoint: https://e-commerce-ecuo.onrender.com/api/cart/add -- body: {userId, productId, quantity}

// 2. get cart items -- method: GET -- endpoint: https://e-commerce-ecuo.onrender.com/api/cart/items -- query: {userId}

// 3. remove from cart -- method: DELETE -- endpoint: https://e-commerce-ecuo.onrender.com/api/cart/remove -- body: {userId, productId}

// 4. clear cart -- method: DELETE -- endpoint: https://e-commerce-ecuo.onrender.com/api/cart/clear -- query: {userId}
