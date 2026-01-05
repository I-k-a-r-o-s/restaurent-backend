import jwt from "jsonwebtoken";

// Helper to verify token and return decoded payload
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Helper to send authorization error
const sendAuthError = (
  res,
  { status = 401, message = "Not authorized, token missing or invalid" } = {}
) => {
  res.status(status).json({
    message,
    success: false,
  });
};

// Middleware to protect routes
export const protect = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return sendAuthError(res);
  }
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    return next();
  } catch (error) {
    console.log("Error in protect:", error);
    return sendAuthError(res);
  }
};

// Middleware to allow only admin access
export const adminOnly = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return sendAuthError(res);
  }
  try {
    const decoded = verifyToken(token);
    req.admin = decoded;
    if (req.admin.email && req.admin.email === process.env.ADMIN_EMAIL) {
      return next();
    }
    return sendAuthError(res, {
      status: 403,
      message: "Forbidden: admin access required",
    });
  } catch (error) {
    console.log("Error in adminOnly:", error);
    return sendAuthError(res);
  }
};
