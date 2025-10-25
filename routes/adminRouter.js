const express = require("express");
const router = express.Router();
const { verifyToken, verifyRole } = require("../middlewares/authMiddleware");
const adminController = require("../controllers/adminController");
const guruBkController = require("../controllers/guruBkController");
const siswaController = require("../controllers/siswaController");

// #swagger.tags = ['Super Admin']
// #swagger.summary = 'Tambah data guru BK'
// #swagger.description = 'Endpoint untuk menambah data Guru BK (hanya Super Admin).'
// #swagger.security = [{ "bearerAuth": [] }]
router.post(
  "/add-guru-bk",
  verifyToken,
  verifyRole("super_admin"),
  adminController.addGuruBk
);

router.get(
  "/guru-bk",
  verifyToken,
  verifyRole("super_admin"),
  guruBkController.getAllGuruBk
);

router.get(
  "/guru-bk/:id",
  verifyToken,
  verifyRole("super_admin"),
  guruBkController.getGuruBkById
);

router.put(
  "/guru-bk/:id",
  verifyToken,
  verifyRole("super_admin"),
  guruBkController.updateGuruBk
);

router.delete(
  "/guru-bk/:id",
  verifyToken,
  verifyRole("super_admin"),
  guruBkController.deleteGuruBk
);

// #swagger.tags = ['Super Admin']
// #swagger.summary = 'Tambah data siswa'
// #swagger.description = 'Endpoint untuk menambah data siswa (hanya Super Admin).'
// #swagger.security = [{ "bearerAuth": [] }]
router.post(
  "/add-siswa",
  verifyToken,
  verifyRole("super_admin"),
  adminController.addSiswa
);

router.get(
  "/siswa",
  verifyToken,
  verifyRole("super_admin"),
  siswaController.getAllSiswa
);

router.get(
  "/siswa/:id",
  verifyToken,
  verifyRole("super_admin"),
  siswaController.getSiswaById
);

router.put(
  "/siswa/:id",
  verifyToken,
  verifyRole("super_admin"),
  siswaController.updateSiswa
);

router.delete(
  "/siswa/:id",
  verifyToken,
  verifyRole("super_admin"),
  siswaController.deleteSiswa
);

// #swagger.tags = ['Super Admin']
// #swagger.summary = 'Lihat semua pengguna'
// #swagger.security = [{ "bearerAuth": [] }]
router.get(
  "/users",
  verifyToken,
  verifyRole("super_admin"),
  adminController.getAllUsers
);

module.exports = router;
