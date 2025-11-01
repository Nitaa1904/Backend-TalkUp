'use strict';
module.exports = (sequelize, DataTypes) => {
  const diskusi_balasan = sequelize.define('diskusi_balasan', {
    id_balasan: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    id_diskusi: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'diskusi',
        key: 'id_diskusi'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id_user'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    isi_balasan: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    is_anonim: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW
    }
  }, {
    tableName: 'diskusi_balasan',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  diskusi_balasan.associate = function(models) {
    diskusi_balasan.belongsTo(models.diskusi, {
      foreignKey: 'id_diskusi',
      as: 'diskusi'
    });
    
    diskusi_balasan.belongsTo(models.users, {
      foreignKey: 'id_user',
      as: 'user'
    });
  };

  return diskusi_balasan;
};
