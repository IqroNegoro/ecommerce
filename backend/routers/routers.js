const Authenticate = require("../controllers/Authenticate");
const Product = require("../controllers/Product");
const Order = require("../controllers/Order");
const Cart = require("../controllers/Cart");
const Category = require("../controllers/Category");
const Address = require("../controllers/Address");
const Discount = require("../controllers/Discount");
const Notification = require("../controllers/Notification");
const express = require("express");
const multer = require("multer");
const { nanoid } = require("nanoid");

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, __dirname + "/../public/img/");
        },
        filename: (req, file, cb) => {
            cb(null, nanoid() + "." + file.mimetype.split("/").pop());
        }
    }),
    fileFilter: (req, file, cb) => {
        if (!["jpg", "png", "jpeg"].includes(file.mimetype.split('/')[1])) {
            cb(null, false)
        } else {
            cb(null, true)
        };
    },
})

const jwt = require("jsonwebtoken");

const router = express.Router();

const JWTCheck = (role = false) => {
    return (req, res, next) => {
    if (req.headers.authorization) {
        const user = jwt.verify(req.headers.authorization.split(/\s/)[1] || "", process.env.JWT_SECRET);
        if (user) {
            req.user = user;
            if (role) {
                if (user.admin) {
                    next();
                    return;
                }

                return res.status(403).json({
                    message: "Forbidden!"
                });
            }
            next()
            return;
        }
    } 

    return res.status(401).json({
        message: "Authenticated first!",
        success: false
    })
}}

router.post("/register", Authenticate.register);
router.post("/login", Authenticate.login);

//Address router
router.get("/address", JWTCheck(), Address.getAddress);
router.post("/address", JWTCheck(), Address.addAddress)
router.delete("/address/:id", JWTCheck(), Address.deleteAddress);

//Product routes
router.get("/products", Product.getProducts);
router.post("/products", JWTCheck(), upload.single("image"), Product.createProduct);
router.get("/products/:id", Product.getProductById);
router.put("/products/:id", JWTCheck(), upload.single("image"), Product.updateProduct);
router.delete("/products/:id", JWTCheck(), Product.deleteProduct);

//Category routes
router.get("/category", Category.getCategory);
router.post("/category", Category.createCategory);
router.get("/category/:id", Category.getCategoryById);
router.put("/category/:id", Category.updateCategory);
router.delete("/category/:id", Category.deleteCategory);

//Cart routes
router.get("/carts", JWTCheck(), Cart.getCart);
router.post("/carts", JWTCheck(), Cart.addToCart);
router.post("/carts/qty", JWTCheck(), Cart.handleQty);

router.get("/orders", JWTCheck(), Order.getOrders);
router.get("/orders/detail/:id", JWTCheck(), Order.getDetailOrders);
router.post("/orders/:id/status", JWTCheck(true), Order.statusOrder);
router.get("/orders/confirmed", JWTCheck(true), Order.getConfirmedOrders);

router.get("/discount", JWTCheck(), Discount.getDiscount);
router.post("/discount", JWTCheck(), Discount.createDiscount);
router.get("/discount/:id", JWTCheck(), Discount.getDiscountById);
router.put("/discount/:id", JWTCheck(), Discount.updateDiscount);
router.delete("/discount/:id", JWTCheck(), Discount.deleteDiscount);

//Notification routes
router.get("/notifications", JWTCheck(), Notification.getNotifications);
router.get("/notifications/:id", JWTCheck(), Notification.updateNotification);

//Checkout routes
router.post("/checkout", JWTCheck(), Order.createOrders);
router.post("/notifications", Order.handlePayment);

module.exports = router;