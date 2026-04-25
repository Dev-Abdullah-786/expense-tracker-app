import jwt from "jsonwebtoken";
import UserModel from "../model/userModel.js";

const JWT_SECRET = "Jwt_Secret_Token";

export default async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Not authorized or token missing",
    });
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await UserModel.findById(payload?.id).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error("JWT verification failed", err);
    return res.status(401).json({
      success: false,
      message: "Token invalid or expired",
    });
  }
}
