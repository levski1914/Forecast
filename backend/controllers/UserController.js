import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists!" });

    user = await User.create({ username, email, password });
    await user.save();
    res.status(201).json({ message: "User created!" });
  } catch (error) {
    console.error("Error in register:", error);
    res.status(500).json({ message: "server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
};

export const addCity = async (req, res) => {
  try {
    const { city } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.favourites.includes(city)) {
      user.favourites.push(city);
      await user.save();
    }

    res.json({ favourites: user.favourites });
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
};

export const getCity = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "user not found!" });

    res.json({ favourites: user.favourites });
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
};
// module.exports = router;
