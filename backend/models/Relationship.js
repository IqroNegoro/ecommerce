const User = require("./User");
const Product = require("./Product");
const Category = require("./Category");
const Cart = require("./Cart");
const Order = require("./Order");
const OrderDetail = require("./OrderDetail");
const Address = require("./Address");
const Discount = require("./Discount");
const Notifications = require("./Notifications");

Category.hasMany(Product, {
    foreignKey: "id_category",
    as: "product"
});

Product.belongsTo(Category, {
    foreignKey: "id_category",
    as: "category"
});

Product.hasMany(Cart, {
    foreignKey: "product_id",
    as: "cart",
})

Product.belongsTo(Discount, {
    foreignKey: "id_discount",
    as: "discount"
})

User.hasMany(Cart, {
    foreignKey: "user_id",
    as: "cart"
});

User.hasMany(OrderDetail, {
    foreignKey: "id",
    as: "orderDetail"
});

Cart.belongsTo(User, {
    foreignKey: "user_id",
    as: "user"
});

Cart.belongsTo(Product, {
    foreignKey: "product_id",
    as: "product",
});

Order.belongsTo(Product, {
    foreignKey: "product_id",
    as: "products"
})

OrderDetail.hasMany(Order, {
    foreignKey: "orders_detail_id",
    as: "orders"
});

OrderDetail.belongsTo(User, {
    foreignKey: "user_id",
    as: "user"
})

OrderDetail.belongsTo(Address, {
    foreignKey: "address_id",
    as: "addresses"
});

Address.hasMany(OrderDetail, {
    foreignKey: "id",
    as: "orderDetail"
})

Address.belongsTo(User, {
    foreignKey: "user_id",
    as: "user"
})

Discount.hasMany(Product, {
    foreignKey: "id_discount",
    as: "product"
});

Notifications.belongsTo(User, {
    foreignKey: "user_id",
    as: "user"
});

Notifications.belongsTo(OrderDetail, {
    foreignKey: "order_detail_id",
    as: "order"
})

module.exports = { User, Category, Product, Cart, Address, Order, OrderDetail, Discount, Notifications }