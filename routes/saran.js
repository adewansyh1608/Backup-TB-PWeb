const express = require("express");
const router = express.Router();
const requireLogin = require("../middleware/requireLogin");
const saranController = require("../controllers/saranController");

// Route untuk user membuat saran
router.get("/saran", requireLogin, (req, res) => {
  if (req.session.user.role === "admin") {
    return res.redirect("/admin/saran");
  }
  saranController.formSaran(req, res);
});
router.post("/saran", requireLogin, saranController.kirimSaran);

// Route untuk admin melihat semua saran
router.get("/admin/saran", requireLogin, saranController.tampilkanSemuaSaran);

module.exports = router;
