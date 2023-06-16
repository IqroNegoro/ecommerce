<template>
    <div class="grid grid-cols-1 md:grid-cols-[1fr,2fr] grid-rows-1 h-screen w-full">
        <div class="border py-24 px-8 flex justify-around items-center flex-col">
            <div class="text-center">
                <h1 class="text-3xl font-bold">Sign In</h1>
                <p class="text-gray-500">For See Your Order and mores!</p>
            </div>
            <div class="w-full">
                <form @submit.prevent="handleSubmit">
                    <label for="" class="block font-semibold">Email</label>
                    <input type="email" v-model="data.email" class="h-8 w-full rounded-sm border-slate-500 border focus:ring-1 ring-blue-400">
                    <label for="" class="block font-semibold mt-8">Password</label>
                    <input type="password" v-model="data.password" class="h-8 w-full rounded-sm border-slate-500 border focus:ring-1 ring-blue-400">
                    <button type="submit" class="bg-blue-400 hover:bg-blue-500 w-full rounded-sm text-white font-medium mt-8 py-3 transition-all duration-300">Sign Up</button>
                </form>
            </div>
        </div>
        <div class="hidden md:flex items-center justify-center" style="background: linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.75)), url('img/csm.webp'); background-position: center; background-size: cover; background-repeat: no-repeat">
            <h1 class="text-4xl text-white font-semibold text-center">Your First Place To Shop Anime Thing</h1>
        </div>
    </div>    
</template>
<script>
import router from '@/router';
import UserStore from '@/state/User';
import { inject, ref } from 'vue';

export default {
    name: "Login",
    setup() {
        let user = UserStore();
        let axios = inject("axios");
        let emitter = inject("emitter");
        let data = ref({
            email: "admin@gmail.com",
            password: "admin"
        });

        const handleSubmit = async () => {
            try {
                emitter.emit("isLoading", true);
                let signIn = await axios.post("/login", data.value);

                if (signIn.data)
                user.$patch({
                    ...signIn.data,
                    authenticated: true
                });
                
                emitter.emit("isLoading", false);
                router.push({name: "home"});
            } catch (err) {
                emitter.emit("isLoading", false)
                if (err.response.status == 404) {
                    emitter.emit("notificationActive", "Email or Password not found");
                    return;
                }
                emitter.emit("notificationActive", "Something Went Wrong")
            }
        }

        return { data, handleSubmit }
    }
}
</script>