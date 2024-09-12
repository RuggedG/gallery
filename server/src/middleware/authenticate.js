import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const refreshToken = req.cookies["jwt"];

  if (token == null || refreshToken == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, refreshToken, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: "Invalid Token",
      });
    }

    req.user = user;
    next();
  });
};

export default authenticate;
