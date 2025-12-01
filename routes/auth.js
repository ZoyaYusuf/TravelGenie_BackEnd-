import express from "express";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import { protect } from "../middleware/auth.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// ---------- REGISTER ----------
router.post("/signup", async (req, res) => {
    try {
         console.log("Signup route hit!", req.body);
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "Email already exists" });

        const user = await User.create({ name, email, password });

        const token = generateToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,       // true for http
            sameSite: "none", //none for http
            maxAge: 7 * 24 * 60 * 60 * 1000,
        }); 
        res.status(201).json({
            message: "User registered",
            user: {
                userId: user.userId,
                name: user.name,
                email: user.email
            },
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ---------- LOGIN ----------
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body; 
        console.log("inside login 1")
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "Invalid email or password" });
        console.log("inside login 2")
        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(401).json({ message: "Invalid password" });
        console.log("inside login 3")
        // const token = generateToken(user._id);
        console.log("inside login 4")
        // res.cookie("token", token, {
        // httpOnly: true,
        // secure: true,           // true for https// false for local
        // sameSite: "none",     //none for http //lax for local
        // maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        // });
        console.log("inside login 5")
        res.json({
            message: "Logged in",
            user: {
                userId: user.userId,
                name: user.name,
                email: user.email
            },
            token
        }); 
        
    } catch (err) {
        res.status(500).json({ message: err.message });
        console.log("error")
    }
});

router.get("/check", (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.json({ loggedIn: false });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return res.json({ loggedIn: true, user: decoded });
    } catch (err) {
        return res.json({ loggedIn: false });
    }
});



export default router;
