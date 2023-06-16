import {
    defineStore
} from "pinia";
import axios from "axios";
import UserStore from "./User";

let PORT = "http://localhost:3000/";

const CartStore = defineStore("cart", {
    state: () => ({
        products: [],
    }),
    actions: {
        async getCart() {
            try {
                const user = UserStore();
                let carts = await axios.get(`${PORT}carts`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                })

                this.products = carts.data
            } catch (err) {
                console.log(err)
            }
        },
        async addProduct(product) {
            try {
                const user = UserStore();
                if (this.products.find(v => v.id == product.id)) {
                    let incrementing = await axios.post(`${PORT}carts/qty`, {
                        product_id: product.id,
                        type: "increment"
                    }, {
                        headers: {
                            Authorization: `Bearer ${user.token}`
                        }
                    });
                    this.products.find(v => v.id == product.id).qty++
                } else {
                    let addToCart = await axios.post(`${PORT}carts`, {
                        product_id: product.id,
                        qty: 1
                    }, {
                        headers: {
                            Authorization: `Bearer ${user.token}`
                        }
                    })
                    this.products.push({
                        ...product,
                        qty: 1
                    });
                }
            } catch (err) {
                console.log(err)
            }
        },
        async incrementProduct(id) {
            try {
                const user = UserStore();
                let incrementing = await axios.post(`${PORT}carts/qty`, {
                    product_id: id,
                    type: "increment"
                }, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                });
                this.products.find(v => v.id == id).qty++
            } catch (err) {
                console.log(err);
            }
        },
        async decrementProduct(id) {
            try {
                const user = UserStore();
                let product = this.products.find(v => v.id == id);

                if (product.qty > 0) {
                    let decrementing = await axios.post(`${PORT}carts/qty`, {
                        product_id: id,
                        type: "decrement"
                    }, {
                        headers: {
                            Authorization: `Bearer ${user.token}`
                        }
                    });
                    product.qty--
                }

                if (this.products.find(product => product.id == id).qty == 0) {
                    this.removeProduct(id);
                }
            } catch (err) {
                console.log(err)
            }

        },
        async removeProduct(id) {
            try {
                const user = UserStore();
                let removing = await axios.post(`${PORT}carts/qty`, {
                    product_id: id,
                    type: "remove"
                }, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                });
                this.products = this.products.filter(product => product.id != id);
            } catch (err) {
                console.log(err)
            }
        },
        emptyCart() {
            this.products = [];
        }
    }
})

export default CartStore;