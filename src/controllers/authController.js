import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import {
  missingResponse,
  failure,
  invalidResponse,
  alreadyExistsResponse,
  successResponse,
  notFoundResponse,
} from "../utils/responseHandlers.js";

/**
 * Helper function to set JWT token in HTTP-only cookie
 * This makes the token secure against XSS attacks
 * @param {Object} res - Express response object
 * @param {string} token - JWT token to store
 */
const setCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true, // Cannot be accessed via JavaScript (prevents XSS attacks)
    secure: process.env.NODE_ENV === "production", // Only sent over HTTPS in production
    sameSite: "strict", // CSRF protection - cookie only sent to same site
    maxAge: 24 * 60 * 60 * 1000, // Expires in 1 day (in milliseconds)
  });
};

/**
 * Helper function to generate a JWT token for a user
 * @param {Object} res - Express response object
 * @param {Object} payload - Data to encode in the token (e.g., user ID, role)
 * @returns {string} The generated JWT token
 */
const generateToken = (res, payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d", // Token expires in 1 day
  });
  setCookie(res, token);
  return token;
};

/**
 * Register a new user account
 * Validates input, checks for duplicates, and stores hashed password
 */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate that all required fields are provided
    if (!name || !email || !password) {
      return missingResponse(res, "Please provide name, email, and password");
    }

    // Check if user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return alreadyExistsResponse(res, "User already exists");
    }

    // Hash the password before storing (never store plain text passwords)
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Create new user with hashed password
    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return successResponse(res, 201, "User registered successfully");
  } catch (error) {
    console.log("Error in registerUser:", error);
    return failure(res);
  }
};

/**
 * Login an existing user
 * Validates credentials and generates JWT token if valid
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate that email and password are provided
    if (!email || !password) {
      return missingResponse(res, "Please provide email and password");
    }

    // Find user by email in database
    const user = await User.findOne({ email });
    if (!user) {
      return invalidResponse(res, "Invalid email or password");
    }

    // Compare provided password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return invalidResponse(res, "Invalid email or password");
    }

    // Generate JWT token with user ID and role
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
    return failure(res, "Failed to login");
  }
};

/**
 * Admin login with hardcoded credentials
 * Uses environment variables for security
 */
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return missingResponse(res, "Please provide admin email and password");
    }

    // Get admin credentials from environment variables
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Verify credentials match
    if (email !== adminEmail || password !== adminPassword) {
      return invalidResponse(res, "Invalid admin credentials");
    }

    // Generate Token for admin
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    setCookie(res, token);

    return successResponse(res, 200, "Admin Login Successful");
  } catch (error) {
    console.log("Error in adminLogin:", error);
    return failure(res, "Failed to login as admin");
  }
};

/**
 * Logout user by clearing the authentication cookie
 */
export const logoutUser = (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie("token");
    return successResponse(res, 200, "Logout Successful");
  } catch (error) {
    console.log("Error in logoutUser:", error);
    return failure(res);
  }
};

/**
 * Get the authenticated user's profile information
 * Requires valid JWT token (protected route)
 */
export const getProfile = async (req, res) => {
  try {
    // Extract user ID from authenticated request
    const user = await User.findById(req.user.id).select("-password"); // Exclude password from response
    if (!user) {
      return notFoundResponse(res, "User not found");
    }
    return res.status(200).json(user);
  } catch (error) {
    console.log("Error in getProfile:", error);
    return failure(res, "Failed to fetch user profile");
  }
};

export const isAuth = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id).select("-password");
    return res.status(200).json({ message:"Valid user", success: true, user });
  } catch (error) {
    console.log("Error in isAuth:", error);
    return invalidResponse(res, "Failed to check authorization!");
  }
};
