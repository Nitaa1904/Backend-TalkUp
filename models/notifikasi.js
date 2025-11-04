"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Notifikasi extends Model {
    static associate(models) {
      Notifikasi.belongsTo(models.siswa, {
        foreignKey: "id_siswa",
        as: "siswa",
      });
    }
  }

  Notifikasi.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      id_siswa: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      pesan: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING(20),
        defaultValue: "belum_dibaca",
      },
      waktu: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Notifikasi",
      tableName: "notifikasi",
      timestamps: true,
      freezeTableName: true,
    }
  );

  return Notifikasi;
};
