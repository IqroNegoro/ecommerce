<template>
    <form @submit.prevent="checkout" class="divide-y">
        <div class="mt-20 p-12 grid md:grid-cols-2 grid-cols-1 grid-rows-1">
            <div class="p-8 bg-gray-50">
                <div class="mb-16">
                    <h1 class="my-4 font-bold text-2xl">Select Address</h1>
                    <label for="address" class="block mt-8">Choose Address</label>
                    <select name="" id="address" class="w-full" v-model="checkoutDetail.address_id">
                        <option value="">Select Address</option>
                        <option :value="address.id" v-for="(address, i) in address" :key="i">
                            {{ address.province }}, {{ address.city }}, {{ address.detail }}, {{ address.postal_code }}
                        </option>
                    </select>
                </div>
                <div class="my-16">
                    <h1 class="my-4 font-bold text-2xl">Payment</h1>
                    <div class="grid grid-cols-3 grid-rows-1">
                        <div>
                            <input id="e-wallet-type" type="radio" class="mr-3" checked value="ewallet"
                                v-model="checkoutDetail.payment_type">
                            <label for="e-wallet-type">E-Wallet</label>
                        </div>
                        <div>
                            <input id="bank-type" type="radio" class="mr-3" value="bank"
                                v-model="checkoutDetail.payment_type">
                            <label for="bank-type">Bank Transfer</label>
                        </div>
                    </div>
                    <div v-if="checkoutDetail.payment_type == 'ewallet'">
                        <label for="e-wallet" class="block mt-8">Choose E-Wallet</label>
                        <select name="" id="e-wallet" class="w-full" v-model="checkoutDetail.payment_provider">
                            <option value="">Select E-Wallet</option>
                            <option value="gopay">GoPay</option>
                        </select>
                    </div>
                    <div v-else>
                        <label for="bank" class="block mt-8">Choose Bank</label>
                        <select name="" id="bank" class="w-full" v-model="checkoutDetail.payment_provider">
                            <option value="">Select Bank</option>
                            <option value="bca">BCA</option>
                            <option value="bni">BNI</option>
                            <option value="bri">BRI</option>
                            <option value="permata">Permata</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="p-8 bg-gray-50">
                <h1 class="my-4 font-bold text-2xl">Order Summary</h1>
                <div class="grid grid-flow-row grid-cols-1 divide-solid divide-y-2">
                    <div v-if="!products.length">
                        <h1 class="my-4 font-bold text-2xl text-center">Order Some Item</h1>
                    </div>
                    <div v-else class="relative p-3 flex" v-for="(product, i) in products" :key="i">
                        <i class="z-[998] bx bx-trash absolute top-0 right-0 m-4 rounded-full p-2 transition-all duration-300 hover:bg-red-500 hover:text-white cursor-pointer"
                            @click="removeItem(product.id)"></i>
                        <img :src="port + product.image" alt="" class="w-48">
                        <div class="relative w-full px-4">
                            <h1 class="text-2xl block">{{ product.name }}</h1>
                            <p class="text-black font-semibold">
                                {{
                                    new Intl.NumberFormat("id-ID", {
                                        style: "currency",
                                        currency: "IDR"
                                    }).format(product.discount ? (product.price - (product.price * product.discount.discount_percentage / 100)) : product.price)
                                }}
                            </p>
                            <p>Qty: {{ product.qty }}</p>
                            <p class="text-black font-semibold">
                                Total:
                                {{
                                    new Intl.NumberFormat("id-ID", {
                                        style: "currency",
                                        currency: "IDR"
                                    }).format(product.discount ? (product.price - (product.price * product.discount.discount_percentage / 100)) * product.qty : product.price * product.qty)
                                }}
                            </p>
                            <div class="flex justify-around w-full items-center absolute bottom-0 left-0">
                                <button type="button"
                                    class="border-2 rounded-md hover:bg-blue-500 hover:text-white transition-all duration-300 pt-1 px-2"
                                    @click="handleDecrementProduct(product.id)">
                                    <i class="bx bx-minus"></i>
                                </button>
                                <p>{{ product.qty }}</p>
                                <button type="button"
                                    class="border-2 rounded-md hover:bg-blue-500 hover:text-white transition-all duration-300 pt-1 px-2"
                                    @click="handleIncrementProduct(product.id)">
                                    <i class="bx bx-plus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <button v-if="products.length" type="submit"
                        class="mx-auto block w-full bg-blue-400 hover:bg-blue-500 text-white transition-all duration:300 rounded-sm p-3 mt-12">Checkout</button>
                    <router-link :to="{ name: 'home' }" v-else
                        class="mx-auto block w-full bg-blue-400 hover:bg-blue-500 text-white transition-all duration:300 rounded-sm p-3 mt-12 text-center">Shopping</router-link>
                </div>
            </div>
        </div>
        <div v-if="isErrorPartner" class="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-75 z-[9999] flex justify-center items-center">
            <div class="w-3/4 p-4 bg-white rounded-sm flex justify-center items-center flex-col">
                <i class="bx bx-error-circle text-8xl text-red-500 mb-8"></i>
                <h1 class="text-center font-semibold text-2xl">This payment provider having experience some issues, please choose another method or try again</h1>
                <button class="bg-blue-500 ext-white rounded-sm py-1 px-2 text-2xl text-white mt-8" @click="isErrorPartner = false">Close</button>
            </div>
        </div>
        <div v-if="successOrder" class="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-75 z-[9999] flex justify-center items-center">
            <div class="w-3/4 p-4 bg-white rounded-sm flex justify-center items-center flex-col">
                <i class="bx bx-check-circle text-8xl text-green-500 mb-8"></i>
                <h1 class="text-center font-semibold text-2xl">Order Created, Click Next For Detail</h1>
                <div class="flex gap-4">
                    <button class="bg-blue-500 ext-white rounded-sm py-1 px-2 text-xl text-white mt-8" @click="successOrder = false">Close</button>
                    <router-link :to="{name: 'order'}" class="bg-green-500 ext-white rounded-sm py-1 px-2 text-xl text-white mt-8">Next</router-link>
                </div>
            </div>
        </div>
    </form>
</template>
<script>
import CartStore from '@/state/Cart';
import { computed, inject, ref } from 'vue';
import UserStore from '@/state/User';

export default {
    name: "Cart",
    setup() {
        const user = UserStore();
        const cart = CartStore();
        let port = inject("port");
        let address = ref([]);
        let isErrorPartner = ref(false);
        let successOrder = ref(false);
        let axios = inject("axios");
        let emitter = inject("emitter");
        let products = computed(() => cart.products);
        let checkoutDetail = ref({
            address_id: "",
            payment_type: "ewallet",
            payment_provider: "",
            orders: products.value,
            total: computed(() => cart.products.map(v => v.discount ? (v.price - (v.price * v.discount.discount_percentage / 100)) * v.qty : v.price * v.qty).reduce((current, next) => current + next, 0))
        });

        const getAddress = async () => {
            try {
                emitter.emit("isLoading", true);
                let getAddress = await axios.get("/address", {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                })

                address.value = getAddress.data
                emitter.emit("isLoading", false);
            } catch (err) {
                emitter.emit("isLoading", false);
                emitter.emit("notificationActive", "Something Went Wrong");
            }
        }

        const handleIncrementProduct = id => {
            cart.incrementProduct(id);
        }

        const handleDecrementProduct = id => {
            cart.decrementProduct(id);
        }

        const removeItem = id => {
            cart.removeProduct(id);
        }

        const checkout = async () => {
            try {
                emitter.emit("isLoading", true);
                let ordering = await axios.post("/checkout", checkoutDetail.value, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                });

                // cart.emptyCart();
                emitter.emit("isLoading", false);
                successOrder.value = true;
            } catch (err) {
                emitter.emit("isLoading", false);
                if (err.response.data.message == "address") {
                    emitter.emit("notificationActive", "Please Select Address!");
                    return;
                }

                if (err.response.data.message == "payment_type") {
                    emitter.emit("notificationActive", "Please Select Payment Type!");
                    return;
                }

                if (err.response.data.status == "503") {
                    isErrorPartner.value = true;
                }
            }
        }

        getAddress();

        return { products, port, handleIncrementProduct, handleDecrementProduct, removeItem, getAddress, address, checkoutDetail, checkout, isErrorPartner, successOrder }
    }
}
</script>