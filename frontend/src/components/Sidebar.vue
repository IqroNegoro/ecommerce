<template>
    <div class="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-75 z-[999] flex justify-start items-end" @click="$emit('sidebarActive', false)">
        <div class="h-full bg-white shadow-md w-96 p-8 relative animate-slide" @click.stop>
            <button class="absolute top-0 right-0 m-4" @click="$emit('sidebarActive', false)">
                <i class="bx bx-x text-3xl text-gray-400 hover:text-gray-500"></i>
            </button>
            <div class="mt-12 grid grid-cols-1 grid-flow-row gap-4">
                <router-link :to="{name: 'order'}" class="block p-2 w-full rounded-md hover:bg-gray-200" :class="{'bg-blue-500': $route.name == 'order'}">
                <i style="padding-top: -1rem" class="bx bx-package text-xl text-black mr-3"></i>
                <span class="text-black font-semibold">My Orders</span>
                </router-link> 
                <router-link :to="{name: 'address'}" class="block p-2 w-full rounded-md hover:bg-gray-200" :class="{'bg-blue-500': $route.name == 'address'}">
                <i style="padding-top: -1rem" class="bx bx-map text-xl text-black mr-3"></i>
                <span class="text-black font-semibold">My Address</span>
                </router-link> 
                <template v-if="user.admin">
                    <hr>
                    <h1>Administrator</h1>
                    <router-link :to="{name: 'adminOrders'}" class="block p-2 w-full rounded-md hover:bg-gray-200" :class="{'bg-blue-500': $route.name == 'adminOrders'}">
                    <i style="padding-top: -1rem" class="bx bx-package text-xl text-black mr-3"></i>
                    <span class="text-black font-semibold">Orders</span>
                    </router-link>
                    <router-link :to="{name: 'adminProducts'}" class="block p-2 w-full rounded-md hover:bg-gray-200" :class="{'bg-blue-500': $route.name == 'adminProducts'}">
                    <i style="padding-top: -1rem" class="bx bx-list-ul text-xl text-black mr-3"></i>
                    <span class="text-black font-semibold">Products</span>
                    </router-link>
                    <router-link :to="{name: 'adminCategory'}" class="block p-2 w-full rounded-md hover:bg-gray-200" :class="{'bg-blue-500': $route.name == 'adminCategory'}">
                    <i style="padding-top: -1rem" class="bx bxs-dashboard text-xl text-black mr-3"></i>
                    <span class="text-black font-semibold">Category</span>
                    </router-link>
                    <router-link :to="{name: 'adminDiscount'}" class="block p-2 w-full rounded-md hover:bg-gray-200" :class="{'bg-blue-500': $route.name == 'adminDiscount'}">
                    <i style="padding-top: -1rem" class="bx bxs-discount text-xl text-black mr-3"></i>
                    <span class="text-black font-semibold">Discount</span>
                    </router-link>
                </template>
            </div>
        </div>
    </div>
</template>
<script>
import UserStore from '../state/User';
export default {
    name: "Sidebar",
    props: ["active"],
    setup() {
        const user = UserStore();
        return { user }
    }
}
</script>
<style scoped>
.animate-slide {
    animation: slide 0.25s ease-in;
}

@keyframes slide {
    from {
        transform: translateX(-100%)
    }

    to {
        transform: translateX(0)
    }
}

</style>