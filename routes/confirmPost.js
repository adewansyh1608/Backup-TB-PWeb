const express = require("express");
const router = express.Router();
const requireLogin = require("../middleware/requireLogin"); // Middleware to ensure user is logged in
const confirmPostController = require("../controllers/confirmPostController"); // Import controller

// Route to render the dashboard and fetch reports
router.get("/confirm-post", requireLogin, confirmPostController.getUserPost); // Use the controller to fetch reports and render the view

router.post("/approve-report/:id_laporan", confirmPostController.approve);

router.post("/denied-report/:id_laporan", confirmPostController.denied);

module.exports = router;
