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
        type: DataTypes.DATE,
        allowNull: true,
      },
      jam_sesi: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      link_atau_ruang: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      catatan_siswa: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      balasan_untuk_siswa: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      catatan_guru_bk: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      hasil_konseling: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      tgl_selesai: {
        type: DataTypes.DATE,
        allowNull: true,
      }
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
