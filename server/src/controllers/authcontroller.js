import {
    registerUser,
    loginUser,
    getCurrentUser
} from "../services/authservice.js";

/**
 * Register
 */
export const register = async (req, res) => {

    try {

        const result = await registerUser(req.body);

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            ...result
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message
        });

    }

};

/**
 * Login
 */
export const login = async (req, res) => {

    try {

        const result = await loginUser(req.body);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            ...result
        });

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: error.message
        });

    }

};

/**
 * Get Current User
 */
export const getMe = async (req, res) => {

    try {

        const user = await getCurrentUser(req.user.id);

        return res.status(200).json({
            success: true,
            user
        });

    } catch (error) {

        return res.status(404).json({
            success: false,
            message: error.message
        });

    }

};