const router = require("express").Router();
const {
  register,
  login,
  addCity,
  getCity,
} = require("../controllers/UserController.js");
const authMiddleware = require("../middleware/authMiddleware.js");

router.post("/register", register);
router.post("/login", login);

router.post("/favourites", authMiddleware, addCity);
router.get("/favourites", authMiddleware, getCity);
router.post("/logout", authMiddleware, (req, res) => {
  res.json({ message: "Logged out successfully" });
});
export default router;
