const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../prisma/prismaClient");
const sendEmail = require("../utils/mailer");

const JWT_SECRET = "subbu7hari27usha01gowthu01hema29"; // Move this to .env in production

// Register User
const registerUser = async ({ name, email, password, role }) => {
  // Check if email is already in use
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error("Email already exists!");

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const newUser = await prisma.user.create({
    data: { name, email, password: hashedPassword, role, emailVerified: false },
  });

  // Generate email verification token
  const emailVerificationToken = jwt.sign({ userId: newUser.id }, JWT_SECRET, {
    expiresIn: "1d",
  });

  // Send verification email
  const verificationLink = `htpp://localhost:5173/api/auth/verify-email?token=${emailVerificationToken}`;
  const emailContent = `
    <h2>Verify Your Email</h2>
    <p>Click the link below to verify your email:</p>
    <a href="${verificationLink}">Verify Email</a>
  `;
  await sendEmail(newUser.email, "Email Verification", emailContent);

  return {
    message: "Registration successful! Check your email for verification.",
  };
};

// Verify Email
const verifyEmail = async (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Update user as verified
    await prisma.user.update({
      where: { id: decoded.userId },
      data: { emailVerified: true },
    });

    return { message: "Email verified successfully!" };
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};

// Login User
const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid email or password");

  // Check password
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error("Invalid email or password");

  // Generate JWT
  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: "7d",
  });

  return { message: "Login successful", token };
};

// Create Review
const createReview = async ({ userId, productId, rating, comment }) => {
  // Create a review for a product
  const review = await prisma.review.create({
    data: {
      userId,
      productId,
      rating,
      comment,
      reviewerName: "User Name", // Should fetch from user info
      reviewerEmail: "user@example.com", // Should fetch from user info
    },
  });
  return review;
};

// Create Order
const createOrder = async ({ userId, productId, quantity }) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });
  if (!product) throw new Error("Product not found");

  const totalAmount = product.price * quantity;

  const order = await prisma.order.create({
    data: {
      userId,
      productId,
      quantity,
      totalAmount,
      status: "PENDING",
    },
  });

  return order;
};




// get all products
const getAllProducts = async ({
  limit = 10,
  skip = 0,
  search = "",
  categoryId = null,
}) => {
  const filters = {};

  if (search) {
    filters.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (categoryId && categoryId !== "all") {
    filters.categoryId = categoryId;
  }

  const products = await prisma.product.findMany({
    where: filters,
    take: parseInt(limit),
    skip: parseInt(skip),
  });

  const total = await prisma.product.count({ where: filters });

  return { products, total };
};


module.exports = {
  registerUser,
  verifyEmail,
  loginUser,
  createReview,
  createOrder,
  getAllProducts,
};
