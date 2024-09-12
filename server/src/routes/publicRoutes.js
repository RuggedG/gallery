import path from "path";
import express from "express";
import jwt from "jsonwebtoken";
import { __dirname } from "../utils/common.js";
import userModel from "../models/userModel.js";
import ImageModel from "../models/imageModel.js";

const Images = new ImageModel();
const Users = new userModel();

const router = express.Router();

router.get("/", async (req, res) => {
  return res.status(200).json({
    success: true,
    name: "Image Uploader API",
    version: "1.0.0",
    status: "200",
  });
});

router.get("/images/:fileName", async (req, res) => {
  const { fileName } = req.params;

  try {
    const filePath = await Images.getFile(fileName);

    if (!filePath) {
      return res.sendStatus(404);
    }
    const fileType = fileName.split(".").pop();

    res.set("Content-Type", fileType);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    return res.sendFile(filePath);
  } catch (error) {
    console.error("Error reading image file:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to read image file",
    });
  }
});

router.get("/public", async (req, res) => {
  const images = await Images.public();

  return res.status(200).json({
    success: true,
    images,
  });
});

router.get("/image/:imageId", async (req, res) => {
  const { imageId } = req.params;
  let image = await Images.findById(imageId);

  if (!image) {
    return res.status(404).json({
      success: false,
      message: "Image not found",
    });
  }

  let publicImages = await Images.public();
  const randomImages = [];
  while (randomImages.length < 10 && publicImages.length > 0) {
    const randomIndex = Math.floor(Math.random() * publicImages.length);
    const randomImage = publicImages.splice(randomIndex, 1)[0];
    if (randomImage.id !== image.id) {
      randomImages.push(randomImage);
    }
  }
  image.related = randomImages;

  const Founduser = await Users.findById(image.user_id);
  image.user = {
    name: Founduser.name,
  };

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const refreshToken = req.cookies["jwt"];

  if (!token || (token === null && !refreshToken)) {
    if (image.isPublic) {
      return res.status(200).json({
        success: true,
        image,
      });
    } else {
      return res.status(403).json({
        success: false,
        message: "Image is not publicly available",
      });
    }
  }

  jwt.verify(token, refreshToken, async (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: "Access Forbidden",
      });
    }

    if (image.user_id !== user.id) {
      console.log("isPublic", image.isPublic);
      return res.status(403).json({
        success: false,
        message: "Access to private image forbidden",
      });
    }

    return res.status(200).json({
      success: true,
      image,
    });
  });
});

router.get("/download/:imageId", async (req, res) => {
  const { imageId } = req.params;
  if (!imageId) {
    return res.status(404).json({
      success: false,
      message: "Image not found",
    });
  }
  const image = await Images.findById(imageId);
  if (!image) {
    return res.status(404).json({
      success: false,
      message: "Image not found",
    });
  }
  const storagePath = path.join(__dirname, "../storage/images/");
  let imagePath = image.imageUrl.split("/").pop() || "";
  imagePath = path.join(storagePath, imagePath);
  console.log(image.imageUrl);
  return res.download(imagePath);
});

export default router;
