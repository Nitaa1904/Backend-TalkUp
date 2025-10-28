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

module.exports = router;
