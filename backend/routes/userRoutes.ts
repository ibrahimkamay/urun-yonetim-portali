import express, { Router } from "express";
import AuthMiddleware from "../middleware/authMiddleware";
import RoleMiddleware from "../middleware/roleMiddleware";
import UserController from "../controllers/userController";

const router: Router = express.Router();

router.get("/", AuthMiddleware.authenticateToken, RoleMiddleware.authorize("admin"), UserController.getAllUsers);
router.get("/:userId", AuthMiddleware.authenticateToken, UserController.getUserProfile);
router.put("/:userId", AuthMiddleware.authenticateToken, RoleMiddleware.authorize("admin"), UserController.updateUserRole);
router.delete("/:userId", AuthMiddleware.authenticateToken, RoleMiddleware.authorize("admin"), UserController.deleteUser);

export default router;