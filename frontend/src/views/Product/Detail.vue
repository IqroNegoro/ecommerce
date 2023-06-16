<template>
    <div class="grid grid-cols-1 grid-rows-2 min-h-screen mt-20" v-if="product">
        <div class="w-full">
            <img :src="port + product.image" alt="" class="w-full lg:w-1/2 mx-auto">
        </div>
        <div class="p-4">
            <h1 class="font-bold text-4xl">{{ product.name }}</h1>
            <p class="text-2xl font-semibold text-gray-500">{{ 
                product.category?.name
            }}</p>
            <p class="text-2xl font-semibold text-gray-500" v-if="!product.discount">{{ 
                new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR"
                }).format(product.price)
            }}</p>
            <p class="text-2xl font-semibold text-gray-500" v-if="product.discount">{{ 
                new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR"
                }).format(product.price - (product.price * product.discount.discount_percentage / 100))
            }}</p>
            <p class="text-md font-semibold text-gray-500 line-through" v-if="product.discount">{{ 
                new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR"
                }).format(product.price)
            }}</p>
            <p class="mt-16 font-light tracking-wider">
                {{ product.description }}
            </p>
            <div class="flex mt-16 gap-4">
                <button class="bg-blue-400 hover:bg-blue-500 text-white font-semibold p-3 grow" @click="handleAddToCart">Add To Cart</button>
                <button class="hover:bg-red-500 pt-2 px-4 transition-all duration-300 rounded-sm border hover:text-white text-3xl"><i class="bx bx-heart"></i></button>
            </div>
        </div>        
    </div>
</template>
<script>
import { ref, onMounted, inject } from "vue";
import CartStore from "@/state/Cart";
import UserStore from "@/state/User";
export default {
    name: "ProductDetail",
    props: ["id"],
    setup({id}) {
        let user = UserStore();
        let cart = CartStore();
        let product = ref(null);
        let axios = inject("axios");
        let port = inject("port");
        let emitter = inject("emitter");

        onMounted(async () => {
            try {
                emitter.emit("isLoading", true);
                let detail = await axios.get(`products/${id}`);
                product.value = detail.data
                emitter.emit("isLoading", false);
            } catch (err) {
                emitter.emit("isLoading", false);
                emitter.emit("notificationActive", "Something Went Wrong");
            }
        });
        
        const handleAddToCart = async () => {
            if (user.authenticated) {
                cart.addProduct({...product.value});
            } else {
                emitter.emit("signInAlertActive");
                emitter.emit("signInAlertImage", product.value.image);
            }
        }

        return { product, handleAddToCart, port }
    }
}
</script>