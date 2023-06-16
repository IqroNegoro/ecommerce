<template>
    <div class="bg-black bg-opacity-50 fixed w-full h-full top-0 left-0 z-[999] flex justify-center items-center custom-scroll">
        <div class="bg-white rounded-sm w-full md:w-1/2 p-4 overflow-y-auto relative custom-scroll">
            <i class="bx bx-left-arrow-alt absolute top-0 left-0 text-3xl m-4 cursor-pointer" @click="$emit('editCategoryStatus', false)"></i>
            <h1 class="text-center font-semibold text-2xl">Edit Category</h1>
            <div class="mt-4">
                <label for="" class="block font-semibold">Category Name</label>
                <input v-model="editCategoryData.name" type="text" class="h-8 w-full rounded-sm border-slate-500 border focus:ring-1 ring-blue-400 mb-2">
                <label for="" class="block font-semibold">Description</label>
                <textarea class="w-full" v-model="editCategoryData.description"></textarea>
            </div>
            <button class="w-full h-8 bg-blue-500 rounded-sm font-semibold text-xl text-white mt-2" @click="handleEditCategory"> Update </button>
        </div>
    </div>
</template>
<script>
import { inject, onMounted, ref } from 'vue'
import UserStore from '../state/User';
export default {
    name: "EditCategory",
    props: ["id"],
    setup({id}, {emit}) {
        const user = UserStore();
        const editCategoryData = ref({
            name: "",
            description: ""
        });
        const axios = inject("axios");
        const emitter = inject("emitter");

        onMounted(async () => {
            try {
                emitter.emit("isLoading", true);
                let category = await axios.get(`/category/${id}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                });

                editCategoryData.value = category.data;
                emitter.emit("isLoading", false);
            } catch (err) {
                emitter.emit("isLoading", true);
                emitter.emit("notificationActive", "Something Went Wrong");
            }
        })

        const handleEditCategory = async () => {
            if (Object.keys(editCategoryData.value).some(v => editCategoryData.value[v]== "")) {
                emitter.emit("notificationActive", "Please fill all field");
                return;
            }
            
            try {
                emitter.emit("isLoading", true);

                let addCategory = await axios.put(`/category/${id}`, editCategoryData.value, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    }
                });

                emit("updatedCategory", addCategory.data);
                emitter.emit("isLoading", false);
                emitter.emit("notificationActive", "Success Edit Category");
                emit("editCategoryStatus", false)
            } catch (err) {
                emitter.emit("isLoading", false);
                emitter.emit("notificationActive", "Something Went Wrong");
            }
        }

        return { editCategoryData, handleEditCategory }
    }
}
</script>