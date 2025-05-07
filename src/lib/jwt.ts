import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;

// hash user password
export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

// compare raw password with hash version
export async function comparePassword(
  password: string,
  hashedPassword: string
) {
  return bcrypt.compare(password, hashedPassword);
}

// generate a jwt token for the session
export async function generateToken(payload: object) {
  if (!SECRET_KEY) throw new Error("JWT_SECRET is not defined");
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
}

// verify token is valid and not expired
export async function verifyToken(token: string) {
  if (!SECRET_KEY) throw new Error("JWT_SECRET is not defined");
  return jwt.verify(token, SECRET_KEY);
}
