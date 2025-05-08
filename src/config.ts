import dotenv from "dotenv";

// This will be:
// - test when running tests (local or GitHub Actions)
// - development when running locally
// - production when deployed to Vercel
if (process.env.NODE_ENV === "test") {
  dotenv.config({ path: "./.env.test" });
} else {
  dotenv.config(); // Loads the default .env file
}

// Export all environment variables in a single object
export const config = {
  jwtSecret: process.env.JWT_SECRET,
  databaseUrl: process.env.DATABASE_URL,
};
