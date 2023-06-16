const { db } = require("./db");
const { DataTypes } = require("sequelize");

const OrderDetail = db.define("orders_detail", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    order_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    address_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    amount: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    payment_status: {
        type: DataTypes.ENUM('unpaid', 'paid'),
        allowNull: false,
        defaultValue: 'unpaid'
    },
    status: {
        type: DataTypes.ENUM('cancel','create','pending','confirmed','success'),
        allowNull: false,
        defaultValue: "create"
    },
    method: {
        type: DataTypes.STRING,
        allowNull: false
    },
    response_midtrans: {
        type: DataTypes.TEXT,
        allowNull: true
    },
}, {
    timestamps: true,
    freezeTableName: true
});

module.exports = OrderDetail