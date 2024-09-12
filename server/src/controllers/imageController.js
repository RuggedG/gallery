import Joi from "joi";
import ImageModel from "../models/imageModel.js";

class ImageController {
  #Images;
  #user;

  constructor(req) {
    this.#Images = new ImageModel();
    this.#user = req.user;
  }

  #schema = Joi.object({
    image: Joi.string().required(),
    isPublic: Joi.boolean(),
    name: Joi.string().required(),
    description: Joi.string().allow("", null),
  });

  async create(req, res) {
    const { image, isPublic, name, description } = req.body;

    if (!image || !name) {
      return res.status(400).json({
        success: false,
        message: "image and name are required",
      });
    }

    const { error } = this.#schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    let Public = isPublic ? isPublic : false;

    const data = {
      name,
      description: description || "",
      user_id: this.#user.id,
      image,
      isPublic: Public,
    };

    const newImage = await this.#Images.create(data);
    if (!newImage) {
      return res.status(500).json({
        success: false,
        message: "Failed to create image",
      });
    }

    return res.status(201).json({
      success: true,
      image: newImage,
    });
  }

  async getPublic(req, res) {
    let images = await this.#Images.public();

    if (!images) {
      return res.status(404).json({
        success: false,
        message: "No images found",
      });
    }

    images = images.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    return res.status(200).json({
      success: true,
      images,
    });
  }

  async forUser(req, res) {
    let images = await this.#Images.forUser(this.#user.id);

    if (!images) {
      return res.status(404).json({
        success: false,
        message: "No images found",
      });
    }

    images = images.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    return res.status(200).json({
      success: true,
      images,
    });
  }

  async destroy(req, res) {
    const { imageId } = req.params;

    if (!imageId) {
      return res.status(400).json({
        success: false,
        message: "imageId is required",
      });
    }

    const image = await this.#Images.findById(imageId);
    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    if (image.user_id !== this.#user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const deletded = await this.#Images.destroy(image.imageUrl);

    if (!deletded) {
      return res.status(500).json({
        success: false,
        message: "Failed to delete image",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  }
}

export default ImageController;
