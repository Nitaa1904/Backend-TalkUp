const express = require("express");
const router = express.Router();
const { verifyToken, verifyRole } = require("../middlewares/authMiddleware");
const adminController = require("../controllers/adminController");

router.post(
  "/add-guru-bk",
  verifyToken,
  verifyRole("super_admin"),
  adminController.addGuruBk
  /*
    #swagger.tags = ['Super Admin']
    #swagger.summary = 'Tambah data guru BK'
    #swagger.description = 'Endpoint untuk menambah data Guru BK (hanya Super Admin).'
    #swagger.security = [{ "bearerAuth": [] }]
  */
);

router.post(
  "/add-siswa",
  verifyToken,
  verifyRole("super_admin"),
  adminController.addSiswa
  /*
    #swagger.tags = ['Super Admin']
    #swagger.summary = 'Tambah data siswa'
    #swagger.description = 'Endpoint untuk menambah data siswa (hanya Super Admin).'
    #swagger.security = [{ "bearerAuth": [] }]
  */
);

router.get(
  "/users",
  verifyToken,
  verifyRole("super_admin"),
  adminController.getAllUsers
  /*
    #swagger.tags = ['Super Admin']
    #swagger.summary = 'Lihat semua pengguna'
    #swagger.security = [{ "bearerAuth": [] }]
  */
);

module.exports = router;
