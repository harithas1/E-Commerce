const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const reviewRoutes = require("./routes/reviewsRoutes");

const app = express();

app.use(cors());
app.use(express.json()); // For parsing application/json


// Add user routes
app.use("/api/auth", userRoutes);

// Add product routes
app.use("/api/products", productRoutes);

// cart routes
app.use("/api/cart", cartRoutes);


// Add review routes
app.use("/api/reviews", reviewRoutes);


app.get("/test", (req, res) => {
  res.send("Test route works!");
});






// Add wishlist routes
app.use("/api/wishlist", wishlistRoutes);

module.exports = app;


