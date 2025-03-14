import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import errorHandler from "./middleware/errorMiddleware.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

import userRoutes from "./routes/userRoutes.js";
import weatherRoutes from "./routes/weatherRoutes.js";

app.use("/api/auth", userRoutes);
app.use("/api/weather", weatherRoutes);

app.use(errorHandler);
app.get("/", (req, res) => {
  res.send("Hello from backend");
});
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("DB is live");
    app.listen(PORT, () =>
      console.log(`server listen http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error(err));
