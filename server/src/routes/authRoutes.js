import authenticate from "../middleware/authenticate.js";
import AuthController from "../controllers/authController.js";
import express from "express";

const router = express.Router();
const authController = new AuthController();

router.post("/login", authController.login);
router.post("/register", authController.register);

router.use(authenticate);
router.get("/refresh", authController.refresh);
router.get("/verify", authController.verify);
router.get("/me", authController.me);
router.get("/logout", authController.logout);

export default router;