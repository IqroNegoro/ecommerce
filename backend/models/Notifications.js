const { db } = require("./db");
const { DataTypes } = require("sequelize");

const Notifications = db.define("notifications", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    order_detail_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0
    },
    type: {
        type: DataTypes.ENUM('cancel','create','pending','confirmed','success'),
        allowNull: false,
    }
}, {
    timestamps: true,
    freezeTableName: true
});

module.exports = Notifications