const productService = require("../services/productService");

// Controller for adding a product
const add_product = async (req, res) => {
  try {
    const { sellerId, title, description, categoryId, price, stock, image } =
      req.body;

    // Call productService to handle the database logic
    const newProduct = await productService.addProduct({
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
    const updatedProduct = await productService.updateProduct({
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
    await productService.deleteProduct(productId);

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
    const products = await productService.listProductsBySeller(sellerId);

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
    const newCategory = await productService.addCategory(name);

    return res.status(201).json(newCategory); // Return the newly created category
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong!" });
  }
};

// Controller for getting all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await productService.getAllCategories();
    return res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong!" });
  }
};

module.exports = { add_product, update_product, delete_product, list_products, add_category, getAllCategories };
