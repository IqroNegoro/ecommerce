<template>
    <div class="mt-20 p-12 grid md:grid-cols-2 grid-cols-1 grid-rows-1" v-if="orders">
        <div class="p-8 bg-gray-50">
            <h1 class="my-4 font-bold text-2xl">Order Summary</h1>
            <div class="grid grid-flow-row grid-cols-1 divide-solid divide-y-2">
                <div class="relative p-3 flex" v-for="product in orders.orders" :key="product.id">
                    <img :src="port + product.products.image" alt="" class="w-48">
                    <div class="relative w-full px-4">
                        <h1 class="text-2xl block">{{ product.products.name }}</h1>
                        <p class="text-black font-semibold">
                            {{
                                new Intl.NumberFormat("id-ID", {
                                    style: "currency",
                                    currency: "IDR"
                                }).format(product.products.discount ? product.products.price - (product.products.price * product.products.discount.discount_percentage / 100) : product.products.price)
                            }}
                        </p>
                        <p>Qty: {{ product.qty }}</p>
                        <p class="text-black font-semibold">
                            Total:
                            {{
                                new Intl.NumberFormat("id-ID", {
                                    style: "currency",
                                    currency: "IDR"
                                }).format(product.products.discount ? (product.products.price - (product.products.price * product.products.discount.discount_percentage / 100)) * product.qty : product.products.price * product.qty)
                            }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div class="p-8 bg-gray-50">
            <div>
                <h1 class="my-4 font-bold text-2xl">Detail</h1>
                <table class="table-auto border-0 w-full">
                <tbody>
                    <tr class="border-0">
                        <td>Order ID :</td>
                        <td> {{ orders.response_midtrans.order_id }} </td>
                    </tr>
                    <tr class="border-0">
                        <td>Transaction ID :</td>
                        <td> {{ orders.response_midtrans.transaction_id }} </td>
                    </tr>
                    <tr class="border-0">
                        <td>Payment :</td>
                        <td> {{ orders.response_midtrans.payment_type == "bank_transfer" ? orders.response_midtrans.va_numbers[0].bank : orders.response_midtrans.payment_type }} </td>
                    </tr>
                    <tr class="border-0" v-if="orders.response_midtrans.payment_type == 'bank_transfer'">
                        <td>VA Numbers :</td>
                        <td>{{ orders.response_midtrans.va_numbers[0].va_number }}</td>
                    </tr>
                    <tr class="border-0">
                        <td>Status :</td>
                        <td> {{ orders.response_midtrans.transaction_status }} </td>
                    </tr>
                    <tr class="border-0" v-if="orders.response_midtrans.transaction_status == 'pending'">
                        <td>Valid Until :</td>
                        <td> {{ moment(orders.response_midtrans.expiry_time).format("DD MMMM Y HH:mm:ss") }} </td>
                    </tr>
                    <tr v-else>
                        <td>Settlement Time :</td>
                        <td> {{ moment(orders.response_midtrans.settlement_time).format("DD MMMM Y HH:mm:ss") }} </td>
                    </tr>
                    <tr>
                        <td>Total :</td>
                        <td>{{
                            new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR"
                            }).format(orders.response_midtrans.gross_amount) 
                        }}</td>
                    </tr>
                    <tr v-if="orders.response_midtrans.payment_type == 'gopay'">
                        <td>
                            <img src="https://api.sandbox.midtrans.com/v2/gopay/a67416b3-3243-4213-8d8c-13d25cfe5639/qr-code" alt="" class="w-full">
                        </td>
                    </tr>
                </tbody>
                </table>
            </div>
            <div>
                <h1 class="my-4 font-bold text-2xl">Shipping Address</h1>
                <table class="table-auto border-0 w-full">
                    <tbody>
                        <tr class="border-0">
                            <td>Name :</td>
                            <td> {{ orders.addresses.user.name }} </td>
                        </tr>
                        <tr class="border-0">
                            <td>Phone :</td>
                            <td> {{ orders.addresses.user.phone }} </td>
                        </tr>
                        <tr class="border-0">
                            <td>Province :</td>
                            <td> {{ orders.addresses.province }} </td>
                        </tr>
                        <tr class="border-0">
                            <td>City :</td>
                            <td> {{ orders.addresses.city }} </td>
                        </tr>
                        <tr class="border-0">
                            <td>Detail :</td>
                            <td> {{ orders.addresses.detail }} </td>
                        </tr>
                        <tr class="border-0">
                            <td>Postal Code :</td>
                            <td> {{ orders.addresses.postal_code }} </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div>
                <h1 class="my-4 font-bold text-2xl">Status</h1>
                <table class="table-auto border-0 w-full">
                    <tbody>
                        <tr class="border-0">
                            <td>Status :</td>
                            <td> {{ orders.status }} </td>
                        </tr>
                        <tr class="border-0">
                            <td>Payment Status :</td>
                            <td> {{ orders.payment_status }} </td>
                        </tr>
                        <tr class="border-0">
                            <td>Payment Provider :</td>
                            <td> {{ orders.method }} </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-if="user.admin">
                <button class="w-full bg-green-400 hover:bg-green-500 text-white mt-8 text-2xl py-2" v-if="orders.status == 'pending'" @click="confirmOrder">
                    Confirm
                </button>
                <button class="w-full bg-blue-400 hover:bg-blue-500 text-white mt-8 text-2xl py-2" v-if="orders.status == 'confirmed'" @click="successOrder">
                    Success
                </button>
                <button class="w-full bg-red-400 hover:bg-red-500 text-white mt-4 text-2xl py-2" v-if="cancelStatus" @click="cancelOrder">
                    Cancel
                </button>
            </div>
            <div v-else>
                <button class="w-full bg-green-400 hover:bg-green-500 text-white mt-8 text-2xl py-2" v-if="orders.status == 'create'" @click="getOrder">
                    I Have Paid
                </button>
            </div>
        </div>
    </div>
</template>
<script>
import { computed, inject, onMounted, ref } from 'vue';
import UserStore from '@/state/User';
import moment from "moment";

export default {
    name: "Cart",
    props: ["id"],
    setup({id}) {
        const user = UserStore();
        let port = inject("port");
        let axios = inject("axios");
        let emitter = inject("emitter");
        let orders = ref(null);
        let cancelStatus = computed(() => orders.value.status != 'cancel' && orders.value.status != 'success');

        const getOrder = async () => {
            try {
                emitter.emit("isLoading", true);
                let data = await axios.get(`orders/detail/${id}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                });

                
                orders.value = data.data;
                orders.value.response_midtrans = JSON.parse(orders.value.response_midtrans);

                emitter.emit("isLoading", false);
            } catch (err) {
                emitter.emit("isLoading", false);
                emitter.emit("notificationActive", "Something Went Wrong");
            }
        }

        onMounted(() => {
            getOrder();
        });

        const confirmOrder = async () => {
            try {
                emitter.emit("isLoading", true);
                let order = await axios.post(`/orders/${id}/status`, {
                    status: 'confirmed'
                }, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                });

                orders.value = order.data;
                orders.value.response_midtrans = JSON.parse(orders.value.response_midtrans);

                emitter.emit("isLoading", false);
            } catch (err) {
                emitter.emit("isLoading", false);
                emitter.emit("notificationActive", "Something Went Wrong");
            }
        }

        const cancelOrder = async () => {
            try {
                emitter.emit("isLoading", true);
                let order = await axios.post(`/orders/${id}/status`, {
                    status: 'cancel'
                }, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                });

                orders.value = order.data;
                orders.value.response_midtrans = JSON.parse(orders.value.response_midtrans);

                emitter.emit("isLoading", false);
            } catch (err) {
                emitter.emit("isLoading", false);
                emitter.emit("notificationActive", "Something Went Wrong");
            }

        }
        
        const successOrder = async () => {
            try {
                emitter.emit("isLoading", true);
                let order = await axios.post(`/orders/${id}/status`, {
                    status: 'success'
                }, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                });

                orders.value = order.data;
                orders.value.response_midtrans = JSON.parse(orders.value.response_midtrans);

                emitter.emit("isLoading", false);
            } catch (err) {
                emitter.emit("isLoading", false);
                emitter.emit("notificationActive", "Something Went Wrong");
            }    
        }

        return { port, orders, moment, getOrder, confirmOrder, cancelOrder, successOrder, cancelStatus, user }
    }
}
</script>