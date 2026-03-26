const { Model, DataTypes, Sequelize } = require('sequelize');

const sequelize = require('../config/connection');

class Project extends Model {}

Project.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    xrType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    objectMethod: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    environmentMethod: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    platform: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    createdOn: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: 'project',
  },
);

// Export Project model
module.exports = Project;
