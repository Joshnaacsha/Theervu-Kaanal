import express from "express";
import bcrypt from "bcrypt";
import { generateToken } from "../middleware/auth.js";
import Petitioner from "../models/Petitioner.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// ✅ Register Petitioner
router.post("/register", async (req, res) => {
    const { firstName, lastName, email, phone, address, city, state, pincode, password, confirmPassword } = req.body;

    try {
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const existingUser = await Petitioner.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Petitioner already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newPetitioner = new Petitioner({
            firstName,
            lastName,
            email,
            phone,
            address,
            city,
            state,
            pincode,
            password: hashedPassword,
        });

        await newPetitioner.save();
        res.status(201).json({ message: "Petitioner registered successfully!" });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ Petitioner Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const petitioner = await Petitioner.findOne({ email });
        if (!petitioner) {
            return res.status(400).json({ message: "Account does not exist" });
        }

        const isMatch = await bcrypt.compare(password, petitioner.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate token with correct role
        const token = generateToken({
            _id: petitioner._id,
            role: 'petitioner'
        });

        res.json({
            message: "Login successful",
            token,
            userId: petitioner._id.toString(),
            name: `${petitioner.firstName} ${petitioner.lastName}`.trim(),
            email: petitioner.email
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
