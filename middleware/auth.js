import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config(); 

export const protect = (req, res, next) => {
    const token = req.cookies.token;   // ⬅️ Read token from cookies

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.id;  // attach user id
        next();                 // continue to final route
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};
