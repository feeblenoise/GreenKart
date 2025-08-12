// routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

// REGISTER
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const usersCollection = req.db.collection('users');

        // Check if email exists
        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
            return res.status(400).send("Email already registered");
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user (role: user by default)
        await usersCollection.insertOne({
            name,
            email,
            password: hashedPassword,
            role: "user",
            createdAt: new Date()
        });

        res.status(201).send("User registered successfully");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error registering user");
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const usersCollection = req.db.collection('users');

        const user = await usersCollection.findOne({ email });
        if (!user) {
            return res.status(400).send("No user found");
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send("Incorrect password");
        }

        // Role-based redirection (frontend handles redirect)
        if (user.role === "admin") {
            res.status(200).json({ message: "Admin login successful", role: "admin", name: user.name });
        } else {
            res.status(200).json({ message: "User login successful", role: "user", name: user.name });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Error logging in");
    }
});

module.exports = router;
