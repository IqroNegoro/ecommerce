<template>
    <div v-if="products">
        <div class="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
            <div class="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                <div v-for="product in products" :key="product.id">
                    <Product :product="product" />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Product from "@/components/Product";
import { ref, onMounted, inject } from "vue";
import CartStore from '@/state/Cart';
import UserStore from '@/state/User';
import NotificationStore from '@/state/Notification';
export default {
    name: "Home",
    components: {
        Product
    },
    setup() {
        const user = UserStore()
        let cart = CartStore();
        let notification = NotificationStore();
        let products = ref(null);
        let axios = inject("axios");
        let emitter = inject("emitter");

        if (user.authenticated) {
            if (!cart.products.length) {
                cart.getCart();
            }

            if (!notification.length) {
                notification.getNotifications();
            }
        }

        onMounted(async () => {
            try {
                emitter.emit("isLoading", true);
                let getProduct = await axios.get("products");
                products.value = getProduct.data;

                emitter.emit("isLoading", false);
            } catch (err) {
                emitter.emit("isLoading", false);
                emitter.emit("notificationActive", "Something Went Wrong");
            }
        });

        return { products }
    }
}
</script>