const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

app.use(cors());
app.use(express.json()); // For parsing application/json


// Add user routes
app.use("/api/auth", userRoutes);

// Add product routes
app.use("/api/products", productRoutes);

app.get("/test", (req, res) => {
  res.send("Test route works!");
});


module.exports = app;
