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
  console.log("Adding product...");
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

// ----------------------------------------------------------------------------------------

// Service to update an existing product
const updateProduct = async ({
  productId,
  title,
  description,
  price,
  stock,
  image,
}) => {
  console.log("Updating product...");
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


// ----------------------------------------------------------------------------------------

// Service to delete a product
const deleteProduct = async (productId) => {
  console.log("Deleting product...");
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

// ----------------------------------------------------------------------------------------

// Service to list all products of a seller
const listProductsBySeller = async (sellerId) => {
  console.log("Listing products by seller...");
  // Retrieve all products from the seller
  const products = await prisma.product.findMany({
    where: { sellerId },
  });

  return products;
};

// ----------------------------------------------------------------------------------------

// add category
const addCategory = async (categoryName) => {
  console.log("Adding category...");
  
  // Create and return the new category
  const newCategory = await prisma.category.create({
    data: {
      name: categoryName,
    },
  });

  return newCategory;
};

// ----------------------------------------------------------------------------------------

// get all categories
const getAllCategories = async () => {
  console.log("Fetching all categories...");
  const categories = await prisma.category.findMany();
  return categories;
};



//  return fetch(`https://e-commerce-ecuo.onrender.com/api/products/${productId}`)

   

const productById = async (productId) => {
  console.log("Fetching product by ID...");
   const product = await prisma.product.findUnique({
     where: { id: productId },
     include: {
       category: true, // Include category information if needed
       reviews: true, // Optionally include reviews
      
     },
   });

   return product;
};


// ----------------------------------------------------------------------------------------

// getallproducts
// Service to fetch all products
const getAllProducts = async (page, pageSize = 10) => {
  console.log("Fetching all products...");
  
  try {
    const products = await prisma.product.findMany({
      skip: (page - 1) * pageSize,  // Pagination logic
      take: pageSize,
      include: {
        category: true,  // Include category information if needed
        reviews: true,   // Optionally include reviews
      },
    });

    // Get total count for pagination
    const totalProducts = await prisma.product.count();

    return {
      data: products,
      totalPages: Math.ceil(totalProducts / pageSize),  // Calculate total pages based on the total count
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
};

// ----------------------------------------------------------------------------------------

const getHomePageProducts = async (limit = 10) => {
  console.log("Fetching home page products...");
  
  try {
    const [bestSellers, newestArrivals] = await Promise.all([
      prisma.product.findMany({
        take: limit,
        orderBy: {
          orders: { _count: "desc" }, // Sort by most ordered
        },
        include: {
          category: true,
          reviews: true,
        },
      }),
      prisma.product.findMany({
        take: limit,
        orderBy: {
          createdAt: "desc", // Sort by newest first
        },
        include: {
          category: true,
          reviews: true,
        },
      }),
      
    ]);

    return { bestSellers, newestArrivals };
  } catch (error) {

    console.error("Error fetching home page products:", error);
    throw new Error("Failed to fetch home page products");
  }
};


// ----------------------------------------------------------------------------------------

// Service to filter products by category, price range, and search by name.


// const filterProducts = async ({
//   categoryId,
//   minPrice,
//   maxPrice,
//   search,
//   sortBy,
//   order,
//   page,
//   pageSize,
// }) => {
//   try {
//     const skip = (page - 1) * pageSize; // Pagination logic

//     const products = await prisma.product.findMany({
//       where: {
//         categoryId: categoryId || undefined,
//         price: {
//           gte: minPrice || 0,
//           lte: maxPrice || undefined,
//         },
//         title: search ? { contains: search, mode: "insensitive" } : undefined, // Case-insensitive search
//       },
//       orderBy: {
//         [sortBy]: order, // Dynamic sorting (e.g., price: "asc" or "desc")
//       },
//       skip,
//       take: pageSize,
//       include: {
//         category: true,
//         reviews: true,
//       },
//     });

//     // Total products count for pagination
//     const totalProducts = await prisma.product.count({
//       where: {
//         categoryId: categoryId || undefined,
//         price: {
//           gte: minPrice || 0,
//           lte: maxPrice || undefined,
//         },
//         title: search ? { contains: search, mode: "insensitive" } : undefined,
//       },
//     });

//     return {
//       data: products,
//       totalPages: Math.ceil(totalProducts / pageSize),
//       currentPage: page,
//     };
//   } catch (error) {
//     console.error("Error filtering products:", error);
//     throw new Error("Failed to filter products");
//   }
// };

module.exports = {
  addProduct,
  updateProduct,
  deleteProduct,
  listProductsBySeller,
  addCategory,
  getAllCategories,
  productById,
  getAllProducts,
  getHomePageProducts,
  // filterProducts
};
