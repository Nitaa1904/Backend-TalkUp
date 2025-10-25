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
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Data saya yang akan diperbaharui',
        required: true,
        schema: {
            email_sekolah: "nita@smktelkom.sch.id",
              nama_lengkap: "Nita Lestari",
              email: "nita@smktelkom.id",
              password: "nita123"
        }
      }
    */
  siswaController.updateMyProfile
);

module.exports = router;
