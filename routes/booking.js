const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("../db");
const router = express.Router();

// Auth Middleware
const authenticate = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) return res.status(403).send("Token required");

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).send("Invalid token");
        req.user = decoded;
        next();
    });
};

// Book Seat
router.post("/book", authenticate, (req, res) => {
    const { train_id } = req.body;
    const user_id = req.user.id;

    db.query("SELECT available_seats FROM trains WHERE id = ?", [train_id], (err, results) => {
        if (err || results.length === 0) return res.status(500).send("Train not found");

        if (results[0].available_seats > 0) {
            db.query("UPDATE trains SET available_seats = available_seats - 1 WHERE id = ?", [train_id]);
            db.query("INSERT INTO bookings (user_id, train_id) VALUES (?, ?)", [user_id, train_id]);
            res.send("Booking successful");
        } else {
            res.status(400).send("No seats available");
        }
    });
});


// Get Booking Details
router.get("/details", authenticate, (req, res) => {
    const user_id = req.user.id;
    db.query("SELECT * FROM bookings WHERE user_id = ?", [user_id], (err, bookings) => {
        if (err) return res.status(500).send(err);
        res.json(bookings);
    });
});

module.exports = router;
