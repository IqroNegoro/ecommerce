const { Notifications, User, OrderDetail, Order, Product } = require("../models/Relationship");

const getNotifications = async (req, res) => {
    try {
        let notifications = await Notifications.findAll({
            where: {
                user_id: req.user.id
            },
            order: [["createdAt", "DESC"]],
            limit: 10,
            include: [
                {
                    model: OrderDetail,
                    as: "order",
                    required: false,
                    include: [
                        {
                            model: Order,
                            as: "orders",
                            required: false,
                            include: [
                                {
                                    model: Product,
                                    as: "products",
                                    required: false
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        return res.status(200).json(notifications);
    } catch (err) {
        return res.status(500).json({
            message: "Something Went Wrong"
        });
    }
}

const updateNotification = async (req, res) => {
    try {
        let notification = await Notifications.update({
            isRead: 1
        }, {
            where: {
                id: req.params.id
            }
        });

        if (notification[0]) {
            return res.status(200).json({
                isRead: true
            });
        }

        return res.status(500).json({
            message: "Something Went Wrong"
        });
    } catch (err) {
        return res.status(500).json({
            message: "Something Went Wrong"
        });
    }
}

module.exports = { getNotifications, updateNotification }