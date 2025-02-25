const prisma = require("../prisma/prismaClient");

// Service to add a product to the cart
const addToCart = async ({ userId, productId, quantity }) => {
  // Check if the product exists
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  // Check if the product is already in the user's cart
  const existingCartItem = await prisma.cart.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  if (existingCartItem) {
    // If the product already exists, just update the quantity
    const updatedCartItem = await prisma.cart.update({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      data: {
        quantity: {
          increment: quantity,
        },
      },
    });
    return updatedCartItem;
  } else {
    // If the product is not in the cart, create a new entry
    const newCartItem = await prisma.cart.create({
      data: {
        userId,
        productId,
        quantity,
      },
    });
    return newCartItem;
  }
};

// Service to get all items in the cart for a user
const getCartItems = async (userId) => {
  const cartItems = await prisma.cart.findMany({
    where: { userId },
    include: {
      product: true, // Include the product details
    },
  });
  return cartItems;
};

// Service to remove an item from the cart
const removeFromCart = async ({ userId, productId }) => {
  const existingCartItem = await prisma.cart.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  if (!existingCartItem) {
    throw new Error("Item not found in the cart");
  }

  await prisma.cart.delete({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  return { message: "Item removed from cart" };
};

// Service to clear all items in the cart for a user
const clearCart = async (userId) => {
  await prisma.cart.deleteMany({
    where: { userId },
  });

  return { message: "Cart cleared" };
};

module.exports = {
  addToCart,
  getCartItems,
  removeFromCart,
  clearCart,
};
