const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const generateToken = require("../utils/generateToken");

const registerUser = async ({ name, email, password }) => {
    const existingUser = await User.findOne({
        email: email.toLowerCase(),
    });

    if (existingUser) {
        throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10); //generates own salt

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    const userResponse = {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
    };

    return {
        success: true,
        data: {
            user: userResponse,
            token: generateToken(user._id),
        },
    };
};

const loginUser = async ({ email, password }) => {
    const user = await User.findOne({
        email: email.toLowerCase(),
    });

    if (!user) {
        throw new Error("User Not Found");
    }

    const isPasswordMatch = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordMatch) {
        throw new Error("Invalid credentials");
    }

    const userResponse = {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
    };

    return {
        success: true,
        data: {
            user: userResponse,
            token: generateToken(user._id),
        },
    };
};

module.exports = {
    registerUser,
    loginUser,
};