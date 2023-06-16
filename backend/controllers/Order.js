const { Order, OrderDetail, Product, User, Address, Discount, Category, Notifications } = require("../models/Relationship");

const midtrans = require("midtrans-client");
const randomstring = require("randomstring");
const { Op } = require("sequelize");

let coreApi = new midtrans.CoreApi({
    isProduction: false,
    serverKey: process.env.SERVER_KEY,
    clientKey: process.env.CLIENT_KEY
});

const getOrders = async (req, res) => {
    try {
        let orders = await OrderDetail.findAll({
            where: {
                user_id: req.user.id
            },
            order: [
                [
                    "id",
                    "DESC"
                ]
            ],
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
        });
        
        return res.status(200).json(orders);
    } catch (err) {
        return res.status(500).json({
            message: "Failed to retrieve orders",
            success: false
        })
    }
}

const getConfirmedOrders = async (req, res) => {
    try {
        let orders = await OrderDetail.findAll({
            where: {
                payment_status: "paid",
                [Op.not]: [
                    {
                        status: "create"
                    },
                ]
            },
            order: [["updatedAt", "DESC"]],
            include: [{
                model: User,
                as: "user",
                required: false,
            }, {
                model: Order,
                as: "orders",
                required: false,
                include: [{
                    model: Product,
                    as: "products",
                    required: false
                }]
            }],
            attributes: {
                exclude: ["response_midtrans", "order_id"]
            }
        });
        return res.status(200).json(orders)
    } catch (err) {
        return res.status(500).json({
            message: "Something Went Wrong"
        });
    }
}

const createOrders = async (req, res) => {
    try {
        let orderDetail = req.body.orders.sort((a, b) => a.id - b.id).map(v => ({user_id: req.user.id, product_id: v.id, name: v.name, price: v.discount ? (v.price - (v.price * v.discount.discount_percentage / 100)) * v.qty : v.price * v.qty, qty: v.qty}));

        let products = await Product.findAll({
            where: {
                id: orderDetail.map(v => v.product_id)
            },
            include: [
                {
                    model: Discount,
                    as: "discount",
                    required: false
                }, {
                    model: Category,
                    as: "category",
                    required: false
                }
            ]
        });
        
        let address = await Address.findOne({
            where: {
                id: req.body.address_id,
                user_id: req.user.id
            }
        });

        let checkPrice = products.map((v, i) => v.discount ? (v.price - (v.price * v.discount.discount_percentage / 100)) * orderDetail[i].qty : v.price * orderDetail[i].qty).reduce((current, next) => current + next, 0)

        if (req.body.total != checkPrice) {
            return res.status(400).json({
                where: "Something Went Wrong"
            });
        }

        
        let item_details = products.map((v, i) => ({id: v.id, price: v.discount ? (v.price - (v.price * v.discount.discount_percentage / 100)) : v.price * orderDetail[i].qty, quantity: orderDetail[i].qty, name: v.name}));

        let transaction_details = {
            gross_amount: req.body.total,
            order_id: randomstring.generate(30)
        };

        let customer_details = {
            first_name: req.user.name,
            last_name: "",
            email: req.user.email,
            phone: req.user.phone,
            shipping_address: {
                first_name: req.user.name,
                last_name: "",
                email: req.user.email,
                phone: req.user.phone,
                address: address.detail,
                city: address.city,
                postal_code: address.postal_code,
                country_code: "IDN"
            }
        };
        
        // return res.status(200);
        let payment_type = {};
        
        if (!req.body.payment_provider) {
            return res.status(400).json({
                message: "payment_type"
            });
        };

        if (!req.body.address_id) {
            return res.status(400).json({
                message: "address"
            });
        }

        if (req.body.payment_type == 'ewallet') {
            payment_type = {
                payment_type: req.body.payment_provider
            }
        } else if (req.body.payment_type == 'bank') {
            if (req.body.payment_provider == "permata") {
                payment_type = {
                    payment_type: "permata"
                }
            } else {
                payment_type = {
                    payment_type: "bank_transfer",
                    bank_transfer: {
                        bank: req.body.payment_provider
                    }
                }
            }
        }

        let parameter = {
            ...payment_type,
            transaction_details,
            customer_details,
            item_details
        };

        let response = coreApi.charge(parameter).then(async result => {
            let createDetail = await OrderDetail.create({
                order_id: result.order_id,
                user_id: req.user.id,
                payment_status: "unpaid",
                status: "create",
                address_id: req.body.address_id,
                amount: req.body.total,
                method: req.body.payment_provider,
                response_midtrans: JSON.stringify(result)
            });

            orderDetail = orderDetail.map(v => ({orders_detail_id: createDetail.id, ...v}));

            let bulkOrder = await Order.bulkCreate(orderDetail);

            
            return res.status(200).json(result);
        });
    } catch (err) {
        return res.status(500).json(err)
    }
}

const handlePayment = async (req, res) => {
    try {
        coreApi.transaction.notification(req.body).then(async res => {
            let { transaction_status, fraud_status } = req.body;
            if (transaction_status == 'settlement' && fraud_status == "accept") {
                let orderDetail = await OrderDetail.update({
                        payment_status: "paid",
                        status: "pending",
                        response_midtrans: JSON.stringify(res)
                    }, {
                    where: {
                        order_id: req.body.order_id
                    }
                });

            }
        }).catch(err => err)
    } catch (err) {
    }
}

const getDetailOrders = async (req, res) => {
    try {
        let orders = await OrderDetail.findOne({
            where: {
                id: req.params.id
            },
            include: [
                {
                    model: Order,
                    as: "orders",
                    required: false,
                    include: [
                        {
                            model: Product,
                            as: "products",
                            required: false,
                            include: [
                                {
                                    model: Discount,
                                    as: "discount",
                                    required: false

                                }
                            ]
                        }
                    ]
                },
                {
                    model: Address,
                    as: "addresses",
                    required: false,
                    include: [
                        {
                            model: User,
                            as: "user",
                            required: false,
                            attributes: {
                                exclude: ["password", "admin", "email"]
                            }
                        }
                    ]
                }
            ]
        })

        return res.status(200).json(orders);
    } catch (err) {
        return res.status(500).json({
            message: "Failed to retrieve orders",
            success: false
        })
    }
}

const statusOrder = async (req, res) => {
    try {
        let orders = await OrderDetail.update(req.body, {
            where: {
                id: req.params.id
            }
        });

        if (orders[0]) {
            let updatedOrder = await OrderDetail.findOne({
                where: {
                    id: req.params.id
                },
                include: [
                    {
                        model: Order,
                        as: "orders",
                        required: false
                    }
                ]
            });

            if (updatedOrder.status == 'confirmed') {
                let productsId = updatedOrder.orders.map(v => ({product_id: v.product_id, qty: v.qty}));

                for (let x of productsId) {
                    let product = await Product.findOne({
                        where: {
                            id: x.product_id
                        }
                    })
                    
                    await product.decrement({
                        stock: x.qty
                    });
                }
            }

            if (updatedOrder.status == 'cancel') {
                let productsId = updatedOrder.orders.map(v => ({product_id: v.product_id, qty: v.qty}));

                for (let x of productsId) {
                    let product = await Product.findOne({
                        where: {
                            id: x.product_id
                        }
                    })
                    
                    product.increment({
                        stock: x.qty
                    });
                }
            }

            let [notification, created] = await Notifications.findOrCreate({
                where: {
                    order_detail_id: req.params.id,
                    user_id: updatedOrder.user_id,
                },
                defaults: {
                    order_detail_id: req.params.id,
                    user_id: updatedOrder.user_id,
                    message: `Your Order Has ${req.body.status.replace(/^[a-zA-Z]/gi, x => x.toUpperCase())}!`,
                    isRead: 0,
                    type: req.body.status
                }
            });

            if (notification) {
                await notification.update({
                    message: `Your Order Has ${req.body.status.replace(/^[a-zA-Z]/gi, x => x.toUpperCase())}!`,
                    isRead: 0,
                    type: req.body.status
                })
            }

            let updatedOrders = await OrderDetail.findOne({
                where: {
                    id: req.params.id
                },
                include: [
                    {
                        model: Order,
                        as: "orders",
                        required: false,
                        include: [
                            {
                                model: Product,
                                as: "products",
                                required: false,
                                include: [
                                    {
                                        model: Discount,
                                        as: "discount",
                                        required: false
    
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        model: Address,
                        as: "addresses",
                        required: false,
                        include: [
                            {
                                model: User,
                                as: "user",
                                required: false,
                                attributes: {
                                    exclude: ["password", "admin", "email"]
                                }
                            }
                        ]
                    }
                ]
            })

            return res.status(200).json(updatedOrders)
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



module.exports = { getOrders, createOrders, handlePayment, getDetailOrders, getConfirmedOrders, statusOrder }