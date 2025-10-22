const express = require("express");
const router = express.Router();
const publicController = require("../controllers/publicController");

router.get(
  "/guru-bk",
  publicController.getAllGuruBk
  /*
    #swagger.tags = ['Public']
    #swagger.summary = 'Ambil semua data Guru BK (publik)'
    #swagger.description = 'Endpoint publik tanpa autentikasi.'
  */
);

module.exports = router;
