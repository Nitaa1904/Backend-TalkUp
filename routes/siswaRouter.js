const express = require("express");
const router = express.Router();
const { verifyToken, verifyRole } = require("../middlewares/authMiddleware");
const siswaController = require("../controllers/siswaController");

router.get(
  "/me",
  verifyToken,
  verifyRole("siswa"),
  /* 
  #swagger.tags = ['Siswa']
    #swagger.summary = 'Lihat profil saya'
    #swagger.description = 'Endpoint untuk mengambil data profil siswa yang sedang login.'
    #swagger.security = [{ "bearerAuth": [] }]
  */
  siswaController.getMyProfile
);

router.put(
  "/me",
  verifyToken,
  verifyRole("siswa"),
  /* 
  #swagger.tags = ['Siswa']
    #swagger.summary = 'Perbarui profil saya'
    #swagger.description = 'Endpoint untuk memperbarui data profil siswa yang sedang login.'
    #swagger.security = [{ "bearerAuth": [] }]
    */
  siswaController.updateMyProfile
);

module.exports = router;
