import dotenv from "dotenv";

if (process.env.NODE_ENV === "test") {
  dotenv.config({ path: "./.env.test", override: true });
} else {
  dotenv.config();
}

export const config = {
  jwtSecret: process.env.JWT_SECRET,
  databaseUrl: process.env.DATABASE_URL,
};
