import express, { Router } from "express";
import AuthMiddleware from "../middleware/authMiddleware";
import DashboardController from "../controllers/dashboardController";

const router: Router = express.Router();

router.get("/", AuthMiddleware.authenticateToken, DashboardController.getDashboardStats);

export default router;