<template>
    <div class="mt-20 p-4">
        <h1 class="font-bold text-2xl text-center">List Category</h1>
        <button class="mx-auto block bg-blue-500 text-white font-semibold rounded-sm px-2 py-1 mt-2" @click="addCategoryStatus = true">Add New</button>
        <table class="table-auto mx-auto w-1/2 mt-4">
            <thead>
                <tr>
                    <th>No</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Act</th>
                </tr>
            </thead>
            <tbody>
                <tr class="text-center" v-for="(category, i) in category" :key="category.id">
                    <td>{{ i + 1 }}</td>
                    <td>{{ category.name }}</td>
                    <td>{{ category.description }}</td>
                    <td>
                        <div class="flex justify-evenly items-center">
                            <button class="bg-green-400 hover:bg-green-500 px-4 text-white flex items-center justify-center" @click="handleEditCategory(category.id)">EDIT</button>
                            <button class="bg-red-400 hover:bg-red-500 px-4 text-white flex items-center justify-center" @click="handleDeleteCategory(category.id)">DELETE</button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>

        <AddCategory v-if="addCategoryStatus" @add-category-status="e => addCategoryStatus = e" @add-new-category="e => category.push(e)" />
        <EditCategory v-if="editCategoryStatus" :id="idEditCategory" @edit-category-status="e => editCategoryStatus = e" @updated-category="e => category.splice(category.findIndex(v => v.id == e.id), 1, e)" />
    </div>
</template>
<script>
import { onMounted, inject, ref } from 'vue';
import UserStore from '../../state/User'
import AddCategory from "@/components/AddCategory";
import EditCategory from "@/components/EditCategory";
export default {
    name: "Category",
    components: {
        AddCategory,
        EditCategory
    },
    setup() {
        const user = UserStore();
        let category = ref(null);
        let axios = inject("axios");
        let emitter = inject("emitter");
        let addCategoryStatus = ref(false);
        let editCategoryStatus = ref(false);
        let idEditCategory = ref(null);

        onMounted(async () => {
            try {
                emitter.emit("isLoading", true);
                let categories = await axios.get("/category", {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                });
                category.value = categories.data;
                emitter.emit("isLoading", false);
            } catch (err) {
                emitter.emit("notificationActive", "Something Went Wrong");
                emitter.emit("isLoading", false);
            }
        });

        const handleDeleteCategory = async id => {
            try {
                emitter.emit("isLoading", true);

                let categories = await axios.delete(`/category/${id}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                });

                category.value = category.value.filter(v => v.id != id);
                emitter.emit("isLoading", false);
                emitter.emit("notificationActive", "Success Delete Category")
            } catch (err) {
                emitter.emit("isLoading", false);
                emitter.emit("notificationActive", "Something Went Wrong");
            }
        }

        const handleEditCategory = id => {
            idEditCategory.value = id;
            editCategoryStatus.value = true;
        }

        return { category, addCategoryStatus, handleDeleteCategory, editCategoryStatus, handleEditCategory, idEditCategory }
    }
}
</script>