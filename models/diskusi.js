'use strict';
module.exports = (sequelize, DataTypes) => {
  const diskusi = sequelize.define('diskusi', {
    id_diskusi: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    id_pembuat: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    topik: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    isi_diskusi: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    is_anonim: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    tgl_post: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    jumlah_balasan: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    tableName: 'diskusi',
    timestamps: true,
    underscored: true
  });

  diskusi.associate = function(models) {
    diskusi.belongsTo(models.users, {
      foreignKey: 'id_pembuat',
      as: 'pembuat'
    });
  };

  return diskusi;
};