<template>
  <div class="font-nunito">
    <SignAlert v-show="ifSignInAlert" @sign-in-alert-active="e => signInAlert = e" />
    <Navbar @side-cart-active="e => sideCartActive = e" @sidebar-active="e => sidebarActive = e" />
    <transition-group name="fade">
      <Sidebar v-if="sidebarActive" :active="sidebarActive" @sidebar-active="e => sidebarActive = e" />
      <Sidecart v-if="sideCartActive" @side-cart-active="e => sideCartActive = e" :active="sideCartActive" />
    </transition-group>
    <Loading v-if="isLoading" />
    <Notification v-if="notificationActive" :message="notificationMessage" @notification-status="e => notificationActive = e" />
    <router-view :key="$route.fullPath" />
  </div>
</template>
<script>
import Navbar from "@/components/Navbar";
import SignAlert from "@/components/SignAlert";
import Sidecart from "@/components/Sidecart";
import Sidebar from "@/components/Sidebar";
import Loading from "@/components/Loading";
import Notification from "@/components/Notification";
import { computed, inject, ref } from 'vue';
import { useRoute } from "vue-router";
import UserStore from './state/User';
export default {
  name: "App",
  components: {
    Navbar,
    SignAlert,
    Sidecart,
    Sidebar,
    Loading,
    Notification
  },
  setup() {
    const user = UserStore();
    let isLoading = ref(false);
    let signInAlert = ref(false);
    let sideCartActive = ref(false);
    let sidebarActive = ref(false);
    let notificationActive = ref(false);
    let notificationMessage = ref("");
    let emitter = inject("emitter");
    let ifSignInAlert = computed(() => !user.authenticated && signInAlert.value && (useRoute().name != "register" && useRoute().name != "login"))

    document.addEventListener("keydown", e => {
      if (e.code == "Escape" && sideCartActive.value) sideCartActive.value = false;
      if (e.code == "Escape" && sidebarActive.value) sidebarActive.value = false;
    });

    emitter.on("isLoading", e => isLoading.value = e);

    emitter.on("signInAlertActive", () => signInAlert.value = true);

    emitter.on("notificationActive", message => {
      notificationMessage.value = message
      notificationActive.value = true;
    })

    return { ifSignInAlert, signInAlert, sideCartActive, sidebarActive, isLoading, notificationActive, notificationMessage }
  }
}
</script>
<style scoped>
.fade-enter-from {
  opacity: 0;
}

.fade-enter-to {
  opacity: 1
}

.fade-enter-active {
  transition: ease-in 0.25s all;
}

.fade-leave-from {
  opacity: 1;
}

.fade-leave-to {
  opacity: 0;
}

.fade-leave-active {
  transition: ease-in 0.5s all;
}
</style>