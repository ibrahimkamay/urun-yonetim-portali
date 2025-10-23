const express = require("express");
const app = express();
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes")
const dashboardRoutes = require("./routes/dashboardRoutes");
const cors = require("cors");

// CORS middleware önce gelir
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true
}));

app.use(express.json());

app.get("/", (req, res) => {
    res.status(201).json({
        "message": "true"
    })
})

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/products", productRoutes)
app.use("/api/dashboard", dashboardRoutes);

const port = process.env.PORT || 8002;
//server'ı başlat.
app.listen(port, (req, res) => {
    console.log(`Server şurada başlatıldı. ${port}`);
})