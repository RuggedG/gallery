import fs from "fs";
import path from "path";
import { __dirname } from "../utils/common.js";
import { v4 as uuidv4 } from "uuid";

class UserModel {
  #Users = [];
  #filePath;

  constructor() {
    this.#Users = this.#readData();
    this.#filePath = path.join(__dirname, "../database/users.json");
  }

  #readData() {
    if (!fs.existsSync(this.#filePath)) {
      return [];
    }

    const rawData = fs.readFileSync(this.#filePath, "utf-8");
    return JSON.parse(rawData);
  }

  #writeData(data) {
    fs.writeFileSync(this.#filePath, JSON.stringify(data, null, 2), "utf-8");

    return true;
  }

  create(data) {
    this.#Users = this.#readData();
    const user = { ...data, id: uuidv4() };
    this.#Users.push(user);
    this.#writeData(this.#Users);
    return user;
  }

  update(data) {
    this.#Users = this.#readData();
    const index = this.#Users.findIndex((user) => user.id === data.id);
    if (index !== -1) {
      this.#Users[index] = data;
      this.#writeData(this.#Users);
      return true;
    } else {
      return false;
    }
  }

  findById(id) {
    this.#Users = this.#readData();
    return this.#Users.find((user) => user.id === id);
  }

  findByEmail(email) {
    this.#Users = this.#readData();
    return this.#Users.find((user) => user.email === email);
  }

  destroy(id) {
    this.#Users = this.#readData();
    const index = this.#Users.findIndex((user) => user.id === id);
    if (index !== -1) {
      this.#Users.splice(index, 1);
      this.#writeData(this.#Users);
      return true;
    } else {
      return false;
    }
  }
}

export default UserModel;
