<template>
  <main>
    <div>
      <!--Header-->
      <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">
        Find Client
      </h1>
    </div>
    <div class="px-10 pt-20">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
        <!--Search Client By selection-->
        <h2 class="text-2xl font-bold">Search Client By</h2>
        <!-- Displays Client Name search field -->
        <div class="flex flex-col">
          <select
            class="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            v-model="searchBy">
            <option value="Client Name">Client Name</option>
            <option value="Client Number">Client Number</option>
          </select>
        </div>
        <!--Input box for searching by Client First Name-->
        <div class="flex flex-col" v-if="searchBy === 'Client Name'">
          <label class="block">
            <input type="text"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              v-model="firstName" v-on:keyup.enter="handleSubmitForm" placeholder="Enter first name" />
          </label>
        </div>
        <!--Input box for searching by Client Last Name-->
        <div class="flex flex-col" v-if="searchBy === 'Client Name'">
          <label class="block">
            <input type="text"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              v-model="lastName" v-on:keyup.enter="handleSubmitForm" placeholder="Enter last name" />
          </label>
        </div>
        <!-- Displays Client Number search field -->
        <div class="flex flex-col" v-if="searchBy === 'Client Number'">
          <input
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            type="text" v-model="phoneNumber" v-on:keyup.enter="handleSubmitForm"
            placeholder="Enter Client Phone Number" />
        </div>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
        <div class="mt-5 grid-cols-2">      
          <!-- Create Button -->    
          <button class="mr-10 border border-red-700 bg-white text-red-700 rounded">
            Update
          </button>
          <!-- Delete Button -->
          <button class="mr-10 border border-red-700 bg-white text-red-700 rounded">
            Delete
          </button>
        </div>
        <div></div>
        <!--Clear Search button-->
        <div class="mt-5 grid-cols-2">
          <button class="mr-10 border border-red-700 bg-white text-red-700 rounded" @click="loadData" type="submit">
            Clear Search
          </button>
          <!--Search Client button-->
          <button class="bg-red-700 text-white rounded" @click="handleSubmitForm" type="submit">
            Search Client
          </button>
        </div>
      </div>
    </div>

    <hr class="mt-10 mb-10" />
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
      <div class="ml-10">
        <h2 class="text-2xl font-bold">List of Clients</h2>
        <h3 class="italic">Click table row to view client details</h3>
      </div>
      <!--Table showing list of Clients-->
      <div class="flex flex-col col-span-2">
        <table class="min-w-full shadow-md rounded">
          <thead class="bg-gray-50 text-xl">
            <tr>
              <th class="p-4 text-left">Name</th>
              <th class="p-4 text-left">Phone number</th>
              <th class="p-4 text-left">City</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-300">
            <tr @click="$router.push({ name: 'clientdetails', params: { id: client._id } })" v-for="client in clients"
              :key="client._id" class="cursor-pointer" :class="{ 'hoverRow': hoverId === client._id }"
              @mouseenter="hoverId = client._id" @mouseleave="hoverId = null">
              <td class="p-2 text-left">
                {{ client.firstName + ' ' + client.lastName }}
              </td>
              <td class="p-2 text-left">
                {{ client.phoneNumber.primary }}
              </td>
              <td class="p-2 text-left">{{ client.address.city }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
  <Toast />
</template>

<script>
import { getClients, searchClients } from '../api/api'
import { useToast } from 'vue-toastification'
import { ref, onMounted } from 'vue'

export default {
  setup() {
    const clients = ref(null)
    const searchBy = ref('')
    const firstName = ref('')
    const lastName = ref('')
    const phoneNumber = ref('')
    const hoverId = ref(null)

    const toast = useToast()

    const loadData = async () => {
      searchBy.value = ''
      firstName.value = ''
      lastName.value = ''
      phoneNumber.value = ''

      try {
        const response = await getClients();
        clients.value = response;
      } catch (error) {
        //toast.error(error)
        app.use(ToastService);
      }
    }

    const handleSubmitForm = async () => {
      if (searchBy.value === 'Client Name') {
        if (firstName.value || lastName.value) {
          try {
            const query = {
              searchBy: 'name',
              firstName: firstName.value,
              lastName: lastName.value,
            }
            const response = await searchClients(query)
            clients.value = response;
          } catch (error) {
            //toast.error(error)
            app.use(ToastService);
          }
        }
      } else if (searchBy.value === 'Client Number') {
        if (phoneNumber.value) {
          try {
            const query = {
              searchBy: 'number',
              phoneNumber: phoneNumber.value
            }
            const response = await searchClients(query)
            clients.value = response;
          } catch (error) {
            app.use(ToastService);
          }
        }
      }
    }

    onMounted(() => {
      loadData()
    })

    return {
      clients,
      searchBy,
      firstName,
      lastName,
      phoneNumber,
      hoverId,
      loadData,
      handleSubmitForm
    }
  }
}


</script>