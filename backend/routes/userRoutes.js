const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const autherizeRoles = require("../middleware/roleMiddleware");
const userController = require("../controllers/userController");

router.get("/", authenticateToken, autherizeRoles("admin"), userController.getAllUsers);
router.get("/:userId", authenticateToken, userController.getUserProfile);
router.put("/:userId", authenticateToken, autherizeRoles("admin"), userController.updateUserRole);
router.delete("/:userId", authenticateToken, autherizeRoles("admin"), userController.deleteUser);



module.exports = router;