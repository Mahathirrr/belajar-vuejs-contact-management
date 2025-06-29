<script setup>
import { useLocalStorage } from "@vueuse/core";
import { onBeforeMount } from "vue";
import { userLogOut } from "../../../lib/api/userApi2";
import { useRouter } from "vue-router";
import { alertError } from "../../../lib/alert";

const token = useLocalStorage("token", "");
const router = useRouter();

onBeforeMount(async () => {
  const response = await userLogOut(token.value);
  console.log(response);
  if (response.status === 200) {
    token.value = "";
    router.push({
      path: "/login",
    });
  } else {
    await alertError(response.errors);
  }
});
</script>

<template></template>
