export const formatBadRequest = (error) => {
  if (error?.errors) {
    // Extract Mongoose validation errors
    const formattedErrors = Object.keys(error.errors).map((key) => ({
      field: key,
      message: error.errors[key].message,
    }));
    return {
      success: false,
      error: "Validation failed",
      details: formattedErrors,
    };
  }

  return {
    success: false,
    error: error.message || "An unknown error occurred",
  };
};
