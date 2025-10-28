const { guru_bk } = require("../models");

const getAllGuruBk = async (req, res, next) => {
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
    next(error);
  }
};

module.exports = { getAllGuruBk };
