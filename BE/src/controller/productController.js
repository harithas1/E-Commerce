const {
  addProduct,
  updateProduct,
  deleteProduct,
  listProductsBySeller,
  addCategory,
  getAllCategories,
  productById,
  getAllProducts,
  getHomePageProducts,
  filterProducts,
} = require("../services/productService");

// Controller for adding a product
const add_product = async (req, res) => {
  try {
    const { sellerId, title, description, categoryId, price, stock, image } =
      req.body;

    // Call productService to handle the database logic
    const newProduct = await addProduct({
      sellerId,
      title,
      description,
      categoryId,
      price,
      stock,
      image,
    });

    return res.status(201).json(newProduct); // Return the newly created product
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong!" });
  }
};

// Controller for updating a product
const update_product = async (req, res) => {
  try {
    const { productId, title, description, price, stock, image } = req.body;

    // Calling productService to update the product
    const updatedProduct = await updateProduct({
      productId,
      title,
      description,
      price,
      stock,
      image,
    });

    return res.status(200).json(updatedProduct); // Returns updated product
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong!" });
  }
};

// Controller for deleting a product
const delete_product = async (req, res) => {
  try {
    const { productId } = req.body;

    // Call productService to delete the product
    await deleteProduct(productId);

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong!" });
  }
};

// Controller for listing products by sellerId
const list_products = async (req, res) => {
  try {
    const { sellerId } = req.query;

    // Call productService to list products for a seller
    const products = await listProductsBySeller(sellerId);

    return res.status(200).json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong!" });
  }
};

// Controller for adding a category
const add_category = async (req, res) => {
  try {
    const { name } = req.body;

    // Call productService to add a category
    const newCategory = await addCategory(name);

    return res.status(201).json(newCategory); // Return the newly created category
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong!" });
  }
};

// Controller for getting all categories
const get_all_categories = async (req, res) => {
  try {
    const categories = await getAllCategories();
    return res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong!" });
  }
};

const product_by_id = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }
    const product = await productById(parseInt(productId));
    return res.status(200).json(product);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong!" });
  }
};

const getAllProductsController = async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query; // Extract page and pageSize from query params

  try {
    const products = await getAllProducts(
      parseInt(page),
      parseInt(pageSize)
    );
    res.json(products);
  } catch (error) {
    console.error("Error in getAllProductsController:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

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
      sortBy = "price",
      order = "asc",
      page = 1,
      pageSize = 10,
    } = req.query;

    const parsedPage = parseInt(page, 10);
    const parsedPageSize = parseInt(pageSize, 10);

    const products = await filterProducts({
      categoryId,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      sortBy,
      order: order.toLowerCase() === "desc" ? "desc" : "asc", // Ensure valid sorting order
      page: parsedPage > 0 ? parsedPage : 1,
      pageSize: parsedPageSize > 0 ? parsedPageSize : 10,
    });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch filtered products" });
  }
};

module.exports = {
  add_product,
  update_product,
  delete_product,
  list_products,
  add_category,
  get_all_categories,
  product_by_id,
  getAllProductsController,
  get_Home_Page_Products,
  get_Filtered_Products,
};
