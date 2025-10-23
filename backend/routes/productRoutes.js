const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authenticateToken = require("../middleware/authMiddleware");
const autherizeRoles = require("../middleware/roleMiddleware");





router.get("/", authenticateToken, productController.getAllProducts)
router.post("/", authenticateToken, productController.createProduct)
router.put("/:id", authenticateToken,  productController.updateProduct) 
router.delete("/:id", authenticateToken, productController.deleteProduct) 


module.exports = router;
