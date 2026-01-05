import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { missingResponse,failure,invalidResponse } from "../utils/responseHandlers.js";

// Set token in HTTP-only cookie
const setCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, //1 day
  });
};

//Genereate JWT Token
const generateToken = (res, payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  setCookie(res, token);
  return token;
};

// Register User Controller
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return missingResponse(res);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      name,
      email,
      password: hashedPassword,
    });
    return res.status(201).json({
      message: "User registered successfully",
      success: true,
    });
  } catch (error) {
    console.log("Error in registerUser:", error);
    return failure(res);
  }
};

// Login User Controller
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return missingResponse(res);
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return invalidResponse(res);
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return invalidResponse(res);
    }

    // Generate Token
    generateToken(res, { id: user._id, role: user.isAdmin ? "admin" : "user" });
    return res.status(200).json({
      message: "Login Successful",
      success: true,
      user: {
        name: user.name,
        email: user.email,
        role: user.isAdmin ? "admin" : "user",
      },
    });
  } catch (error) {
    console.log("Error in loginUser:", error);
    return failure(res);
  }
};

// Admin Login Controller
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return missingResponse(res);
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (email !== adminEmail || password !== adminPassword) {
      return invalidResponse(res);
    }

    // Generate Token
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    setCookie(res, token);
    return res.status(200).json({
      message: "Admin Login Successful",
      success: true,
    });
  } catch (error) {
    console.log("Error in adminLogin:", error);
    return failure(res);
  }
};

// Logout User Controller
export const logoutUser = (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({
      message: "Logout Successful",
      success: true,
    });
  } catch (error) {
    console.log("Error in logoutUser:", error);
    return failure(res);
  }
};

// Get User Profile Controller
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    res.status(200).json(user);
  } catch (error) {
    return failure(res);
  }
};
