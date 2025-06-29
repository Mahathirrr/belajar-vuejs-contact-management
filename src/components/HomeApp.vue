<script setup>
import { useLocalStorage } from "@vueuse/core";
import { useRouter } from "vue-router";
const router = useRouter();
const token = useLocalStorage("token", "");
if (token) {
  router.push("/dashboard/contacts");
} else {
  router.push("/login");
}
</script>

<template></template>
