import jwt from "jsonwebtoken";

/**
 * Helper function to verify and decode a JWT token
 * @param {string} token - The JWT token to verify
 * @returns {Object} The decoded token payload
 */
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

/**
 * Helper function to send authorization error responses
 * @param {Object} res - Express response object
 * @param {Object} options - Configuration object with status and message
 */
const sendAuthError = (
  res,
  { status = 401, message = "Not authorized, token missing or invalid" } = {}
) => {
  res.status(status).json({
    message,
    success: false,
  });
};

/**
 * Middleware to protect routes and ensure user is authenticated
 * Verifies JWT token from cookies and attaches user data to request
 * Must be used on routes that require authentication
 */
export const protect = (req, res, next) => {
  const token = req.cookies.token; // Get token from cookies

  if (!token) {
    return sendAuthError(res); // Reject if no token found
  }

  try {
    const decoded = verifyToken(token); // Verify and decode token
    req.user = decoded; // Attach decoded user data to request
    return next(); // Continue to next middleware/route handler
  } catch (error) {
    console.log("Error in protect:", error);
    return sendAuthError(res);
  }
};

/**
 * Middleware to restrict access to admin-only routes
 * Verifies token and checks if user is admin (by comparing email)
 */
export const adminOnly = (req, res, next) => {
  const token = req.cookies.token; // Get token from cookies

  if (!token) {
    return sendAuthError(res);
  }

  try {
    const decoded = verifyToken(token); // Verify and decode token
    req.admin = decoded;

    // Check if the email in token matches admin email from environment
    if (req.admin.email && req.admin.email === process.env.ADMIN_EMAIL) {
      return next(); // User is admin, continue
    }

    // User is not admin, deny access with 403 Forbidden status
    return sendAuthError(res, {
      status: 403,
      message: "Forbidden: admin access required",
    });
  } catch (error) {
    console.log("Error in adminOnly:", error);
    return sendAuthError(res);
  }
};
