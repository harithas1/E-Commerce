const prisma = require("../prisma/prismaClient");

// add review
const createReview = async ({ userId, productId, rating, comment }) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  const review = await prisma.review.create({
    data: {
      userId,
      productId,
      rating,
      comment,
      reviewerName: user.name,
      reviewerEmail: user.email,
    },
  });

  return review;
};

const getReviewsByProduct = async (productId) => {
  return await prisma.review.findMany({
    where: { productId },
    include: { product: true, user: true },
  });
};

const getReviewsByUser = async (userId) => {
  return await prisma.review.findMany({
    where: { userId },
    include: { product: true },
  });
};

module.exports = {
  createReview,
  getReviewsByProduct,
  getReviewsByUser
};


// all routes with prefix /api/reviews with params/query/body

// 1. add review -- method: POST -- endpoint: https://e-commerce-ecuo.onrender.com/api/reviews/add -- body: {userId, productId, rating, comment}

// 2. get reviews by product -- method: GET -- endpoint: https://e-commerce-ecuo.onrender.com/api/reviews/product/:productId -- query: {productId}

// 3. get reviews by user -- method: GET -- endpoint: https://e-commerce-ecuo.onrender.com/api/reviews/user/:userId -- query: {userId}
