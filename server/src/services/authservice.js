import bcrypt from "bcrypt";
import User from "../models/user.js";
import generateToken from "../utils/generateToken.js";

/**
 * Register User
 */
export const registerUser = async ({ name, email, password }) => {

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new Error("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword
    });

    const token = generateToken(user._id);

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        },
        token
    };
};

/**
 * Login User
 */
export const loginUser = async ({ email, password }) => {

    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Invalid email or password");
    }

    const token = generateToken(user._id);

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        },
        token
    };
};

/**
 * Current Logged User
 */
export const getCurrentUser = async (userId) => {

    const user = await User.findById(userId).select("-password");

    if (!user) {
        throw new Error("User not found");
    }

    return user;
};