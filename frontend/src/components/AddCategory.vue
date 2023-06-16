<template>
    <div class="bg-black bg-opacity-50 fixed w-full h-full top-0 left-0 z-[999] flex justify-center items-center custom-scroll">
        <div class="bg-white rounded-sm w-full md:w-1/2 p-4 overflow-y-auto relative custom-scroll">
            <i class="bx bx-left-arrow-alt absolute top-0 left-0 text-3xl m-4 cursor-pointer" @click="$emit('addCategoryStatus', false)"></i>
            <h1 class="text-center font-semibold text-2xl">Add New Category</h1>
            <div class="mt-4">
                <label for="" class="block font-semibold">Category Name</label>
                <input v-model="addCategoryData.name" type="text" class="h-8 w-full rounded-sm border-slate-500 border focus:ring-1 ring-blue-400 mb-2">
                <label for="" class="block font-semibold">Description</label>
                <textarea class="w-full" v-model="addCategoryData.description"></textarea>
            </div>
            <button class="w-full h-8 bg-blue-500 rounded-sm font-semibold text-xl text-white mt-2" @click="handleAddCategory"> Add </button>
        </div>
    </div>
</template>
<script>
import { inject, ref } from 'vue'
import UserStore from '../state/User';
export default {
    name: "AddCategory",
    setup(props, {emit}) {
        const user = UserStore();
        const addCategoryData = ref({
            name: "",
            description: ""
        });
        const axios = inject("axios");
        const emitter = inject("emitter");

        const handleAddCategory = async () => {
            if (Object.keys(addCategoryData.value).some(v => addCategoryData.value[v]== "")) {
                emitter.emit("notificationActive", "Please fill all field");
                return;
            }

            try {
                emitter.emit("isLoading", true);

                let addCategory = await axios.post("/category", addCategoryData.value, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    }
                });
                emit("addNewCategory", addCategory.data);
                emit("addCategoryStatus", false);
                emitter.emit("isLoading", false);
                emitter.emit("notificationActive", "Success Add New Category");
            } catch (err) {
                emitter.emit("isLoading", false);
                emitter.emit("notificationActive", "Something Went Wrong");
            }
        }

        return { addCategoryData, handleAddCategory }
    }
}
</script>