const { db } = require("./db");
const { DataTypes } = require("sequelize");

const Product = db.define("products", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    price: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    id_discount: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    id_category: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
}, {
    timestamps: true,
    freezeTableName: true,
});

module.exports = Product