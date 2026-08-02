export const sendSuccess = (res, statusCode, message, data = null) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendIntelligenceResponse = (res, statusCode, data = []) => {
  res.status(statusCode).json({
    generatedAt: new Date().toISOString(),
    version: "1",
    data,
  });
};
