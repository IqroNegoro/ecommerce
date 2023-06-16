import { createRouter, createWebHistory } from 'vue-router'
import Home from "@/views/Home";
import Register from "@/views/Register";
import Login from "@/views/Login";

import AdminProducts from "@/views/Admin/Products";
import AdminCategory from "@/views/Admin/Category";
import AdminDiscount from "@/views/Admin/Discount";
import AdminOrders from "@/views/Admin/Orders";

import ProductDetail from "@/views/Product/Detail";
import Cart from "@/views/Cart/Cart";
import Address from "@/views/Address/Address";
import Order from "@/views/Order/Order";
import OrderDetail from "@/views/Order/Detail";
import UserStore from '@/state/User';

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: "/register",
    name: "register",
    component: Register
  },
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/product/:id",
    props: true,
    name: "productDetail",
    component: ProductDetail
  },
  {
    path: "/cart",
    name: "cart",
    meta: {
      requiresAuth: true
    },
    component: Cart
  },
  {
    path: "/address",
    name: "address",
    meta: {
      requiresAuth: true
    },
    component: Address
  },
  {
    path: "/order",
    name: "order",
    meta: {
      requiresAuth: true
    },
    component: Order
  },
  {
    path: "/order/:id",
    name: "orderDetail",
    props: true,
    meta: {
      requiresAuth: true
    },
    component: OrderDetail
  },
  {
    path: "/admin/orders",
    name: "adminOrders",
    meta: {
      requiresAuth: true,
      isAdmin: true
    },
    component: AdminOrders
  },
  {
    path: "/admin/products",
    name: "adminProducts",
    meta: {
      requiresAuth: true,
      isAdmin: true
    },
    component: AdminProducts
  },
  {
    path: "/admin/category",
    name: "adminCategory",
    meta: {
      requiresAuth: true,
      isAdmin: true
    },
    component: AdminCategory
  },
  {
    path: "/admin/discount",
    name: "adminDiscount",
    meta: {
      requiresAuth: true,
      isAdmin: true
    },
    component: AdminDiscount
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const user = UserStore();
  if (to.name == "register" && user.authenticated) {
    next({name: "home"});
    return;
  }

  if (to.name == "login" && user.authenticated) {
    next({name: "home"});
    return;
  }

  if (to.meta.requiresAuth && !user.authenticated) {
    next({name: "login"});
    return;
  }

  next();
})

export default router
