const { db } = require("./db");
const { DataTypes } = require("sequelize");

const Discount = db.define("discount", {
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
        type: DataTypes.TEXT,
        allowNull: false
    },
    discount_percentage: {
        type: DataTypes.INTEGER(11),
        allowNull: false
    },
    active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 1
    }
}, {
    timestamps: true,
    freezeTableName: true
});

module.exports = Discount