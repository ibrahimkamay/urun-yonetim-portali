import express, { Router } from "express";
import AuthMiddleware from "../middleware/authMiddleware";
import ProductController from "../controllers/productController";

const router: Router = express.Router();

router.get("/", AuthMiddleware.authenticateToken, ProductController.getAllProducts);
router.post("/", AuthMiddleware.authenticateToken, ProductController.createProduct);
router.put("/:id", AuthMiddleware.authenticateToken, ProductController.updateProduct); 
router.delete("/:id", AuthMiddleware.authenticateToken, ProductController.deleteProduct); 

export default router;