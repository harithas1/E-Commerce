const {createReview,
  getReviewsByProduct,
  getReviewsByUser} = require("../services/reviewsService");

const add_review = async (req, res) => {
  try {
    const review = await createReview(req.body);
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const get_reviews_by_product = async (req, res) => {
  try {
    const productId = parseInt(req.params.productId); // Convert to integer

    if (isNaN(productId)) {
      return res
        .status(400)
        .json({ error: "Invalid productId. Must be a number." });
    }

    const reviews = await getReviewsByProduct(productId);
    res.status(200).json(reviews);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const get_reviews_by_user = async (req, res) => {
  try {
    const reviews = await getReviewsByUser(req.params.userId);
    res.status(200).json(reviews);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  add_review,
  get_reviews_by_product,
  get_reviews_by_user,
};