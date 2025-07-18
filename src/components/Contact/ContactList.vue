<script setup>
import { useLocalStorage } from "@vueuse/core";
import { onBeforeMount, onMounted } from "vue";
import { ref } from "vue";
import { contactDelete, contactList } from "../../../lib/api/contactApi";
import { alertConfirm, alertError, alertSuccess } from "../../../lib/alert";
import { reactive } from "vue";
import { computed } from "vue";

const token = useLocalStorage("token", "");
const search = reactive({
  name: "",
  email: "",
  phone: "",
});
const paging = reactive({
  page: 1,
  totalPage: 1,
  totalItem: 0,
});
const contacts = ref([]);

async function fetchContacts() {
  const response = await contactList(token.value, {
    name: search.name,
    email: search.email,
    phone: search.phone,
    page: paging.page,
  });
  const responseBody = await response.json();
  console.log(responseBody);
  if (response.status === 200) {
    contacts.value = responseBody.data;
    paging.page = responseBody.paging.page;
    paging.totalPage = responseBody.paging.total_page;
    paging.totalItem = responseBody.paging.total_item;
  } else {
    await alertError(responseBody.errors);
  }
}

async function handleSearch() {
  paging.page = 1;
  await fetchContacts();
}

async function handleChangePage(val) {
  paging.page = val;
  await fetchContacts();
}

async function handleDelete(id) {
  const result = await alertConfirm(
    "Are you sure you want to delete this contact?",
  );
  if (!result.isConfirmed) {
    return; // keluar jika user membatalkan
  }
  const response = await contactDelete(token.value, id);
  const responseBody = await response.json();
  console.log(responseBody);
  if (response.status === 200) {
    await alertSuccess("contact deleted succesfully");
    await fetchContacts();
  } else {
    await alertError(responseBody.errors);
  }
}

const displayedRange = computed(() => {
  const itemsPerPage = contacts.value.length > 0 ? contacts.value.length : 10; // Asumsi 10 item per halaman jika belum ada data
  const start = (paging.page - 1) * itemsPerPage + 1;
  let end = paging.page * itemsPerPage;
  if (end > paging.totalItem) {
    end = paging.totalItem;
  }
  return {
    start: paging.totalItem === 0 ? 0 : start, // Jika total item 0, start juga 0
    end: paging.totalItem === 0 ? 0 : end, // Jika total item 0, end juga 0
    total: paging.totalItem,
  };
});

onMounted(() => {
  const toggleButton = document.getElementById("toggleSearchForm");
  const searchFormContent = document.getElementById("searchFormContent");
  const toggleIcon = document.getElementById("toggleSearchIcon");

  // Add transition for smooth animation
  searchFormContent.style.transition =
    "max-height 0.3s ease-in-out, opacity 0.3s ease-in-out, margin 0.3s ease-in-out";
  searchFormContent.style.overflow = "hidden";
  searchFormContent.style.maxHeight = "0px";
  searchFormContent.style.opacity = "0";
  searchFormContent.style.marginTop = "0";

  toggleButton.addEventListener("click", function () {
    if (searchFormContent.style.maxHeight !== "0px") {
      // Hide the form
      searchFormContent.style.maxHeight = "0px";
      searchFormContent.style.opacity = "0";
      searchFormContent.style.marginTop = "0";
      toggleIcon.classList.remove("fa-chevron-up");
      toggleIcon.classList.add("fa-chevron-down");
    } else {
      // Show the form
      searchFormContent.style.maxHeight =
        searchFormContent.scrollHeight + "px";
      searchFormContent.style.opacity = "1";
      searchFormContent.style.marginTop = "1rem";
      toggleIcon.classList.remove("fa-chevron-down");
      toggleIcon.classList.add("fa-chevron-up");
    }
  });
});

onBeforeMount(async () => {
  await fetchContacts();
});
</script>

<template>
  <div class="flex items-center mb-6">
    <i class="fas fa-users text-blue-400 text-2xl mr-3"></i>
    <h1 class="text-2xl font-bold text-white">My Contacts</h1>
  </div>

  <!-- Search form -->
  <div class="bg-gray-800 bg-opacity-80 rounded-xl shadow-custom border border-gray-700 p-6 mb-8 animate-fade-in">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center">
        <i class="fas fa-search text-blue-400 mr-3"></i>
        <h2 class="text-xl font-semibold text-white">Search Contacts</h2>
      </div>
      <button type="button" id="toggleSearchForm"
        class="text-gray-300 hover:text-white hover:bg-gray-700 p-2 rounded-full focus:outline-none transition-all duration-200">
        <i class="fas fa-chevron-down text-lg" id="toggleSearchIcon"></i>
      </button>
    </div>
    <div id="searchFormContent" class="mt-4">
      <form @submit.prevent="handleSearch">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label for="search_name" class="block text-gray-300 text-sm font-medium mb-2">Name</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fas fa-user text-gray-500"></i>
              </div>
              <input type="text" id="search_name" name="search_name"
                class="w-full pl-10 pr-3 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Search by name" v-model="search.name" />
            </div>
          </div>
          <div>
            <label for="search_email" class="block text-gray-300 text-sm font-medium mb-2">Email</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fas fa-envelope text-gray-500"></i>
              </div>
              <input type="text" id="search_email" name="search_email"
                class="w-full pl-10 pr-3 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Search by email" v-model="search.email" />
            </div>
          </div>
          <div>
            <label for="search_phone" class="block text-gray-300 text-sm font-medium mb-2">Phone</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fas fa-phone text-gray-500"></i>
              </div>
              <input type="text" id="search_phone" name="search_phone"
                class="w-full pl-10 pr-3 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Search by phone" v-model="search.phone" />
            </div>
          </div>
        </div>
        <div class="mt-5 text-right">
          <button type="submit"
            class="px-5 py-3 bg-gradient text-white rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 font-medium shadow-lg transform hover:-translate-y-0.5">
            <i class="fas fa-search mr-2"></i> Search
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Contact cards grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <!-- Create New Contact Card -->
    <div
      class="bg-gray-800 bg-opacity-80 rounded-xl shadow-custom overflow-hidden border-2 border-dashed border-gray-700 card-hover animate-fade-in">
      <router-link to="/dashboard/contacts/create" class="block p-6 h-full">
        <div class="flex flex-col items-center justify-center h-full text-center">
          <div
            class="w-20 h-20 bg-gradient rounded-full flex items-center justify-center mb-5 shadow-lg transform transition-transform duration-300 hover:scale-110">
            <i class="fas fa-user-plus text-3xl text-white"></i>
          </div>
          <h2 class="text-xl font-semibold text-white mb-3">
            Create New Contact
          </h2>
          <p class="text-gray-300">Add a new contact to your list</p>
        </div>
      </router-link>
    </div>

    <!-- Contact Card 1 -->
    <div
      class="bg-gray-800 bg-opacity-80 rounded-xl shadow-custom border border-gray-700 overflow-hidden card-hover animate-fade-in"
      v-for="contact in contacts" :key="contact.id">
      <div class="p-6">
        <router-link :to="`/dashboard/contacts/${contact.id}`"
          class="block cursor-pointer hover:bg-gray-700 rounded-lg transition-all duration-200 p-3">
          <div class="flex items-center mb-3">
            <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3 shadow-md">
              <i class="fas fa-user text-white"></i>
            </div>
            <h2 class="text-xl font-semibold text-white hover:text-blue-300 transition-colors duration-200">
              {{ contact.first_name }} {{ contact.last_name }}
            </h2>
          </div>
          <div class="space-y-3 text-gray-300 ml-2">
            <p class="flex items-center">
              <i class="fas fa-user-tag text-gray-500 w-6"></i>
              <span class="font-medium w-24">First Name:</span>
              <span>{{ contact.first_name }}</span>
            </p>
            <p class="flex items-center">
              <i class="fas fa-user-tag text-gray-500 w-6"></i>
              <span class="font-medium w-24">Last Name:</span>
              <span>{{ contact.last_name }}</span>
            </p>
            <p class="flex items-center">
              <i class="fas fa-envelope text-gray-500 w-6"></i>
              <span class="font-medium w-24">Email:</span>
              <span>{{ contact.email }}</span>
            </p>
            <p class="flex items-center">
              <i class="fas fa-phone text-gray-500 w-6"></i>
              <span class="font-medium w-24">Phone:</span>
              <span>{{ contact.phone }}</span>
            </p>
          </div>
        </router-link>
        <div class="mt-4 flex justify-end space-x-3">
          <router-link :to="`/dashboard/contacts/${contact.id}/edit`"
            class="px-4 py-2 bg-gradient text-white rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 font-medium shadow-md flex items-center">
            <i class="fas fa-edit mr-2"></i> Edit
          </router-link>
          <button @click="handleDelete(contact.id)"
            class="px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 font-medium shadow-md flex items-center">
            <i class="fas fa-trash-alt mr-2"></i> Delete
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Pagination -->
  <div class="mt-10 flex flex-col items-center justify-center">
    <p v-if="paging.totalItem > 0" class="text-gray-300 mb-4 text-sm">
      Showing {{ displayedRange.start }} to {{ displayedRange.end }} of
      {{ displayedRange.total }} contacts
    </p>
    <nav
      class="flex items-center space-x-3 bg-gray-800 bg-opacity-80 rounded-xl shadow-custom border border-gray-700 p-3 animate-fade-in">
      <a v-if="paging.page > 1" @click.prevent="handleChangePage(paging.page - 1)" href="#"
        class="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 flex items-center">
        <i class="fas fa-chevron-left mr-2"></i> Previous
      </a>
      <a v-for="val in paging.totalPage" :key="val" @click.prevent="handleChangePage(val)" href="#" :class="[
        'px-4 py-2 rounded-lg font-medium shadow-md transition-all duration-200',
        paging.page === val
          ? 'bg-blue-500 text-white'
          : 'bg-gradient text-white hover:opacity-90',
      ]">
        {{ val }}
      </a>
      <a @click.prevent="handleChangePage(paging.page + 1)" v-if="paging.page < paging.totalPage" href="#"
        class="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 flex items-center">
        Next <i class="fas fa-chevron-right ml-2"></i>
      </a>
    </nav>
  </div>
</template>
