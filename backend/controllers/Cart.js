const { Cart, Product, Discount, Category } = require("../models/Relationship");

const getCart = async (req, res) => {
    try {
        let cart = await Cart.findAll({
            where: {
                user_id: req.user.id
            },
            include: [
                {
                    model: Product,
                    as: "product",
                    required: false,
                    include: [
                        {
                            model: Discount,
                            as: "discount",
                            required: false
                        },
                        {
                            model: Category,
                            as: "category",
                            required: false
                        }
                    ]
                }
            ]
        });

        let products = cart.map(v => v.product != null ? ({
                id: v.product.id,
                name: v.product.name,
                image: v.product.image,
                description: v.product.description,
                stock: v.product.stock,
                price: v.product.price,
                id_discount: v.product.id_discount,
                discount: v.product.discount,
                id_category: v.product.id_category,
                category: v.product.category,
                qty: v.qty
            }) : []);

        return res.status(200).json(products)
    } catch (err) {
        return res.status(500).json({
            message: "Failed To Get Cart",
        })
    }
}

const addToCart = async (req, res) => {
    try {
        let product = await Product.findOne({
            where: {
                id: req.body.product_id
            }
        })

        if (product) {
            let addProduct = await Cart.create({
                user_id: req.user.id,
                product_id: product.id,
                qty: 1   
            });
            
            return res.status(200).json({
                addProduct,
                message: "Success Add Product",
                success: true
            });
        } else {
            return res.status(200).json({
                message: "Failed To Add Product",
                success: false
            })
        }
    } catch (err) {
        return res.status(500).json({
            message: "Error adding product",
            success: false
        })
    }
}

const handleQty = async (req, res) => {
    try {
        if (req.body.type == "increment") {
            let qty = await Cart.findOne({
                where: {
                    user_id: req.user.id,
                    product_id: req.body.product_id
                }
            });
            await qty.increment("qty", {by: 1});
        } 
        if (req.body.type == "decrement") {
            let qty = await Cart.findOne({  
                where: {
                    user_id: req.user.id,
                    product_id: req.body.product_id
                }
            });
            await qty.decrement("qty", {by: 1});
        }

        if (req.body.type == "remove") {
            let removing = await Cart.destroy({
                where: {
                    user_id: req.user.id,
                    product_id: req.body.product_id
                }
            })
        }

        return res.status(200).json({
            message: "Success",
            sucess: true
        })
    } catch (err) {
        return res.status(500).json({message: "Error when adding quantity", success: false});
    }
}

module.exports = { getCart, handleQty, addToCart }