<script setup>
  import { alertError, alertSuccess } from "../../../lib/alert";
  import { userRegister } from "../../../lib/api/userApi2";
  import { reactive } from "vue";
  import { useRouter } from "vue-router";

  const user = reactive({
    username: "",
    name: "",
    password: "",
    confirm_password: "",
  });

  const router = useRouter();

  async function handleSubmit() {
    if (user.password !== user.confirm_password) {
      await alertError("Password do not match");
      return;
    }
    try {
      const response = await userRegister(user);
      console.log(response);

      if (response.status === 200) {
        router.push({
          path: "/login",
        });
      } else {
        await alertError(response.errors);
      }
    } catch (e) {
      console.error("Something went wrong: ", e);
      alertError("Error handle submit");
    }
  }
</script>

<template>
  <div
    class="animate-fade-in bg-gray-800 bg-opacity-80 p-8 rounded-xl shadow-custom border border-gray-700 backdrop-blur-sm w-full max-w-md"
  >
    <div class="text-center mb-8">
      <div class="inline-block p-3 bg-gradient rounded-full mb-4">
        <i class="fas fa-user-plus text-3xl text-white"></i>
      </div>
      <h1 class="text-3xl font-bold text-white">Contact Management</h1>
      <p class="text-gray-300 mt-2">Create a new account</p>
    </div>

    <form @submit.prevent="handleSubmit">
      <div class="mb-4">
        <label
          for="username"
          class="block text-gray-300 text-sm font-medium mb-2"
          >Username</label
        >
        <div class="relative">
          <div
            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
          >
            <i class="fas fa-user text-gray-500"></i>
          </div>
          <input
            type="text"
            id="username"
            name="username"
            class="w-full pl-10 pr-3 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            placeholder="Choose a username"
            required
            v-model="user.username"
          />
        </div>
      </div>

      <div class="mb-4">
        <label for="name" class="block text-gray-300 text-sm font-medium mb-2"
          >Full Name</label
        >
        <div class="relative">
          <div
            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
          >
            <i class="fas fa-id-card text-gray-500"></i>
          </div>
          <input
            type="text"
            id="name"
            name="name"
            class="w-full pl-10 pr-3 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            placeholder="Enter your full name"
            required
            v-model="user.name"
          />
        </div>
      </div>

      <div class="mb-4">
        <label
          for="password"
          class="block text-gray-300 text-sm font-medium mb-2"
          >Password</label
        >
        <div class="relative">
          <div
            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
          >
            <i class="fas fa-lock text-gray-500"></i>
          </div>
          <input
            type="password"
            id="password"
            name="password"
            class="w-full pl-10 pr-3 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            placeholder="Create a password"
            required
            v-model="user.password"
          />
        </div>
      </div>

      <div class="mb-6">
        <label
          for="confirm_password"
          class="block text-gray-300 text-sm font-medium mb-2"
          >Confirm Password</label
        >
        <div class="relative">
          <div
            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
          >
            <i class="fas fa-check-double text-gray-500"></i>
          </div>
          <input
            type="password"
            id="confirm_password"
            name="confirm_password"
            class="w-full pl-10 pr-3 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            placeholder="Confirm your password"
            required
            v-model="user.confirm_password"
          />
        </div>
      </div>

      <div class="mb-6">
        <button
          type="submit"
          class="w-full bg-gradient text-white py-3 px-4 rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 font-medium shadow-lg transform hover:-translate-y-0.5"
        >
          <i class="fas fa-user-plus mr-2"></i> Register
        </button>
      </div>

      <div class="text-center text-sm text-gray-400">
        Already have an account?
        <router-link
          to="/login"
          class="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
          >Sign in</router-link
        >
      </div>
    </form>
  </div>
</template>
