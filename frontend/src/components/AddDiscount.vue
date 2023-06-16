<template>
    <div class="bg-black bg-opacity-50 fixed w-full h-full top-0 left-0 z-[999] flex justify-center items-center custom-scroll">
        <div class="bg-white rounded-sm w-full md:w-1/2 p-4 overflow-y-auto relative custom-scroll">
            <i class="bx bx-left-arrow-alt absolute top-0 left-0 text-3xl m-4 cursor-pointer" @click="$emit('addDiscountStatus', false)"></i>
            <h1 class="text-center font-semibold text-2xl">Add New Discount</h1>
            <div class="mt-4">
                <label for="" class="block font-semibold">Discount Name</label>
                <input type="text" v-model="addDiscountData.name" class="h-8 w-full rounded-sm border-slate-500 border focus:ring-1 ring-blue-400 mb-2">
                <label for="" class="block font-semibold">Description</label>
                <textarea class="w-full" v-model="addDiscountData.description"></textarea>
                <label for="" class="block font-semibold">Discount Percentage</label>
                <input type="number" v-model="addDiscountData.discount_percentage" class="h-8 w-full rounded-sm border-slate-500 border focus:ring-1 ring-blue-400 mb-2">
            </div>
            <div class="radius-md h-12 grid grid-cols-[1fr,2fr] grid-rows-1 border-2 border-blue-500 w-full mb-2 relative">
                <div class="bg-blue-500 flex justify-center items-center border-r-2 border-dotted">
                    <p class="text-white">{{ addDiscountData.discount_percentage }}%</p>
                </div>
                <div class="bg-white flex justify-center items-center">
                    <p class="text-center">{{ addDiscountData.name }}</p>
                </div>
            </div>
            <button class="w-full h-8 bg-blue-500 rounded-sm font-semibold text-xl text-white mt-2" @click="handleAddDiscount"> Add </button>
        </div>
    </div>
</template>
<script>
import { inject, ref } from 'vue';
import UserStore from '../state/User'
export default {
    name: "AddDiscount",
    setup(props, {emit}) {
        const user = UserStore();
        let addDiscountData = ref({
            name: "",
            description: "",
            discount_percentage: "",
            active: 1,
        });
        let axios = inject("axios");
        let emitter = inject("emitter");

        const handleAddDiscount = async () => {
            if (Object.keys(addDiscountData.value).some(v => addDiscountData.value[v]== "")) {
                emitter.emit("notificationActive", "Please fill all field");
                return;
            }
            
            try {
                emitter.emit("isLoading", true);
                let addDiscount = await axios.post("/discount", addDiscountData.value, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                })
                addDiscountData.value = {
                    name: "",
                    description: "",
                    discount_percentage: "",
                    active: 1,
                }
                emit("addNewDiscount", addDiscount.data);
                emit("addDiscountStatus", false);
                emitter.emit("notificationActive", "Success Create Discount");
                emitter.emit("isLoading", false);
            } catch (err) {
                emitter.emit("isLoading", false);
                emitter.emit("notificationActive", "Something Went Wrong");
            }
        }

        return { handleAddDiscount, addDiscountData }
    }
}
</script>