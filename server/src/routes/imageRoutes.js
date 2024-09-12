import express from "express";
import ImageController from "../controllers/imageController.js";
import authenticate from "../middleware/authenticate.js";

// const imageController = new ImageController();

const router = express.Router();

router.use(authenticate);

router.post("/upload", async (req, res) => {
  const imageController = new ImageController(req);
  return await imageController.create(req, res);
});

router.get("/user/images", async (req, res) => {
  const imageController = new ImageController(req);
  return await imageController.forUser(req, res);
});

router.delete("/image/:imageId", async (req, res) => {
  const imageController = new ImageController(req);
  return await imageController.destroy(req, res);
});

export default router;