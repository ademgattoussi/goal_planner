const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/jwt");
const User = require("../models/user");

exports.register = async (req, res) => {
  const { fullname, email, password, mobile } = req.body;

  try {
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered" });
    }
    
    const newUser = await User.create({
      fullname,
      email,
      password,
      mobile,
    });
    if (!newUser) {
      throw new Error("User creation failed");
    }

    // const token = generateToken(newUser.id);

    res.status(201).json({
      success: true,
      user: {
        id: newUser.id,
        fullname: newUser.username,
        email: newUser.email,
        mobile: newUser.mobile,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      error: "Registration failed",
      details: error.message,
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res
        .status(400)
        .json({ error: "Invalid credentials: email don't exist" });
    }

    if (!user.password) {
      throw new Error("User password is missing in the database");
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
      return res
        .status(400)
        .json({ error: "Invalid credentials: wrong password" });
    }

    const token = generateToken(user.id);

    res.json({
      token,
      user: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        mobile: user.mobile,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: "Login failed",
      details: error.message,
    });
  }
};
