import JWT from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const requireSignIn = async (req, res, next) => {
  try {
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.user = decode;
    next();
  } catch (error) {}
};

export const hashPassword = async (password) => {
  try {
    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {}
};

export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};
