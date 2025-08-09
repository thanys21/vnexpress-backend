// Vercel serverless function entry point
// This is NOT a Next.js app - it's a Node.js Express API
const app = require("../app");

// Export the Express app as a Vercel serverless function
module.exports = app;
