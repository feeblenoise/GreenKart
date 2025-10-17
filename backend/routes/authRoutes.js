// routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');

module.exports = function(db) {
  const router = express.Router();

  // REGISTER
  router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
      const usersCollection = db.collection('users');

      const existingUser = await usersCollection.findOne({ email });
      if (existingUser) {
        return res.status(400).send("Email already registered");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

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
      const usersCollection = db.collection('users');

      const user = await usersCollection.findOne({ email });
      if (!user) {
        return res.status(400).send("No user found");
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).send("Incorrect password");
      }

      res.status(200).json({
        message: `${user.role === "admin" ? "Admin" : "User"} login successful`,
        role: user.role,
        name: user.name
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error logging in");
    }
  });

  return router;
};

