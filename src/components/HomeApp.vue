<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const debugInfo = ref([]);

// Debug function
const addDebug = (message) => {
  debugInfo.value.push(`${new Date().toLocaleTimeString()}: ${message}`);
  console.log(message);
};

addDebug("Component setup started");

onMounted(async () => {
  addDebug("onMounted called");

  try {
    // Wait for router to be ready
    await router.isReady();
    addDebug("Router is ready");

    const token = localStorage.getItem("token");
    addDebug(`Token found: ${token ? "YES" : "NO"}`);
    addDebug(`Token value: ${token}`);

    if (token) {
      addDebug("Attempting to redirect to /dashboard/contacts");
      await router.push("/dashboard/contacts");
      addDebug("Redirect to dashboard completed");
    } else {
      addDebug("Attempting to redirect to /login");
      await router.push("/login");
      addDebug("Redirect to login completed");
    }
  } catch (error) {
    addDebug(`Error: ${error.message}`);
    console.error("Router error:", error);
  }
});
</script>

<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-4">Debug Info</h1>
    <div class="bg-gray-100 p-4 rounded">
      <div v-for="info in debugInfo" :key="info" class="mb-2">
        {{ info }}
      </div>
    </div>
    <div class="mt-4">
      <p>Current route: {{ $route.path }}</p>
      <p>localStorage token: {{ localStorage.getItem("token") || "null" }}</p>
    </div>
  </div>
</template>
