import {
    defineStore
} from "pinia";
import axios from "axios";
import UserStore from "./User";

let PORT = "http://localhost:3000/";

const NotificationStore = defineStore("notification", {
    state: () => ({
        notifications: [],
    }),
    actions: {
        async getNotifications() {
            try {
                const user = UserStore();
                let notification = await axios.get(`${PORT}notifications`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                })

                this.notifications = notification.data
            } catch (err) {
                console.log(err)
            }
        }
    }
})

export default NotificationStore;