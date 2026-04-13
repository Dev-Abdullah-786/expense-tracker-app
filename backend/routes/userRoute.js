import express from "express";
import {
  loginUser,
  registerUser,
  updateProfile,
  getCurrentUser,
  updatePassword,
} from "../controllers/userController";
import authMiddleware from "../middleware/auth";

const userRouter = express.Router();

userRouter
  .post("/register", registerUser)
  .post("/login", loginUser)
  .get("/me", authMiddleware, getCurrentUser)
  .put("/profile", authMiddleware, updateProfile)
  .put("/password", authMiddleware, updatePassword);

export default userRouter;
