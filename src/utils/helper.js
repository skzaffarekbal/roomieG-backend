const handleValidationError = (res, error) => {
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map((err) => err.message);

    return res.status(400).json({
      status: 400,
      error: messages.join(', '),
    });
  }

  return res.status(500).json({
    status: 500,
    error: error.message,
  });
};

module.exports = { handleValidationError };
