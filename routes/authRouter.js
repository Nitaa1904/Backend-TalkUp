const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post(
  "/login",
  authController.login
  /*
    #swagger.tags = ['Auth']
    #swagger.summary = 'Login pengguna'
    #swagger.description = 'Login untuk Super Admin, Guru BK, dan Siswa.'
  */
);

module.exports = router;
