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
