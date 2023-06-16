const { db } = require("./db");
const { DataTypes } = require("sequelize");

const Cart = db.define("cart", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    qty: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}, {
    timestamps: true,
    freezeTableName: true
});

module.exports = Cart