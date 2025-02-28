const prisma = require("../prisma/prismaClient");



// Service to add a product to the wishlist

const addToWishlist = async (userId, productId) => {
  try {
    const wishlist = await prisma.wishlist.create({
      data: {
        userId,
        productId,
      },
    });
    return wishlist;
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    throw new Error("Failed to add to wishlist");
  }
};

// Service to remove a product from the wishlist

const removeFromWishlist = async (userId, productId) => {
  try {
    const wishlist = await prisma.wishlist.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
    return wishlist;
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    throw new Error("Failed to remove from wishlist");
  }
};


// Service to get all products in the wishlist

const getWishlist = async (userId) => {
  try {
    const wishlist = await prisma.wishlist.findMany({
      where: {
        userId,
      },
    });
    return wishlist;
  } catch (error) {
    console.error("Error getting wishlist:", error);
    throw new Error("Failed to get wishlist");
  }
};



module.exports = {
  addToWishlist,
  removeFromWishlist,
  getWishlist
};