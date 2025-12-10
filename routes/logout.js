import express from "express";

const router = express.Router();

router.post("/", (req, res) => {
    // res.clearCookie("token", {
    //     httpOnly: true,
    //     secure: true, 
    //     sameSite: "none",
    //     path: "/"
    // });
    res.json({ message: "Logged out successfully" });
});


export default router;