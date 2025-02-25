const prisma = require("../prisma/prismaClient");

// Service to add a new product
const addProduct = async ({
  sellerId,
  title,
  description,
  categoryId,
  price,
  stock,
  image,
}) => {
  // Check if the category exists
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  // Create and return the new product
  const newProduct = await prisma.product.create({
    data: {
      sellerId,
      title,
      description,
      categoryId,
      price,
      stock,
      image,
    },
  });

  return newProduct;
};

// Service to update an existing product
const updateProduct = async ({
  productId,
  title,
  description,
  price,
  stock,
  image,
}) => {
  // Check if the product exists
  const existingProduct = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!existingProduct) {
    throw new Error("Product not found");
  }

  // Update and return the updated product
  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: {
      title,
      description,
      price,
      stock,
      image,
    },
  });

  return updatedProduct;
};

// Service to delete a product
const deleteProduct = async (productId) => {
  // Check if the product exists
  const existingProduct = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!existingProduct) {
    throw new Error("Product not found");
  }

  // Delete the product
  await prisma.product.delete({
    where: { id: productId },
  });
};

// Service to list all products of a seller
const listProductsBySeller = async (sellerId) => {
  // Retrieve all products from the seller
  const products = await prisma.product.findMany({
    where: { sellerId },
  });

  return products;
};

// add category
const addCategory = async (categoryName) => {
  // Create and return the new category
  const newCategory = await prisma.category.create({
    data: {
      name: categoryName,
    },
  });

  return newCategory;
};

// get all categories
const getAllCategories = async () => {
  const categories = await prisma.category.findMany();
  return categories;
};



//  return fetch(`https://e-commerce-ecuo.onrender.com/products/${productId}`)
//    .then((res) => res.json())
//    .then((product) => ({
//      ...product,
//     

const getProductById = async (productId) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });
  return product;
};



module.exports = {
  addProduct,
  updateProduct,
  deleteProduct,
  listProductsBySeller,
  addCategory,
  getAllCategories,
  getProductById
};
