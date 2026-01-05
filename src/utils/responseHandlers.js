// Failure Response Helper
export const failure = (res, message = "Internal Server Error") => {
  res.status(500).json({
    message,
    success: false,
  });
};

export const succcessResponse = (res, status, message = "Success") => {
  res.status(status).json({
    message,
    success: true,
  });
};

// Missing Fields Response Helper
export const missingResponse = (
  res,
  message = "Please provide all required fields"
) => {
  res.status(400).json({
    message,
    success: false,
  });
};

// Invalid Credentials Response Helper
export const invalidResponse = (res, message = "Invalid Credentials") => {
  res.status(401).json({
    message,
    success: false,
  });
};

export const alreadyExistsResponse = (res, message = "Already exists") => {
  res.status(409).json({
    message,
    success: false,
  });
};

export const notFoundResponse = (res, message = "Not found") => {
  res.status(404).json({
    message,
    success: false,
  });
};
