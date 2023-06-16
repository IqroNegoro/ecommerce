const { Category, Product } = require("../models/Relationship");

const getCategory = async (req, res) => {
    try {
        let category = await Category.findAll();

        return res.status(200).json(category);
    } catch (err) {
        return res.status(500).json({
            message: "Something Wrong"
        });
    }
}

const createCategory = async (req, res) => {
    try {
        let category = await Category.create(req.body);
        
        return res.status(200).json(category);
    } catch (err) {
        return res.status(500).json({
            message: "Soemthing Wrong"
        });
    }
}

const getCategoryById = async (req, res) => {
    try {
        let category = await Category.findOne({
            where: {
                id: req.params.id
            }
        });

        return res.status(200).json(category);
    } catch (err) {
        return res.status(500).json({
            message: "Something Went Wrong"
        })
    }
}

const updateCategory = async (req, res) => {
    try {
        let updatedCategory = await Category.update(req.body, {
            where: {
                id: req.params.id
            }
        });

        if (updatedCategory[0]) {
            let category = await Category.findOne({
                where: {
                    id: req.params.id
                }
            })
            return res.status(200).json(category);
        }

        return res.status(500).json({
            message: "Something Went Error"
        });
    } catch (err) {
        return res.status(500).json({
            message: "Something Went Wrong"
        });
    }
}

const deleteCategory = async (req, res) => {
    try {
        let category = await Category.destroy({
            where: {
                id: req.params.id
            }
        });

        if (!category) {
            return res.status(500).json({
                message: "Something Went Wrong"
            });    
        }

        await Product.update({
            id_category: null,
        }, {
            where: {
                id_category: req.params.id
            }
        })

        return res.status(200).json(category);
    } catch (err) {
        return res.status(500).json({
            message: "Something Went Wrong"
        });
    }
}

module.exports = { getCategory, createCategory, deleteCategory, updateCategory, getCategoryById }