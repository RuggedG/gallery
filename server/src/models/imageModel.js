import fs from "fs/promises";
import path from "path";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { __dirname } from "../utils/common.js";

dotenv.config();

class ImageModel {
  #Images = [];
  #filePath = path.join(__dirname, "../database/images.json");
  #storagePath = path.join(__dirname, "../storage/images/");
  #allowedExtensions = ["jpg", "jpeg", "png", "gif", "webp"];

  constructor() {
    this.#init();
  }

  async #init() {
    try {
      this.#Images = await this.#readData();
    } catch (error) {
      console.error("Error initializing ImageModel:", error);
    }
  }

  async #readData() {
    try {
      const rawData = await fs.readFile(this.#filePath, "utf-8");
      return JSON.parse(rawData);
    } catch {
      return [];
    }
  }

  async #writeData(data) {
    try {
      await fs.writeFile(
        this.#filePath,
        JSON.stringify(data, null, 2),
        "utf-8"
      );
      return true;
    } catch (error) {
      console.error("Error writing data:", error);
      return false;
    }
  }

  #extractImageInfo(image) {
    const [header, base64Data] = image.split(";base64,");
    const extension = header.split("/")[1];
    return { extension, base64Data };
  }

  async #upload(image) {
    await fs.mkdir(this.#storagePath, { recursive: true });

    const { extension, base64Data } = this.#extractImageInfo(image);
    if (!this.#allowedExtensions.includes(extension)) {
      return null;
    }

    const fileName = `${uuidv4()}.${extension}`;
    const filePath = path.join(this.#storagePath, fileName);

    try {
      await fs.writeFile(filePath, base64Data, "base64");
      return fileName;
    } catch (err) {
      console.error("Error saving image:", err);
      return null;
    }
  }

  async public() {
    this.#Images = await this.#readData();
    let images = this.#Images.filter((image) => image.isPublic);
    images = images.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    return images;
  }

  async create(data) {
    this.#Images = await this.#readData();
    const fileName = await this.#upload(data.image);
    if (!fileName) {
      return false;
    }

    const imageUrl = `${process.env.BASE_URL}/images/${fileName}`;

    const image = {
      id: uuidv4(),
      name: data.name,
      description: data.description || "",
      user_id: data.user_id,
      imageUrl,
      isPublic: data.isPublic,
      created_at: new Date(),
    };

    this.#Images.push(image);
    if (!this.#writeData(this.#Images)) return false;
    return image;
  }

  async findOne(imageUrl) {
    this.#Images = await this.#readData();
    return this.#Images.find((image) => image.imageUrl === imageUrl);
  }

  async findById(imageId) {
    this.#Images = await this.#readData();
    return this.#Images.find((image) => image.id === imageId);
  }

  async getFile(fileName) {
    const filePath = path.join(this.#storagePath, fileName);
    try {
      await fs.access(filePath);
      return filePath;
    } catch {
      return null;
    }
  }

  async forUser(userId) {
    this.#Images = await this.#readData();
    const images = this.#Images.filter((image) => image.user_id === userId);
    return images.sort((a, b) => b.created_at - a.created_at);
  }

  async destroy(imageUrl) {
    this.#Images = await this.#readData();
    const imagePath = imageUrl.split("/").pop() || "";
    const filePath = path.join(this.#storagePath, imagePath);
    try {
      await fs.unlink(filePath);
      const imageData = this.#Images.find(
        (image) => image.imageUrl === imageUrl
      );
      const index = this.#Images.indexOf(imageData);
      if (index !== -1) {
        this.#Images.splice(index, 1);
        return this.#writeData(this.#Images);
      }
      return false;
    } catch (err) {
      console.error("Error deleting image:", err);
      return false;
    }
  }
}

export default ImageModel;
