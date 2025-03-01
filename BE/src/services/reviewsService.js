const prisma = require("../prisma/prismaClient");

// add review
const createReview = async ({ userId, productId, rating, comment }) => {
  // Check if the user exists
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  // Check if the product exists
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new Error("Product not found");

  // Create the review
  const review = await prisma.review.create({
    data: {
      userId,
      productId,
      rating,
      comment,
      reviewerName: user.name, // Get name from user
      reviewerEmail: user.email, // Get email from user
    },
  });

  return review;
};


// Get reviews by product
const getReviewsByProduct = async (productId) => {
  return await prisma.review.findMany({
    where: { productId: parseInt(productId) },
    include: { 
      product: true, 
      user: true 
    },
  });
};

const getReviewsByUser = async (userId) => {
  return await prisma.review.findMany({
    where: { userId: parseInt(userId) },
    include: { product: true },
  });
};

module.exports = {
  createReview,
  getReviewsByProduct,
  getReviewsByUser
};

