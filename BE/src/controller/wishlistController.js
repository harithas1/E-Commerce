const { addToWishlist, removeFromWishlist, getWishlist } = require("../services/wishlistService");

const add_to_wishlist = async (req, res) => {
  try {
    const wishlist = await addToWishlist(
      req.params.userId,
      req.params.productId
    );
    res.status(201).json(wishlist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Controller to remove a product from the wishlist

const remove_from_wishlist = async (req, res) => {
  try {
    const wishlist = await removeFromWishlist(
      req.params.userId,
      req.params.productId
    );
    res.status(200).json(wishlist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Controller to get the wishlist for a user

const get_wishlist = async (req, res) => {
  try {
    const wishlist = await getWishlist(req.params.userId);
    res.status(200).json(wishlist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};







module.exports = {
  add_to_wishlist,
  remove_from_wishlist,
  get_wishlist
};
