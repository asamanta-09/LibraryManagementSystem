import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import borrowRoutes from "./routes/borrowRoutes.js";

dotenv.config();

connectDB();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Library Management API is running");
});

app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/borrows", borrowRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
