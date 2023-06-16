<template>
    <div class="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-75 z-[999] flex justify-end items-end" @click="$emit('sideCartActive', false)">
        <div class="h-full bg-white shadow-md w-96 p-8 relative animate-slide overflow-scroll" @click.stop>
            <h2 class="text-xl font-medium text-gray-900" id="slide-over-title">Shopping cart</h2>
            <button class="absolute top-0 right-0 m-4" @click="$emit('sideCartActive', false)">
                <i class="bx bx-x text-3xl text-gray-400 hover:text-gray-500"></i>
            </button>
            <div v-if="!products.length">
                <h1 class="my-4 font-bold text-2xl text-center">Your Carts Is Empty</h1>
            </div>
            <transition-group v-else class="grid grid-cols-1 grid-flow-row p-2 divide-y divide-solid relative" name="list" tag="div" appear>
                <div class="flex my-6 items-center h-full" v-for="product in products" :key="product.id">
                        <img :src="port + product.image" alt="" class="w-1/3">
                    <div class="relative w-full px-4">
                        <h1 class="text-lg block break-keep whitespace-nowrap">{{ product.name }}</h1>
                        <p class="text-black font-semibold text-sm">
                            {{ 
                                new Intl.NumberFormat("id-ID", {
                                    style: "currency",
                                    currency: "IDR"
                                }).format(product.discount ? (product.price - (product.price * product.discount.discount_percentage / 100)) : product.price)
                             }}
                        </p>
                        <p>Qty: {{ product.qty }}</p>
                        <p class="text-black font-semibold text-sm">
                            Total: 
                            {{ 
                                new Intl.NumberFormat("id-ID", {
                                    style: "currency",
                                    currency: "IDR"
                                }).format(product.discount ? (product.price - (product.price * product.discount.discount_percentage / 100)) * product.qty : product.price * product.qty)
                             }}
                        </p>
                        <div class="flex justify-around w-full items-center mt-4">
                            <button class="border-2 rounded-md hover:bg-blue-500 hover:text-white transition-all duration-300 pt-1 px-2"
                                @click="handleDecrementProduct(product.id)"
                            >
                                <i class="bx bx-minus"></i>
                            </button>
                            <p>{{ product.qty }}</p>
                            <button class="border-2 rounded-md hover:bg-blue-500 hover:text-white transition-all duration-300 pt-1 px-2"
                                @click="handleIncrementProduct(product.id)"
                            >
                                <i class="bx bx-plus"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </transition-group>
            <router-link :to="{name: 'cart'}" v-if="products.length" class="mx-auto block w-full bg-blue-400 hover:bg-blue-500 text-white transition-all duration:300 rounded-sm p-3 mt-12 text-center" @click="$emit('sideCartActive', false)">Checkout</router-link>
        </div>
    </div>
</template>
<script>
import CartStore from '@/state/Cart'
import { computed, inject } from 'vue';
export default {
    name: "Sidecart",
    props: ["active"],
    setup() {
        const cart = CartStore();
        let products = computed(() => cart.products);
        let port = inject("port");

        const handleIncrementProduct = id => {
            cart.incrementProduct(id);
        }

        const handleDecrementProduct = id => {
            cart.decrementProduct(id);
        }

        const removeItem = id => {
            cart.removeProduct(id);
        }

        return { products, port, handleIncrementProduct, handleDecrementProduct, removeItem }
    }
}
</script>
<style scoped>
.animate-slide {
    animation: slide 0.25s ease-in;
}

@keyframes slide {
    from {
        transform: translateX(100%)
    }

    to {
        transform: translateX(0)
    }
}

.list-leave-from {
    transform: scale(1);
    opacity: 1;
}

.list-leave-to {
    transform: scale(0.1);
    opacity: 0;
}

.list-leave-active {
    transition: all 0.2s linear;
    position: absolute;
}

.list-move {
    transition: all 0.2s linear;
}

</style>