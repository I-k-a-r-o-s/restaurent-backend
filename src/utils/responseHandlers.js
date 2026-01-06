/**
 * Helper function to send error responses to the client
 * Used when something goes wrong on the server side
 * Returns a 500 status code indicating an internal server error
 */
export const failure = (res, message = "Internal Server Error") => {
  return res.status(500).json({
    message,
    success: false,
  });
};

/**
 * Helper function to send successful responses to the client
 * @param {Object} res - Express response object
 * @param {number} status - HTTP status code (e.g., 200, 201)
 * @param {string} message - Success message to display
 */
export const successResponse = (res, status, message = "Success") => {
  return res.status(status).json({
    message,
    success: true,
  });
};

/**
 * Helper function to send response when required fields are missing
 * Returns a 400 status code indicating a bad request
 */
export const missingResponse = (
  res,
  message = "Please provide all required fields"
) => {
  return res.status(400).json({
    message,
    success: false,
  });
};

/**
 * Helper function to send response when credentials are invalid
 * Returns a 401 status code indicating unauthorized access
 */
export const invalidResponse = (res, message = "Invalid Credentials") => {
  return res.status(401).json({
    message,
    success: false,
  });
};

/**
 * Helper function to send response when a resource already exists
 * Returns a 409 status code indicating a conflict
 */
export const alreadyExistsResponse = (res, message = "Already exists") => {
  return res.status(409).json({
    message,
    success: false,
  });
};

/**
 * Helper function to send response when a resource is not found
 * Returns a 404 status code indicating the resource doesn't exist
 */
export const notFoundResponse = (res, message = "Not found") => {
  return res.status(404).json({
    message,
    success: false,
  });
};
