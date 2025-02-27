const {
  registerUser,
  verifyEmail,
  loginUser,
  createReview,
  createOrder,
  getAllProducts,
  getHomePageProducts,
  filterProducts,
} = require("../services/userService");

const register_user = async (req, res) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const verify_email = async (req, res) => {
  try {
    const response = await verifyEmail(req.query.token);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login_user = async (req, res) => {
  try {
    const user = await loginUser(req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// New controller for creating a review
const add_review = async (req, res) => {
  try {
    const review = await createReview(req.body);
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// New controller for creating an order
const create_order = async (req, res) => {
  try {
    const order = await createOrder(req.body);
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// get all products
const get_all_products = async (req, res) => {
  try {
    const { limit, skip, search, categoryId } = req.query;
    const result = await getAllProducts({ limit, skip, search, categoryId });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};




// get home page products

const get_Home_Page_Products = async (req, res) => {
  console.log("Fetching home page products...");
  try {
    const limit = parseInt(req.query.limit) || 10; // Default limit is 10
    const products = await getHomePageProducts(limit);

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching home page products:", error);
    res.status(500).json({ error: "Failed to fetch home page products" });
  }
};




const get_Filtered_Products = async (req, res) => {
  try {
    const {
      categoryId,
      minPrice,
      maxPrice,
      search, // Add the search parameter
      sortBy = "price",
      order = "asc",
      page = 1,
      pageSize = 10,
    } = req.query;

    // Parse page and pageSize to integers, fall back to default values if necessary
    const parsedPage = parseInt(page, 10);
    const parsedPageSize = parseInt(pageSize, 10);

    // Validate that page and pageSize are positive numbers
    if (parsedPage <= 0 || parsedPageSize <= 0) {
      return res
        .status(400)
        .json({ message: "Page and pageSize must be positive integers" });
    }

    // Convert minPrice and maxPrice to float if they are provided
    const parsedMinPrice = minPrice ? parseFloat(minPrice) : undefined;
    const parsedMaxPrice = maxPrice ? parseFloat(maxPrice) : undefined;

    // Call the filterProducts function from the service layer
    const products = await filterProducts({
      categoryId: categoryId ? parseInt(categoryId, 10) : undefined, // Ensure categoryId is parsed to Int
      minPrice: parsedMinPrice,
      maxPrice: parsedMaxPrice,
      search, // Pass the search parameter to filterProducts
      sortBy,
      order: order.toLowerCase() === "desc" ? "desc" : "asc", // Ensure valid sorting order
      page: parsedPage,
      pageSize: parsedPageSize,
    });

    // Send the filtered products in the response
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching filtered products:", error);
    res.status(500).json({ message: "Failed to fetch filtered products" });
  }
};



module.exports = {
  register_user,
  verify_email,
  login_user,
  add_review,
  create_order,
  get_all_products,
  get_Home_Page_Products,
  get_Filtered_Products,
};
