const { Sequelize } = require("sequelize");

// DB NAME: ecommerce,
// DB USER: root,
// DB PASS:

const db = new Sequelize("ecommerce", "root", "", {
    host: "localhost",
    port: 3306,
    dialect: "mysql"
});

try {
    (async () => {
        await db.authenticate();
        console.log("Successfully Connected");
    })
} catch (err) {
    console.log("Error When Connecting");
};

module.exports = { db }