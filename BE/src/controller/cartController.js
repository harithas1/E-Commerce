const cartService = require("../services/cartService");

// Controller to add a product to the cart
const add_to_cart = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    const cartItem = await cartService.addToCart({
      userId,
      productId,
      quantity,
    });
    res.json(cartItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to get all items in the cart for a user
const get_cart_items = async (req, res) => {
  const { userId } = req.params;

  try {
    const cartItems = await cartService.getCartItems(userId);
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to remove a product from the cart
const remove_from_cart = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const response = await cartService.removeFromCart({ userId, productId });
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to clear all items in the cart for a user
const clear_cart = async (req, res) => {
  const { userId } = req.body;

  try {
    const response = await cartService.clearCart(userId);
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  add_to_cart,
  get_cart_items,
  remove_from_cart,
  clear_cart,
};
