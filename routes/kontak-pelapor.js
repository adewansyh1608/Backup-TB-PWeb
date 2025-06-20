const express = require("express");
const router = express.Router();
const requireLogin = require("../middleware/requireLogin"); // Middleware to ensure user is logged in
const { kontakPelaporController } = require("../controllers/kontakPelaporController"); // Import the controller

// Route to fetch the contact details of the reporter
router.get("/:id_laporan", requireLogin, kontakPelaporController);

module.exports = router;
