<template>
    <div class="fixed top-0 left-0 bg-black bg-opacity-75 w-full h-full z-[1000] flex items-center justify-center" v-if="image">
        <div class="bg-white rounded-md w-full h-screen md:w-1/2 md:h-96 lg:w-1/4 lg:h-96 flex items-center justify-around flex-col relative">
            <button class="top-0 right-0 m-4 absolute" @click="$emit('signInAlertActive', false)">
                <i class="bx bx-x rounded-full text-md p-1 hover:bg-gray-300 cursor-pointer"></i>
            </button>
            <h1 class="font-bold text-2xl">Sign In For Ordering</h1>
            <img :src="port + image" alt="" class="w-1/2">
            <div>
                <router-link class="bg-blue-400 hover:bg-blue-500 rounded-sm text-white font-semibold w-full py-1 block text-center mb-4" :to="{name: 'register'}">Sign Up</router-link>
                <p>Or Have Account? <router-link :to="{name: 'login'}" class="text-blue-500 font-semibold">Sign In</router-link> Instead</p>
            </div>
        </div>
    </div>
</template>
<script>
import { inject, ref } from 'vue'
export default {
    name: "SignAlert",
    setup() {
        let emitter = inject("emitter");
        let image = ref(null);
        let port = inject("port");

        emitter.on("signInAlertImage", e => image.value = e)

        return { image, port }
    }
}
</script>