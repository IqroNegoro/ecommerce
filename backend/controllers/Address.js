const { Address } = require("../models/Relationship");

const getAddress = async (req, res) => {
    try {
        let address = await Address.findAll({
            where: {
                user_id: req.user.id
            }
        });

        return res.status(200).json(address);
    } catch (err) {
        return res.status(500).json({
            message: "Failed to retrieve address",
            success: false
        })
    }
}

const addAddress = async (req, res) => {
    try {
        let addAddress = await Address.create({
            user_id: req.user.id,
            ...req.body
        });

        return res.status(200).json({
            addAddress,
            message: "Success Add Address",
            success: true
        });
    } catch (err) {
        return res.status(500).json({
            message: "Something Went Wrong"
        });
    }
}

const deleteAddress = async (req, res) => {
    try {
        let deleteAddress = await Address.destroy({
            where: {
                id: req.params.id
            }
        });

        return res.status(200).json({
            message: "Success delete address",
            success: true
        })
    } catch (err) {
        return res.status(500).json({
            message: "Failed delete address",
            success: false
        })
    }
}

module.exports = { getAddress, deleteAddress, addAddress }