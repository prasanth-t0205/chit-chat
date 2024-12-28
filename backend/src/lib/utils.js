import jwt from "jsonwebtoken";

export const generateToken = (userId) => {
  return jwt.sign(userId, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const setTokenCookie = (res, token) => {
  res.cookie("chat-jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
  });
};
