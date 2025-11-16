const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const validationMiddleware = require("../middlewares/validationMiddleware");
const authController = require("../controllers/authController");

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email tidak valid"),
    body("password").notEmpty().withMessage("Password wajib diisi"),
  ],
  validationMiddleware,
  authController.login
  /*
    #swagger.tags = ['Auth']
    #swagger.summary = 'Login pengguna'
    #swagger.description = 'Login untuk Super Admin, Guru BK, dan Siswa.'
  */
);

router.post(
  "/register",
  [
    body("nama_lengkap")
      .notEmpty()
      .withMessage("Nama lengkap wajib diisi")
      .isLength({ min: 3 })
      .withMessage("Nama lengkap minimal 3 karakter"),
    body("kelas")
      .notEmpty()
      .withMessage("Kelas wajib diisi"),
    body("email")
      .isEmail()
      .withMessage("Email tidak valid")
      .normalizeEmail(),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password minimal 8 karakter")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage("Password harus mengandung huruf besar, huruf kecil, dan angka"),
  ],
  validationMiddleware,
  authController.register
  /*
    #swagger.tags = ['Auth']
    #swagger.summary = 'Registrasi siswa baru'
    #swagger.description = 'Membuat akun siswa baru dan menyimpan data ke tabel users serta siswa.'
    #swagger.parameters['obj'] = {
      in: 'body',
      description: 'Data registrasi siswa',
      required: true,
      schema: {
        nama_lengkap: "John Doe",
        kelas: "XI RPL 1",
        email: "john@example.com",
        password: "Password123"
      }
    }
    #swagger.responses[201] = {
      description: 'Registrasi berhasil',
      schema: {
        message: "Registrasi siswa berhasil",
        data: {
          user: {
            id: 1,
            id_ref: 1,
            role: "siswa",
            email: "john@example.com"
          },
          siswa: {
            id: 1,
            nama_lengkap: "John Doe",
            kelas: "XI RPL 1",
            email_sekolah: "john@example.com"
          }
        }
      }
    }
    #swagger.responses[409] = {
      description: 'Email sudah terdaftar',
      schema: {
        status: "Failed",
        message: "Email sudah terdaftar",
        isSuccess: false,
        data: null
      }
    }
    #swagger.responses[400] = {
      description: 'Validasi gagal',
      schema: {
        status: "Failed",
        message: "Validasi input gagal",
        isSuccess: false,
        errors: ["Error message"],
        data: null
      }
    }
  */
);

module.exports = router;
