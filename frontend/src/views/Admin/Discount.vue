<template>
    <div class="mt-20 p-4">
        <h1 class="font-bold text-2xl text-center">List Discount</h1>
        <button class="mx-auto block bg-blue-500 text-white font-semibold rounded-sm px-2 py-1 mt-2" @click="addDiscountStatus = true">Add New</button>
        <div class="mx-auto w-1/2 mt-4">
            <div class="radius-md h-12 grid grid-cols-[1fr,2fr] grid-rows-1 border-2 border-blue-500 w-full mb-2 relative" v-for="discount in discount" :key="discount.id">
                <div class="bg-blue-500 flex justify-center items-center border-r-2 border-dotted">
                    <p class="text-white">{{ discount.discount_percentage }}%</p>
                </div>
                <div class="bg-white flex justify-center items-center">
                    <p class="text-center">{{ discount.name }}</p>
                </div>
                <div class="absolute justify-center items-center flex gap-2 -right-1/4 top-1/2 -translate-y-1/2 -translate-x-1/2">
                    <button @click="handleEditDiscount(discount.id)">
                        <i class="bx bx-pencil bg-green-500 text-white p-1 rounded-full"></i>
                    </button>
                    <button @click="handleDeleteDiscount(discount.id)">
                        <i class="bx bx-trash bg-red-500 text-white p-1 rounded-full"></i>
                    </button>
                </div>
            </div>
        </div>
        <AddDiscount v-if="addDiscountStatus" @add-discount-status="e => addDiscountStatus = e" @add-new-discount="e => discount.push(e)" />
        <EditDiscount v-if="editDiscountStatus" :id="idEditDiscount" @edit-discount-status="e => editDiscountStatus = e" @updated-discount="e => discount.splice(discount.findIndex(v => v.id == e.id), 1, e)" />
    </div>
</template>
<script>
import AddDiscount from '@/components/AddDiscount';
import EditDiscount from '@/components/EditDiscount';
import UserStore from '../../state/User';
import { inject, onMounted, ref } from 'vue';
export default {
    name: "Discount",
    components: {
        AddDiscount,
        EditDiscount
    },
    setup() {
        const user = UserStore();
        const discount = ref(null);
        const addDiscountStatus = ref(false);
        const axios = inject("axios");
        const emitter = inject("emitter");
        const editDiscountStatus = ref(false);
        const idEditDiscount = ref(null);

        onMounted(async () => {
            try {
                emitter.emit("isLoading", true);
                let fetch = await axios.get("/discount", {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                });
                discount.value = fetch.data;
                emitter.emit("isLoading", false);
            } catch (err) {
                emitter.emit("isLoading", false);
                emitter.emit("notificationActive", "Something Went Wrong");
            }
        })

        const handleDeleteDiscount = async id => {
            try {
                emitter.emit("isLoading", true);
                let deleteDiscount = await axios.delete(`/discount/${id}`, {
                    headers : {
                        Authorization: `Bearer ${user.token}`
                    }
                });

                discount.value = discount.value.filter(v => v.id != id);

                emitter.emit("isLoading", false);
                emitter.emit("notificationActive", "Success Delete Discount");
            } catch (err) {
                emitter.emit("isLoading", false);
                emitter.emit("notificationActive", "Something Went Wrong");
            }
        }

        const handleEditDiscount = async id => {
            editDiscountStatus.value = true;
            idEditDiscount.value = id;
        }

        return { discount, addDiscountStatus, handleDeleteDiscount, handleEditDiscount, editDiscountStatus, idEditDiscount }
    }
}
</script>