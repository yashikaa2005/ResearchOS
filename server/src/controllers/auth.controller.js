const authService = require("../services/auth.service");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const result = await authService.registerUser({ name, email, password });

    return res.status(201).json(result);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await authService.loginUser({ email, password });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const changePassword = async (req, res) => {
  console.log(`[AuthController] changePassword called for user: ${req.user.id}`);
  try {
    const result = await authService.changePassword(req.user.id, req.body);
    return res.status(200).json(result);
  } catch (error) {
    console.error("[AuthController] changePassword error:", error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  changePassword,
};