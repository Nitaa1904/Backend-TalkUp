const express = require("express");
const router = express.Router();
const { verifyToken, verifyRole } = require("../middlewares/authMiddleware");
const { check } = require("express-validator");
const validationMiddleware = require("../middlewares/validationMiddleware");
const siswaController = require("../controllers/siswaController");

router.get(
  "/me",
  verifyToken,
  verifyRole("siswa"),
  [
    check("email_sekolah")
      .optional()
      .isEmail()
      .withMessage("Email sekolah tidak valid"),
    check("nama_lengkap").optional().notEmpty().withMessage("Nama wajib diisi"),
    check("email").optional().isEmail().withMessage("Email tidak valid"),
    check("password")
      .optional()
      .isLength({ min: 6 })
      .withMessage("Password minimal 6 karakter"),
  ],
  validationMiddleware,
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
