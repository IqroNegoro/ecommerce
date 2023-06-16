import { defineStore } from "pinia";

const UserStore = defineStore("user", {
    state: () => ({
        id: "",
        name: "",
        email: "",
        token: "",
        admin: 0,
        authenticated: false
    })
})

export default UserStore;