<template>
  <router-link :to="{ name: 'productDetail', params: { id: product.id } }">
    <div class="group relative">
      <div
        class="min-h-80 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-none lg:h-80">
        <img :src="port + product.image" alt="Front of men&#039;s Basic Tee in black."
          class="h-full w-full object-cover object-center lg:h-full lg:w-full">
      </div>
      <div class="mt-4 flex justify-between">
        <div>
          <h3 class="text-sm text-gray-700">
            <a href="#">
              <span aria-hidden="true" class="absolute inset-0"></span>
              {{ product.name }}
            </a>
          </h3>
          <p class="mt-1 text-sm text-gray-500">{{ product.category?.name }}</p>
          <p class="mt-1 text-sm text-gray-500">Stock: {{ product.stock }}</p>
        </div>
        <!-- <p class="text-sm font-medium text-gray-900">{{ new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR"
        }).format(product.price) }}</p> -->
        <p class="text-sm font-semibold text-gray-500">{{ 
          new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR"
          }).format(product.discount ? product.price - (product.price * product.discount.discount_percentage / 100) : product.price)
      }}</p>
      </div>
    </div>
  </router-link>
</template>
<script>
import { inject } from 'vue'
export default {
  name: "Product",
  props: ["product"],
  setup() {
    let port = inject("port");

    return { port }
  }
}
</script>