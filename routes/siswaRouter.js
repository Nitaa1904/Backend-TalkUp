const express = require("express");
const router = express.Router();
const { verifyToken, verifyRole } = require("../middlewares/authMiddleware");
const siswaController = require("../controllers/siswaController");

router.get(
  "/me",
  verifyToken,
  verifyRole("siswa"),
  siswaController.getMyProfile
);

router.put(
  "/me",
  verifyToken,
  verifyRole("siswa"),
  siswaController.updateMyProfile
);

module.exports = router;
