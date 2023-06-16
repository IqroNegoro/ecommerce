<template>
    <div class="bg-black bg-opacity-50 fixed w-full h-full top-0 left-0 z-[999] flex justify-center items-center custom-scroll">
        <div class="bg-white rounded-sm w-full h-full md:w-1/2 md:h-3/4 p-4 overflow-y-auto relative custom-scroll">
            <i class="bx bx-left-arrow-alt absolute top-0 left-0 text-3xl m-4 cursor-pointer" @click="$emit('editProductStatus', false)"></i>
            <h1 class="text-center font-semibold text-2xl">Edit Product</h1>
            <div class="mt-4">
                <label for="" class="block font-semibold">Image</label>
                <input type="file" class="h-8 w-full rounded-sm border-slate-500 focus:ring-1 ring-blue-400 mb-2" @change="handleImage" ref="image">
                <img ref="previewImage" alt="" :src="port + editProductData.image">
                <label for="" class="block font-semibold">Name Product</label>
                <input v-model="editProductData.name" type="text" class="h-8 w-full rounded-sm border-slate-500 border focus:ring-1 ring-blue-400 mb-2">
                <label for="" class="block font-semibold">Description</label>
                <textarea class="w-full" v-model="editProductData.description"></textarea>
                <label for="" class="block font-semibold">Stock</label>
                <input v-model="editProductData.stock" type="number" class="h-8 w-full rounded-sm border-slate-500 border focus:ring-1 ring-blue-400 mb-2">
                <label for="" class="block font-semibold">Price</label>
                <input v-model="editProductData.price" type="number" class="h-8 w-full rounded-sm border-slate-500 border focus:ring-1 ring-blue-400 mb-2">
                <label for="" class="block font-semibold">Category</label>
                <select v-model="editProductData.id_category" class="w-full rounded-sm border-slate-500 border focus:ring-1 ring-blue-400 mb-2">
                    <option value="null">Select Category</option>
                    <option value="null" v-if="editProductData.id_category">Remove Category</option>
                    <option :value="category.id" v-for="category in category" :key="category.id">{{ category.name }}</option>
                </select>
                <label for="" class="block font-semibold">Discount</label>
                <select v-model="editProductData.id_discount" class="w-full rounded-sm border-slate-500 border focus:ring-1 ring-blue-400 mb-2">
                    <option value="null">Select Discount</option>
                    <option value="null" v-if="editProductData.id_discount">Remove Discount</option>
                    <option :value="discount.id" v-for="discount in discounts" :key="discount.id">{{ discount.name }}</option>
                </select>
            </div>
            <button class="w-full h-8 bg-blue-500 rounded-sm font-semibold text-xl text-white mt-2" @click="handleEditProduct"> Update </button>
        </div>
    </div>
</template>
<script>
import UserStore from '@/state/User'
import { ref, inject, onMounted } from 'vue';
export default {
    name: "EditProduct",
    props: ["id"],
    setup({id}, {emit}) {
        const user = UserStore();
        const category = ref(null);
        const discounts = ref(null);
        const port = inject("port");
        const axios = inject("axios");
        const emitter = inject("emitter");
        const previewImage = ref(null);
        const image = ref(null);
        const editProductData = ref({
           name: "",
           description: "",
           stock: "",
           price: "",
           id_discount: "",
           id_category: "", 
        });

        onMounted(async () => {
            try {
                emitter.emit("isLoading", true);
                let product = await axios.get(`/products/${id}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                })

                editProductData.value = product.data;
                
                let categories = await axios.get(`/category`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                })

                category.value = categories.data;

                let discount = await axios.get("/discount", {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                });

                discounts.value = discount.data

                emitter.emit("isLoading", false);
            } catch (err) {
                emitter.emit("isLoading", false);
                emitter.emit("notificationActive", "Something Error");
            }
        })

        const handleEditProduct = async () => {
            if (Object.keys(editProductData.value).some(v => (v != "id_discount" && v != "id_category") && editProductData.value[v]== "")) {
                emitter.emit("notificationActive", "Please fill all field");
                return;
            }
            
            if (image.value.files[0]) {
                if (!["png", "jpg", "jpeg"].includes(image.value.files[0].type.split("/")[1])) {
                    emitter.emit("notificationActive", "Please select a photo product");
                    return;
                }
            }

            try {
                emitter.emit("isLoading", true);
                let fd = new FormData();
                fd.append("name", editProductData.value.name);
                fd.append("description", editProductData.value.description);
                fd.append("stock", editProductData.value.stock);
                fd.append("price", editProductData.value.price);
                fd.append("id_discount", editProductData.value.id_discount);
                fd.append("id_category", editProductData.value.id_category);

                if (image.value.files[0]) {
                    fd.append("image", image.value.files[0]);
                }

                let editProduct = await axios.put(`/products/${id}`, fd, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        "Content-Type": "multipart/form-data",
                    }
                })
                emit("updatedProducts", {...editProduct.data, category: category.value.find(v => v.id == editProduct.data.id_category)});
                emitter.emit("isLoading", false);
                emitter.emit("notificationActive", "Success Update Product");
                image.value.value = "";
                previewImage.value.src = "";
                emit("editProductStatus", false)
            } catch (err) {
                emitter.emit("isLoading", false);
                if (err.response.data.error == 'photo') {
                    emitter.emit("notificationActive", "Please Select A Photo")
                    return;
                };
                emitter.emit("notificationActive", "Failed To Edit Product");
            }
            
        }

        const handleImage = e => {
            if (e.target.files[0]) {
                if (!["png", "jpg", "jpeg"].includes(e.target.files[0].type.split("/")[1])) {
                return;
            }

            let image = URL.createObjectURL(e.target.files[0]);
            
            previewImage.value.src = image;
            }
        }

        return { editProductData, image, handleEditProduct, handleImage, category, previewImage, port, discounts }
    }
}
</script>