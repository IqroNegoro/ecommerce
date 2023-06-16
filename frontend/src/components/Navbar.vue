<template>
    <div class="fixed top-0 left-0 shadow-md w-full h-20 flex justify-between items-center px-8 bg-white z-[999]">
        <div class="flex items-center justify-between">
            <button><i class="bx bx-menu text-3xl" @click="$emit('sidebarActive', true)"></i></button>
            <div class="ml-8">
                <ul>
                    <li>
                        <router-link :to="{name: 'home'}" class="text-gray-700" :class="{'nav-active': $route.name == 'home'}">Home</router-link>
                    </li>
                </ul>
            </div>
        </div>
        <div>
            <ul>
                <template v-if="!user.authenticated">
                    <li class="inline mr-4">
                        <router-link :to="{name: 'login'}" :class="{'nav-active': $route.name == 'login'}">Sign In</router-link>
                    </li>
                    <li class="inline mr-4">
                        <router-link :to="{name: 'register'}" :class="{'nav-active': $route.name == 'register'}">Sign Up</router-link>
                    </li>
                </template>
                <template v-else>
                    <li class="inline relative pt-4 pr-4 mr-4">
                        <div class="absolute top-0 right-0 bg-blue-400 text-white rounded-full px-2 text-sm">
                            {{ totalNotification }}
                        </div>
                        <!-- <router-link :to="{name: 'cart'}" :class="{'nav-active': $route.name == 'cart'}"><i class="bx bx-cart text-xl"></i></router-link> -->
                        <button @click="notificationStatus = !notificationStatus"><i class="bx bx-bell text-xl"></i></button>
                        <div class="absolute bg-white backdrop-blur-sm border-2 w-96 -translate-x-full grid grid-flow-row grid-cols-1" v-if="notificationStatus">
                            <router-link :to="{name: 'orderDetail', params: {id: notification.order.id}}" v-for="notification in notification.notifications" :key="notification.id" class="p-4 cursor-pointer" :class="{'bg-slate-100': !notification.isRead}" @click="updateNotification(notification.id)">
                                <img :src="port + notification.order.orders[0]?.products.image" :alt="notification.order.orders[0]?.products.name" class="w-16 h-16 float-left mx-2">
                                <p class="text-xl font-semibold">{{ notification.message }}</p>
                                <p class="text-slate-400">Click For More Information</p>
                            </router-link>
                            <div v-if="!notification.notifications.length" class="bg-gray-500 h-32 flex justify-center items-center flex-col p-4">
                                <i class="bx bx-bell text-3xl"></i>
                                <p class="text-md">
                                    There No Notifications
                                </p>
                            </div>
                        </div>
                    </li>
                    <li class="inline relative pt-4 pr-4">
                        <div class="absolute top-0 right-0 bg-blue-400 text-white rounded-full px-2 text-sm">
                            {{ totalCart }}
                        </div>
                        <!-- <router-link :to="{name: 'cart'}" :class="{'nav-active': $route.name == 'cart'}"><i class="bx bx-cart text-xl"></i></router-link> -->
                        <button @click="$emit('sideCartActive', true)"><i class="bx bx-cart text-xl"></i></button>
                    </li>
                </template>
            </ul>
        </div>
    </div>
</template>
<script>
import CartStore from "@/state/Cart";
import NotificationStore from "@/state/Notification";
import UserStore from "@/state/User";
import { computed, inject, ref } from 'vue';
export default {
    name: "Navbar",
    setup() {
        let user = UserStore();
        let cart = CartStore();
        let axios = inject("axios");
        let port = inject("port");
        let notification = NotificationStore();
        let notificationStatus = ref(false);

        let totalCart = computed(() => cart.products.length);
        let totalNotification = computed(() => notification.notifications.filter(v => !v.isRead).length);

        const updateNotification = async id => {
            try {
                let updatingNotification = await axios.get(`/notifications/${id}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                });

                notification.notifications.find(v => v.id == id).isRead = updatingNotification.data.isRead;
            } catch (err) {
            }
        }

        return { user, totalCart, totalNotification, notification, port, notificationStatus, updateNotification }
    }
}
</script>