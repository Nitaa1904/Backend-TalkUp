"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class guru_bk extends Model {
    static associate(models) {
      guru_bk.hasMany(models.siswa, {
        foreignKey: "guruBkId",
        as: "siswa_bimbingan",
      });

      guru_bk.hasMany(models.Konseling, {
        foreignKey: "id_guru_bk",
        as: "konseling_requests",
      });

      guru_bk.hasOne(models.users, {
        foreignKey: "id_ref",
        constraints: false,
        as: "akun",
      });
    }
  }
  guru_bk.init(
    {
      nama: DataTypes.STRING,
      jabatan: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "guru_bk",
    }
  );
  return guru_bk;
};
