const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const dashboardController = require("../controllers/dashboardController");

router.get("/", authenticateToken, dashboardController.getDashboardStats);

module.exports = router;