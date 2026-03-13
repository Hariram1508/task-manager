const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

router.post("/register", async(req,res)=>{
    try{
        const {name,email,password} = req.body;
        const normalizedEmail = String(email || "").trim().toLowerCase();
        const normalizedName = String(name || "").trim();
        const normalizedPassword = String(password || "");

        if (!normalizedName || !normalizedEmail || !normalizedPassword) {
            return res.status(400).json({ message: "Name, email and password are required" });
        }

        const user = await User.findOne({email: normalizedEmail});
        if(user) return res.status(400).json({ message: "User already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(normalizedPassword,salt);

        const newUser = new User({
            name: normalizedName,
            email: normalizedEmail,
            password:hashedPassword
        });

        await newUser.save();

        res.json({ message: "User Registered" });

    }catch(err){
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = String(email || "").trim().toLowerCase();
        const normalizedPassword = String(password || "");

        if (!normalizedEmail || !normalizedPassword) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email: normalizedEmail });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(normalizedPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET || "dev_secret_change_me",
            { expiresIn: "1d" }
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;