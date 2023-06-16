const { db } = require("./db");
const { DataTypes } = require("sequelize");

const Category = db.define("categories", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    timestamps: true,
    freezeTableName: true
});

module.exports = Category