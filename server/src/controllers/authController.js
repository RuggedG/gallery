import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";

const Users = new UserModel();

dotenv.config();

const generateToken = ({ payload, secret, expiresIn = "15m" }) => {
  const token = jwt.sign(payload, secret, { expiresIn: expiresIn });
  return token;
};

class AuthController {
  async login(req, res) {
    const { email, password } = req.body;
    const user = Users.findByEmail(email.toLowerCase());

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    const refreshToken = generateToken({
      payload,
      expiresIn: "1d",
      secret: process.env.REFRESH_TOKEN_SECRET,
    });

    const accessToken = generateToken({
      payload,
      secret: refreshToken,
      expiresIn: "15m",
    });

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      token: accessToken,
      message: "Login successful",
    });
  }

  async register(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({
        success: false,
        message: "Method not allowed",
      });
    }

    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: "No data provided",
      });
    }

    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = Users.findByEmail(email.toLowerCase());
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = Users.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    if (!newUser) {
      return res.status(500).json({
        success: false,
        message: "Failed to create account, please try again",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Account created successfully, please login",
    });
  }

  async logout(req, res) {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    return res.json({
      success: true,
      message: "Logout successful",
      status: 200,
    });
  }

  async me(req, res) {
    const user = Users.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    return res.status(200).json({
      user,
    });
  }

  async refresh(req, res) {
    const refreshToken = req.cookies["jwt"];
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: "Forbidden",
        });
      }

      const accessToken = this.generateToken({
        payload: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        secret: refreshToken,
      });

      return res.status(200).json({
        success: true,
        token: accessToken,
      });
    });
  }

  async verify(req, res) {
    const [bearer, token] = req.headers.authorization.split(" ");
    const cookieToken = req.cookies["jwt"];
    if (bearer !== "Bearer" || (!token && !cookieToken)) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    jwt.verify(token, cookieToken, (err, user) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: "Forbidden",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Authorized",
      });
    });
  }
}

export default AuthController;
