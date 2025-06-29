import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import UserRegister from "./components/User/UserRegister.vue";
import { createRouter, createWebHistory } from "vue-router";
import Layout from "./components/Layout.vue";
import UserLogin from "./components/User/UserLogin.vue";
import DasboardLayout from "./components/DasboardLayout.vue";
import UserProfile from "./components/User/UserProfile.vue";
import ContactList from "./components/Contact/ContactList.vue";
import UserLogout from "./components/User/UserLogout.vue";
import ContactCreate from "./components/Contact/ContactCreate.vue";
import ContactEdit from "./components/Contact/ContactEdit.vue";
import ContactDetail from "./components/Contact/ContactDetail.vue";
import AddressCreate from "./components/Address/AddressCreate.vue";
import AddressEdit from "./components/Address/AddressEdit.vue";

const router = createRouter({
  routes: [
    {
      path: "/",
      redirect: () => {
        const token = localStorage.getItem("token");
        if (token) {
          return "/dashboard/contacts";
        } else {
          return "/login";
        }
      },
    },
    {
      path: "/layout",
      component: Layout,
      children: [
        {
          path: "/register",
          component: UserRegister,
        },
        {
          path: "/login",
          component: UserLogin,
        },
      ],
    },
    {
      path: "/dashboard",
      component: DasboardLayout,
      beforeEnter: (to, from, next) => {
        if (!localStorage.getItem("token")) {
          next("/login");
        } else {
          next();
        }
      },
      children: [
        {
          path: "contacts",
          component: ContactList,
        },
        {
          path: "contacts/create",
          component: ContactCreate,
        },
        {
          path: "contacts/:id/edit",
          component: ContactEdit,
          props: true,
        },
        {
          path: "contacts/:id",
          component: ContactDetail,
          props: true,
        },
        {
          path: "contacts/:id/addresses/create",
          component: AddressCreate,
          props: true,
        },
        {
          path: "contacts/:id/addresses/:addressId/edit",
          component: AddressEdit,
          props: true,
        },
        {
          path: "users/profile",
          component: UserProfile,
        },
        {
          path: "users/logout",
          component: UserLogout,
        },
      ],
    },
  ],
  history: createWebHistory(),
});

createApp(App).use(router).mount("#app");
