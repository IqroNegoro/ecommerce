<template>
    <div class="mt-20 p-4">
        <h1 class="font-bold text-2xl text-center">List Products</h1>
        <button class="mx-auto block bg-blue-500 text-white font-semibold rounded-sm px-2 py-1 mt-2" @click="addProductStatus = true">Add New</button>
        <div class="grid grid-cols-1 grid-flow-row mt-4 divide-y divide-solid">
            <div v-for="product in products" :key="product.id" class="p-8 flex flex-col md:flex-row w-1/2 mx-auto">
                <img :src="port + product.image" :alt="product.name" class="w-64">
                <div class="relative w-full px-4">
                    <h1 class="text-lg block break-keep whitespace-nowrap">{{ product.name }}</h1>
                    <p class="text-black font-semibold text-sm">
                        {{ 
                            new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR"
                            }).format(product.price)
                         }}
                    </p>
                    <p class="mt-1 text-sm text-gray-500">{{ product.category?.name }}</p>
                    <p class="mt-1 text-sm text-gray-500">Stock: {{ product.stock }}</p>
                    <div class="flex justify-around w-full items-center md:mt-32 mt-6">
                        <button class="bg-green-400 hover:bg-green-500 px-4 text-white flex items-center justify-center" @click="editProduct(product.id)">EDIT</button>
                        <button class="bg-red-400 hover:bg-red-500 px-4 text-white flex items-center justify-center" @click="deleteProduct(product.id)">DELETE</button>
                    </div>
                </div>
            </div>
        </div>
        <AddProduct v-if="addProductStatus" @add-product-status="e => addProductStatus = e" @created-products="e => products.push(e)" />
        <EditProduct v-if="editProductStatus" @edit-product-status="e => editProductStatus = e" :id="idEditProduct" @updated-products="e => products.splice(products.findIndex(v => v.id == e.id), 1, e)" />
    </div>
</template>
<script>
import UserStore from '@/state/User'
import { inject, onMounted, ref } from 'vue';
import AddProduct from "@/components/AddProduct";
import EditProduct from "@/components/EditProduct";

export default {
    name: "AdminProducts",
    components: {
        AddProduct,
        EditProduct
    },
    setup() {
        const user = UserStore();
        const products = ref(null);
        const port = inject("port");
        const axios = inject("axios");
        const emitter = inject("emitter");
        const addProductStatus = ref(false);
        const editProductStatus = ref(false);
        const idEditProduct = ref(null);
       
        onMounted(async () => {
            try {
                emitter.emit("isLoading", true);
                let order = await axios.get("/products", {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                });


                products.value = order.data;
                emitter.emit("isLoading", false)
            } catch (err) {
                emitter.emit("isLoading", false);
                emitter.emit("notificationActive", "Success Delete Product")
            }
        })
        
        const deleteProduct = async id => {
            try {
                emitter.emit("isLoading", true);
                let product = await axios.delete(`/products/${id}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                });

                products.value = products.value.filter(v => v.id != id);
                emitter.emit("isLoading", false);
                emitter.emit("notificationActive", "Success Delete Product")
            } catch (err) {
                emitter.emit("isLoading", false);
                emitter.emit("notificationActive", "Success Delete Product")
            }
        }

        const editProduct = id => {
            editProductStatus.value = true;
            idEditProduct.value = id;
        }

        return { products, port, deleteProduct, addProductStatus, editProductStatus, editProduct, idEditProduct }
    }
}
</script>