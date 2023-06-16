const { Cart, Product, Order, Discount, Category } = require("../models/Relationship");
const { unlink } = require("fs");

const getProducts = async (req, res) => {
    try {
        let products = await Product.findAll({
            include: [{
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

        return res.status(200).json(products);
    } catch (err) {
        return res.status(500).json({
            message: "Error When Retrieve Products",
        })
    }
};

const createProduct = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                error: "photo"
            })
        }

        let create = await Product.create({...req.body, id_discount: req.body.id_discount || null, id_category: req.body.id_category || null, image: "img/" + req.file.filename});
        
        return res.status(200).json(create);
    } catch (err) {
        unlink(`public/img/${req.file.filename}`, err => err);
        return res.status(500).json({
            message: "Product Failed to create",
        })
    }
}

const getProductById = async (req, res) => {
    try {
        let product = await Product.findOne({
            where: {
                id: req.params.id
            },
            include: [{
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

        return res.status(200).json(product);
    } catch (err) {
        return res.status(500).json({
            message: "Failed To Get Product",
        })
    }
}

const updateProduct = async (req, res) => {
    try {
        let beforeProduct = await Product.findOne({
            where: {
                id: req.params.id
            }
        });

        let updatedData = {...req.body, id_discount: req.body.id_discount == 'null' ? null : req.body.id_discount, id_category: req.body.id_category == 'null' ? null : req.body.id_category};

        if (req.file) {
            updatedData = {...req.body, id_discount: updatedData.id_discount == 'null' ? null : updatedData.id_discount, id_category: updatedData.id_category == 'null' ? null : updatedData.id_category, image: "img/" + req.file.filename};
        }

        let updating = await Product.update(updatedData, {
            where: {
                id: req.params.id
            }
        });

        if (!updating[0]) {
            unlink(`public/${req.file.filename}`, err => err);
            return res.status(500).json({
                message: "Failed To Updated Product"
            });
        }

        if (req.file) {
            unlink(`public/${beforeProduct.image}`, err => err);
        }

        let product = await Product.findOne({
            where: {
                id: req.params.id
            }
        });

        return res.status(200).json(product);
    } catch (err) {
        return res.status(500).json({
            message: "Failed To Update Product"
        })
    }
}

const deleteProduct = async (req, res) => {
    try {
        let product = await Product.findOne({
            where: {
                id: req.params.id
            }
        });

        let deleteProduct = await Product.destroy({
            where: {
                id: req.params.id
            }
        });

        if (!deleteProduct) {
            return res.status(500).json({
                message: "Failed To Delete Product",
            })
        }

        unlink(`public/${product.image}`, err => err);

        let cart = await Cart.destroy({
            where: {
                product_id: req.params.id
            }
        });

        let orders = await Order.destroy({
            where: {
                product_id: req.params.id
            }
        });

        return res.status(200).json({
            message: "Success Delete Product"
        })
    } catch (err) {
        return res.status(500).json({
            message: "Failed To Delete Product",
        })
    }
}

module.exports = { getProducts, createProduct, getProductById, deleteProduct, updateProduct }