<template>
    <div class="grid grid-cols-1 md:grid-cols-[1fr,2fr] grid-rows-1 h-screen w-full">
        <div class="border py-24 px-8 flex justify-around items-center flex-col">
            <div class="text-center">
                <h1 class="text-3xl font-bold">Sign Up</h1>
                <p class="text-gray-500">For Ordering and mores!</p>
            </div>
            <div class="w-full">
                <form @submit.prevent="handleSubmit">
                    <label for="" class="block font-semibold">Name</label>
                    <input type="text" v-model="register.name" class="h-8 w-full rounded-sm border-slate-500 border focus:ring-1 ring-blue-400">
                    <label for="" class="block font-semibold mt-8">Phone</label>
                    <input type="number" v-model="register.phone" class="h-8 w-full rounded-sm border-slate-500 border focus:ring-1 ring-blue-400">
                    <label for="" class="block font-semibold mt-8">Email</label>
                    <input type="email" v-model="register.email" class="h-8 w-full rounded-sm border-slate-500 border focus:ring-1 ring-blue-400">
                    <label for="" class="block font-semibold mt-8">Password</label>
                    <input type="password" v-model="register.password" class="h-8 w-full rounded-sm border-slate-500 border focus:ring-1 ring-blue-400">
                    <button type="submit" class="bg-blue-400 hover:bg-blue-500 w-full rounded-sm text-white font-medium mt-8 py-3 transition-all duration-300">Sign Up</button>
                </form>
            </div>
        </div>
        <div class="hidden md:flex items-center justify-center" style="background: linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.75)), url('img/csm.webp'); background-position: center; background-size: cover; background-repeat: no-repeat">
            <h1 class="text-4xl text-white font-semibold">Your First Place To Shop Anime Thing</h1>
        </div>
    </div>    
</template>
<script>
import { inject, ref } from 'vue'
import router from '@/router';
export default {
    name: "Register",
    setup() {
        let register = ref({
            name: "",
            phone: "",
            email: "",
            password: ""
        });
        let axios = inject("axios");
        let emitter = inject("emitter");

        const handleSubmit = async () => {
            try {
                emitter.emit("isLoading", true)
                let signIn = await axios.post("/register", register.value);

                emitter.emit("isLoading", false)
                emitter.emit("notificationActive", "Register Completed, Please Log In");
                router.push({name: "login"});
            } catch (err) {
                console.log(err)
                emitter.emit("isLoading", false);
                emitter.emit("notificationActive", "Something Went Wrong");
            }
        }

        return { register, handleSubmit }
    }
}
</script>