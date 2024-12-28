import cloudinary from "../lib/cloudinary.js";
import { generateToken, setTokenCookie } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { email, fullName, password } = req.body;
  try {
    if (!email || !fullName || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      await newUser.save();
      const token = generateToken({ userId: newUser._id });
      setTokenCookie(res, token);

      return res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    }
  } catch (error) {
    console.log("Error in signup controller: ", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = generateToken({ userId: user._id });
    setTokenCookie(res, token);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller: ", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("chat-jwt", "", {
      maxAge: 0,
    });
    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log("Error in logout controller: ", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullName, email, profilePic } = req.body;
    const userId = req.user._id;
    const currentUser = await User.findById(userId);

    if (email && currentUser.isGoogleAccount) {
      return res.status(400).json({
        message: "Google account email cannot be changed",
      });
    }

    const updateFields = {};

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          message: "Please provide a valid email address",
        });
      }

      const emailExists = await User.findOne({
        email,
        _id: { $ne: userId },
      });

      if (emailExists) {
        return res.status(400).json({
          message: "Email already in use",
        });
      }

      updateFields.email = email;
    }

    if (fullName) {
      if (fullName.length < 2) {
        return res.status(400).json({
          message: "Full name must be at least 2 characters long",
        });
      }
      updateFields.fullName = fullName;
    }

    if (profilePic) {
      if (currentUser.profilePic) {
        const publicId = currentUser.profilePic.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }

      const uploadResponse = await cloudinary.uploader.upload(profilePic);
      updateFields.profilePic = uploadResponse.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in updateProfile controller: ", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller: ", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const googleAuth = async (profile, done) => {
  try {
    const existingUser = await User.findOne({ email: profile.emails[0].value });

    if (existingUser) {
      const token = generateToken({ userId: existingUser._id });
      existingUser.token = token;
      return done(null, existingUser);
    }

    const newUser = new User({
      fullName: profile.displayName,
      email: profile.emails[0].value,
      googleId: profile.id,
      profilePic: profile.photos[0].value,
      isGoogleAccount: true,
    });

    await newUser.save();
    const token = generateToken({ userId: newUser._id });
    newUser.token = token;
    done(null, newUser);
  } catch (error) {
    done(error, null);
  }
};
