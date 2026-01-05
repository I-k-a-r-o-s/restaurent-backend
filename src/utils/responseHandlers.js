// Failure Response Helper
export const failure = (res) => {
  res.status(500).json({
    message: "Internal Server Error",
    success: false,
  });
};

// Missing Fields Response Helper
export const missingResponse = (res) => {
  res.status(400).json({
    message: "Please provide all required fields",
    success: false,
  });
};

// Invalid Credentials Response Helper
export const invalidResponse = (res) => {
  res.status(401).json({
    message: "Invalid Credentials",
    success: false,
  });
};