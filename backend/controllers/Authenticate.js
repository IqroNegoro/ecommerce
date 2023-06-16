const { User } = require("../models/Relationship");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
    try {
        let created = await User.create({
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10)
        });

        return res.status(200).json({
            message: "Successfully registered",
            success: true
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Failed to register",
            success: false
        })
    }
};

const login = async (req, res) => {
    try {
        let user = await User.findOne({
            where: {
                email: req.body.email
            },
            attributes: {
                exclude: ["createdAt", "updatedAt"]
            }
        });

        if (user) {
            let confirmPassword = bcrypt.compareSync(req.body.password, user.password);

            if (confirmPassword) {
                const token = jwt.sign(JSON.stringify(user), process.env.JWT_SECRET);

                return res.status(200).json({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    admin: user.admin,
                    token,
                });
            } else {
                return res.status(404).json({
                    message: "Account Doesn't Exists",
                })
            }
        } else {
            return res.status(404).json({
                message: "Account Doesn't Exists",
            })
        }
    } catch (err) {
        return res.status(500).json({
            message: "Failed When Log In",
        })
    }
}

module.exports = { register, login }