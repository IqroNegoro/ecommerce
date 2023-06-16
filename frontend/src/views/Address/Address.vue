<template>
    <div class="w-3/4 bg-gray-100 mt-20 p-4 mx-auto block">
        <h1 class="text-center text-2xl">My Address</h1>
        <form @submit.prevent="addAddress">
        <div class="mb-16">
            <h1 class="my-4 font-bold text-2xl">Add More Address</h1>
            <div class="grid grid-cols-2 gap-8 grid-rows-2">
                <div>
                    <label for="" class="font-semibold">Province</label>
                    <input type="text" v-model="data.province" class="w-full rounded-md mb-8">
                </div>
                <div>
                    <label for="" class="font-semibold">City</label>
                    <input type="text" v-model="data.city" class="w-full rounded-md mb-8">
                </div>
                <div>
                    <label for="" class="font-semibold">Detail Address</label>
                    <input type="text" v-model="data.detail" class="w-full rounded-md mb-8">
                </div>
                <div>
                    <label for="" class="font-semibold">Postal Code</label>
                    <input type="text" v-model="data.postal_code" class="w-full rounded-md mb-8">
                </div>
            </div>
            <button type="submit" class="w-full p-3 bg-blue-500 rounded-sm text-white font-semibold">Add</button>
        </div>
        </form>
    <div class="grid grid-cols-1 grid-flow-row">
            <div v-for="(address, i) in address" :key="i">
                <i class="bx bx-map"></i>
                <span class="text-xl">
                    {{ address.province }}, {{ address.city }}, {{ address.detail }}, {{ address.postal_code }}
                </span>
                <button @click="deleteAddress(address.id)">
                    <i class="bx bx-trash"></i>
                </button>
            </div>
        </div>
    </div>
</template>
<script>
import UserStore from '@/state/User';
import { inject, ref } from 'vue';
export default {
    name: "Address",
    setup() {
        const user = UserStore();
        let address = ref([]);
        let data = ref({
            province: "",
            city: "",
            detail: "",
            postal_code: ""
        })
        let axios = inject("axios");
        let emitter = inject("emitter");

        const getAddress = async () => {
            try {
                emitter.emit("isLoading", true);
                let data = await axios.get("/address", {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                });

                address.value = data.data;
                emitter.emit("isLoading", false);
            } catch (err) {
                emitter.emit("isLoading", false);
                emitter.emit("notificationActive", "Something Went Wrong")
            }
        }

        getAddress();

        const deleteAddress = async id => {
            try {
                emitter.emit("isLoading", true);
                let deleteAddress = await axios.delete(`/address/${id}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                });

                address.value = address.value.filter(v => v.id != id);
                emitter.emit("isLoading", false);
            } catch (err) {
                emitter.emit("isLoading", false);
                emitter.emit("notificationActive", "Something Went Wrong")
            }
        }

        const addAddress = async () => {
            try {
                emitter.emit("isLoading", true);
                let addAddress = await axios.post("/address", {
                    province: data.value.province,
                    city: data.value.city,
                    detail: data.value.detail,
                    postal_code: data.value.postal_code
                },{
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                });

                address.value.push(data.value)
                data.value = {
                    province: "",
                    city: "",
                    detail: "",
                    postal_code: ""
                };
                emitter.emit("isLoading", false);
            } catch (err) {
                emitter.emit("isLoading", false);
                emitter.emit("notificationActive", "Something Went Wrong")
            }
        }

        return { address, deleteAddress, addAddress, data }
    }
}
</script>