import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

//Genereate JWT Token
const generateToken = (res, payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  // Set token in HTTP-only cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, //1 day
  });
  return token;
};

// Failure Response Helper
const failure = () => {
  return res.status(500).json({
    message: "Internal Server Error",
    success: false,
  });
};

// Missing Fields Response Helper
const missingResponse = () => {
  return res.status(400).json({
    message: "Please provide all required fields",
    success: false,
  });
};

// Register User Controller
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      missingResponse();
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
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
    failure();
  }
};

// Login User Controller
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      missingResponse();
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Nonexistent User",
        success: false,
      });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Credentials",
        success: false,
      });
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
    failure();
  }
};

// Admin Login Controller
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      missingResponse();
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (email !== adminEmail && password !== adminPassword) {
      return res.status(400).json({
        message: "Invalid Credentials",
        success: false,
      });
    }

    // Generate Token
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, //1 day
    });
    return res.status(200).json({
      message: "Admin Login Successful",
      success: true,
    });
  } catch (error) {}
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
    failure();
  }
};
