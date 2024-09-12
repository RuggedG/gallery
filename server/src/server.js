import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import AuthRoutes from "./routes/authRoutes.js";
import ImageRoutes from "./routes/imageRoutes.js";
import PublicRoutes from "./routes/publicRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const baseURL = process.env.BASE_URL || `http://localhost:${PORT}/api/v1`;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(
  express.json({
    limit: "50mb",
  })
);
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/v1", PublicRoutes);
app.use("/api/v1", AuthRoutes);
app.use("/api/v1", ImageRoutes);

app.listen(PORT, () => console.log(`Server running on ${baseURL} `));
