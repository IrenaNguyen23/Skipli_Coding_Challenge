const express = require("express");
const { adminDb } = require("../config/firebase");
const sgMail = require("@sendgrid/mail");
const axios = require("axios");
require("dotenv").config();

const router = express.Router();

// Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// GitHub API headers
const githubHeaders = {
  Accept: "application/vnd.github.v3+json",
  Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
};

// Create access code (POST /api/create-access-code)
router.post("/create-access-code", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    const accessCode = Math.floor(100000 + Math.random() * 900000).toString();

    await adminDb.collection("users").doc(email).set({
      email,
      accessCode,
      createdAt: new Date(),
    });

    const msg = {
      to: email,
      from: process.env.SENDGRID_SENDER_EMAIL,
      subject: "Skipli Access Code",
      text: `Your access code is: ${accessCode}`,
      html: `<p>Your access code is: <strong>${accessCode}</strong></p>`,
    };

    try {
      await sgMail.send(msg);
    } catch (emailError) {
      console.error("Error sending email via SendGrid:", emailError);
      return res.status(500).json({ error: "Error sending email" });
    }

    res.status(200).json({ message: "Access code sent to email" });
  } catch (error) {
    console.error("Error creating access code:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Verify access code (POST /api/validate-access-code)
router.post("/validate-access-code", async (req, res) => {
  try {
    const { email, accessCode } = req.body;
    if (!email || !accessCode) {
      return res.status(400).json({ error: "Email and access code are required" });
    }

    const userDoc = await adminDb.collection("users").doc(email).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const userData = userDoc.data();
    if (userData.accessCode !== accessCode) {
      return res.status(401).json({ error: "Invalid access code" });
    }

    await adminDb.collection("users").doc(email).update({
      accessCode: "",
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error verifying access code:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Like GitHub user
router.post("/like-github-user", async (req, res) => {
  try {
    const { email, githubUserId } = req.body;
    if (!email || !githubUserId) {
      return res.status(400).json({ error: "Email and GitHub user ID are required" });
    }

    await adminDb.collection("favorite_github_users").doc(`${email}_${githubUserId}`).set({
      email,
      githubUserId,
      likedAt: new Date(),
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error liking GitHub user:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get user profile
router.get("/user-profile/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const querySnapshot = await adminDb.collection("favorite_github_users")
      .where("email", "==", email)
      .get();

    const favoriteUsers = [];
    for (const doc of querySnapshot.docs) {
      const { githubUserId } = doc.data();
      const response = await axios.get(`https://api.github.com/user/${githubUserId}`, {
        headers: githubHeaders,
      });
      favoriteUsers.push(response.data);
    }

    res.status(200).json({ favorite_github_users: favoriteUsers });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Search GitHub users
router.get("/search-github-users", async (req, res) => {
  try {
    const { q, page = 1, per_page = 30 } = req.query;
    if (!q) {
      return res.status(400).json({ error: "Search term is required" });
    }

    const response = await axios.get("https://api.github.com/search/users", {
      params: { q, page, per_page },
      headers: githubHeaders,
    });

    res.status(200).json(response.data.items);
  } catch (error) {
    console.error("Error searching GitHub users:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || "Server error",
    });
  }
});

// Get GitHub user profile
router.get("/github-user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`https://api.github.com/user/${id}`, {
      headers: githubHeaders,
    });

    const { login, id: githubId, avatar_url, html_url, public_repos, followers } = response.data;
    res.status(200).json({ login, id: githubId, avatar_url, html_url, public_repos, followers });
  } catch (error) {
    console.error("Error fetching GitHub profile:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || "Server error",
    });
  }
});

module.exports = router;