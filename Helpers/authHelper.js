import jwt from "jsonwebtoken";

// Generate JWT Token
export const generateJWTtoken = (id,role) => {
  try {
    const token = jwt.sign(
      {
        id,
        role
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    return token;
  } catch (error) {
    return null;
  }
};

// JWT Auth Middleware
export const verifyJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "JWT token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired JWT token" });
  }
};
