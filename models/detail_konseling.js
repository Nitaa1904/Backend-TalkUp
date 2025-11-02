"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DetailKonseling extends Model {
    static associate(models) {
      DetailKonseling.belongsTo(models.Konseling, {
        foreignKey: "id_konseling",
        as: "konseling",
      });
    }
  }
  DetailKonseling.init(
    {
      id_detail: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      id_konseling: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: "konseling",
          key: "id",
        },
      },
      tgl_sesi: {
        type: DataTypes.DATE, // TIMESTAMP WITH TIME ZONE
        allowNull: true,
        comment: "Tanggal dan waktu sesi disepakati (jika Status = Disetujui/Selesai)",
      },
      jam_sesi: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: "Waktu sesi disepakati (e.g., \"10.00-11.00\")",
      },
      link_atau_ruang: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: "Link meeting (Online) atau Ruang BK (Offline)",
      },
      balasan_untuk_siswa: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      catatan_guru_bk: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "DetailKonseling",
      tableName: "detail_konseling",
      timestamps: true,
      freezeTableName: true,
    }
  );
  return DetailKonseling;
};