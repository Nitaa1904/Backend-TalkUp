const express = require("express");
const router = express.Router();
const { verifyToken, verifyRole } = require("../middlewares/authMiddleware");
const guruBkController = require("../controllers/guruBkController");

router.get(
  "/siswa",
  verifyToken,
  verifyRole("guru_bk"),
  guruBkController.getSiswaBimbingan
  /*
    #swagger.tags = ['Guru BK']
    #swagger.summary = 'Ambil semua siswa bimbingan'
    #swagger.security = [{ "bearerAuth": [] }]
  */
);

module.exports = router;
