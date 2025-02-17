const express = require("express");
const db = require("../db");
const router = express.Router();

// API Key Middleware
const verifyAdmin = (req, res, next) => {
    const apiKey = req.headers["x-api-key"];
    if (apiKey !== process.env.ADMIN_API_KEY) return res.status(403).send("Unauthorized");
    next();
};

// Add Train
router.post("/add", verifyAdmin, (req, res) => {
    const { name, source, destination, total_seats } = req.body;
    db.query("INSERT INTO trains (name, source, destination, total_seats, available_seats) VALUES (?, ?, ?, ?, ?)",
        [name, source, destination, total_seats, total_seats],
        (err, result) => {
            if (err) return res.status(500).send(err);
            res.status(201).send("Train added successfully");
        });
});

// Get Available Trains
router.get("/availability", (req, res) => {
    const { source, destination } = req.query;
    db.query("SELECT * FROM trains WHERE source = ? AND destination = ?", [source, destination], (err, trains) => {
        if (err) return res.status(500).send(err);
        res.json(trains);
    });
});

module.exports = router;
