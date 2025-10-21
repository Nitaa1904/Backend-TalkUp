const { guru_bk } = require("../models");

const getAllGuruBk = async (req, res) => {
  try {
    const guruBk = await guru_bk.findAll({
      attributes: ["nama", "jabatan"],
    });

    res.status(200).json({
      status: "success",
      message: "Berhasil mengambil data Guru BK",
      data: guruBk,
    });
  } catch (error) {
    console.error("Error fetching Guru BK:", error);
    res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan pada server",
    });
  }
};

module.exports = { getAllGuruBk };
