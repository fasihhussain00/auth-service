export default {
  port: parseInt(process.env.APP_PORT || "5001"),
  baseUrl: process.env.APP_BASE_URL,
  debug: process.env.APP_DEBUG?.toLowerCase() === "true",
  jwtSecret: process.env.JWT_SECRET
};
