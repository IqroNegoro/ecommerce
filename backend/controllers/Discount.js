const { Discount, Product } = require("../models/Relationship");

const getDiscount = async (req, res) => {
    try {
        let discount = await Discount.findAll();

        return res.status(200).json(discount);
    } catch (err) {
        return res.status(500).json({
            message: "Something Went Wrong"
        });
    }
}

const getDiscountById = async (req, res) => {
    try {
        let discount = await Discount.findOne({
            where: {
                id: req.params.id
            }
        });

        return res.status(200).json(discount);
    } catch (err) {
        return res.status(500).json({
            message: "Something Went Wrong"
        });
    }
}

const createDiscount = async (req, res) => {
    try {
        let discount = await Discount.create(req.body);

        return res.status(200).json(discount);
    } catch (err) {
        return res.status(500).json({
            message: "Something Went Wrong"
        })
    }
}

const updateDiscount = async (req, res) => {
    try {
        if (req.body.discount >= 100) {
            return res.status(400).json({
                message: "discount"
            });
        }

        let discount = await Discount.update(req.body, {
            where: {
                id: req.params.id
            }
        });

        if (discount[0]) {
            let updateDiscount = await Discount.findOne({
                where: {
                    id: req.params.id
                }
            });
            return res.status(200).json(updateDiscount);
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

const deleteDiscount = async (req, res) => {
    try {
        let discount = await Discount.destroy({
            where: {
                id: req.params.id
            }
        });

        let products = await Product.update({
            id_discount: null,
        },{
            where: {
                id_discount: req.params.id
            }
        });

        return res.status(200).json(discount);
    } catch (err) {
        return res.status(500).json({
            message: "Something Went Wrong"
        });
    }
}

module.exports = { getDiscount, createDiscount, deleteDiscount, getDiscountById, updateDiscount }