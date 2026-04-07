import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";
import User from "../model/userModel.js";

const TOKEN_EXPIRES = "24h";
const JWT_SECRET = "Jwt_Secret_Token";

const createToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES });
};

export async function registerUser(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email",
    });
  }

  if (password.lenght < 8) {
    return res.status(400).json({
      success: false,
      message: "Password must be atleast of 8 charcters",
    });
  }

  try {
    if (await User.findOne({ email })) {
      return res.status(409).json({
        success: false,
        message: "User already exist",
      });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    const token = createToken(user._id);
    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {}
  console.error(err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}
