"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    static associate(models) {
      users.belongsTo(models.siswa, {
        foreignKey: "id_ref",
        constraints: false,
        as: "siswa",
      });

      users.belongsTo(models.guru_bk, {
        foreignKey: "id_ref",
        constraints: false,
        as: "guru_bk",
      });
    }
  }
  users.init(
    {
      id_ref: DataTypes.INTEGER,
      role: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "users",
    }
  );
  return users;
};
