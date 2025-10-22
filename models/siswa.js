"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class siswa extends Model {
    static associate(models) {
      siswa.belongsTo(models.guru_bk, {
        foreignKey: "guruBkId",
        as: "guru_bk",
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      });
      siswa.hasOne(models.users, {
        foreignKey: "id_ref",
        constraints: false,
        as: "user",
      });
    }
  }
  siswa.init(
    {
      email_sekolah: DataTypes.STRING,
      nama_lengkap: DataTypes.STRING,
      kelas: DataTypes.STRING,
      guruBkId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "siswa",
    }
  );

  return siswa;
};
