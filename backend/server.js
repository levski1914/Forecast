const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const errorHandler = require("./middleware/errorMiddleware.js");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const userRoutes = require("./routes/userRoutes.js");
const weatherRoutes = require("./routes/weatherRoutes.js");

app.use("/api/auth", userRoutes);
app.use("/api/weather", weatherRoutes);

app.use(errorHandler);
app.get("/", (req, res) => {
  res.send("Hello from backend");
});
mongoose
  .connect(process.env.MONGO_URi)
  .then(() => {
    console.log("DB is live");
    app.listen(PORT, () =>
      console.log(`server listen http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error(err));
