<template>
    <div class="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-75 z-[9999] flex justify-center items-center">
        <div class="max-w-2xl bg-white rounded-sm flex justify-center items-center flex-col p-4">
            <h1 class="text-center font-semibold text-xl">{{ message }}</h1>
            <button class="bg-blue-500 px-2 py-1 text-white w-16 mt-4" @click="$emit('notification-status', false)">OK</button>
        </div>
    </div>
</template>
<script>
export default {
    name: "Notification",
    props: ["message"],
}
</script>