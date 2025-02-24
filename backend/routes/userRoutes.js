import express from "express";
import {
  register,
  login,
  addCity,
  getCity,
} from "../controllers/UserController.js";
import authMiddleware from "../middleware/authMiddleware.js";
// import {login} from "../controllers/UserController";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.post("/favourites", authMiddleware, addCity);
router.get("/favourites", authMiddleware, getCity);
router.post("/logout", authMiddleware, (req, res) => {
  res.json({ message: "Logged out successfully" });
});
export default router;
