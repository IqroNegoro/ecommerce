<template>
    <div class="mt-20" v-if="orders">
        <h1 class="text-3xl font-bold text-center">Your Orders</h1>
        <p class="text-center">Check status of orders, discover similiar products</p>

        <div class="divide-y-2 w-3/4 mx-auto mt-14">
            <div v-for="order in orders" :key="order.id">
                <div class="flex justify-between border-b-2 pb-1 mt-8">
                    <h2 class="text-xl font-semibold">Order #{{ order.id }}</h2>
                    <div class="flex gap-4">
                        <button class="border-2 border-red-500 rounded-sm p-2 py-1 px-2 text-red-500" v-if="order.status == 'cancel'">Canceled</button>
                        <button class="border-2 border-gray-500 rounded-sm p-2 py-1 px-2 text-gray-500" v-if="order.status == 'create'">Pending</button>
                        <button class="border-2 border-gray-500 rounded-sm p-2 py-1 px-2 text-gray-500" v-if="order.status == 'pending'">Pending</button>
                        <button class="border-2 border-blue-500 rounded-sm p-2 py-1 px-2 text-blue-500" v-if="order.status == 'confirmed'">Confirmed</button>
                        <button class="border-2 border-green-500 rounded-sm p-2 py-1 px-2 text-green-500" v-if="order.status == 'success'">Success</button>
                        <router-link :to="{name: 'orderDetail', params: { id: order.id }}" class="bg-green-400 hover:bg-green-500 px-4 text-white rounded-sm flex items-center justify-center">
                            {{ order.payment_status == 'paid' ? 'Detail' : 'Paid'}}
                        </router-link>
                    </div>
                </div>
                <div class="p-4 grid grid-cols-1 grid-flow-row divide-y-2">
                    <div class="px-2 py-4 flex" v-for="product in order.orders" :key="product.id">
                        <template v-if="product.products != null">
                            <img :src="port + product.products.image" alt="" class="w-1/6">
                            <div class="relative w-full px-4">
                            <h1 class="text-2xl block">{{ product.products.name }}</h1>
                            <p class="text-black font-semibold">
                                {{ 
                                    new Intl.NumberFormat("id-ID", {
                                        style: "currency",
                                        currency: "IDR"
                                    }).format(product.products.price)
                                }}
                            </p>
                            <p>Qty: {{ product.qty }}</p>
                            <p class="text-black font-semibold">
                                Total:
                                {{ 
                                    new Intl.NumberFormat("id-ID", {
                                        style: "currency",
                                        currency: "IDR"
                                    }).format(product.products.price * product.qty)
                                 }}
                            </p>
                        </div>
                    </template>
                    <template v-else>
                        <h1>This Product Not Found</h1>
                    </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import UserStore from '@/state/User'
import { inject, onMounted, ref } from 'vue';
export default {
    name: "Order",
    setup() {
        const user = UserStore();
        const orders = ref(null);
        const port = inject("port");
        const axios = inject("axios");
        const emitter = inject("emitter");

        onMounted(async () => {
            try {
                emitter.emit("isLoading", true);
                let order = await axios.get("orders", {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                })
                
                orders.value = order.data;
                emitter.emit("isLoading", false);
            } catch (err) {
                emitter.emit("isLoading", false);
                emitter.emit("notificationActive", "Something Went Wrong");
            }
        })

        return { orders, port }
    }
}
</script>