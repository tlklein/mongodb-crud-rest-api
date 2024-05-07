<template>
  <main>
    <div>
      <!--Header-->
      <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">
        List of Events
      </h1>
    </div>
    <div class="px-10 pt-20">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
        <h2 class="text-2xl font-bold">Search Event By</h2>
        <!-- Displays Event Name or Event Date selection -->
        <div class="flex flex-col">
          <select
            class="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            v-model="searchBy">
            <option value="Event Name">Event Name</option>
            <option value="Event Date">Event Date</option>
          </select>
        </div>
        <!--Displays event name search field-->
        <div class="flex flex-col" v-if="searchBy === 'Event Name'">
          <label class="block">
            <input type="text"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              v-model="name" v-on:keyup.enter="handleSubmitForm" placeholder="Enter event name" />
          </label>
        </div>
        <!-- Displays event date search field -->
        <div class="flex flex-col" v-if="searchBy === 'Event Date'">
          <input
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            type="date" v-model="eventDate" v-on:keyup.enter="handleSubmitForm" />
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
        <div class="mt-5 grid-cols-2">
          <!-- Create Button -->
          <button class="mr-10 border border-red-700 bg-white text-red-700 rounded">Update</button>
          <!-- Delete Button -->
          <button class="mr-10 border border-red-700 bg-white text-red-700 rounded">Delete</button>
        </div>
        <div></div>
        <!--Clear Search button-->
        <div class="mt-5 grid-cols-2">
          <button class="mr-10 border border-red-700 bg-white text-red-700 rounded" @click="loadData" type="submit">
            Clear Search
          </button>
          <!--Search Event button-->
          <button class="bg-red-700 text-white rounded" @click="handleSubmitForm" type="submit">
            Search Event
          </button>
        </div>
      </div>
    </div>

    <hr class="mt-10 mb-10" />
    <!-- Display Found Data -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
      <!--Table showing List of Events-->
      <div class="ml-10">
        <h2 class="text-2xl font-bold">List of Events</h2>
        <h3 class="italic">Click table row to view event details</h3>
      </div>
      <div class="flex flex-col col-span-2">
        <table class="min-w-full shadow-md rounded">
          <thead class="bg-gray-50 text-xl">
            <tr>
              <th class="p-4 text-left">Event Name</th>
              <th class="p-4 text-left">Event Date</th>
              <th class="p-4 text-left">Event Address</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-300">
            <tr @click="$router.push({name: 'eventdetails', params: { id: event._id } })"
              v-for="event in events" :key="event._id" class="cursor-pointer"
              :class="{ 'hoverRow': hoverId === event._id }" @mouseenter="hoverId = event._id"
              @mouseleave="hoverId = null">
              <td class="p-2 text-left">{{ event.name }}</td>
              <td class="p-2 text-left">{{ formatDate(event.date) }}</td>
              <td class="p-2 text-left">{{ event.address.line1 }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>

<script>
import { getEvents, searchEvents } from '../api/api'
import { useToast } from 'vue-toastification'
import { ref, onMounted } from 'vue'

export default {
  setup() {
    const events = ref(null)
    const searchBy = ref(null)
    const name = ref(null)
    const eventDate = ref(null)
    const hoverId = ref(null)

    const toast = useToast()
    // Get service data form server
    const loadData = async () => {
      searchBy.value = null
      name.value = null
      eventDate.value = null

      try {
        const response = await getEvents();
        events.value = response;
      } catch (error) {
        app.use(ToastService);
      }
    }
    //handle data presented
    const handleSubmitForm = async () => {
      if (searchBy.value === 'Event Name') {
        if (name.value) {
          try {
            const query = {
              searchBy: 'name',
              name: name.value
            };
            const response = await searchEvents(query);
            events.value = response;
          } catch (error) {
            app.use(ToastService);
          }
        }
      } else if (searchBy.value === 'Event Date') {
        if (eventDate.value) {
          try {
            const eventDateObj = new Date(eventDate.value);
            const formattedDate = eventDateObj.toISOString().substring(0, 10);
            const query = {
              searchBy: 'date',
              eventDate: formattedDate
            };
            const response = await searchEvents(query);
            events.value = response;
          } catch (error) {
            app.use(ToastService);
          }
        }
      }
    }

    const formatDate = (date) => {
      const isoDate = new Date(date);
      const year = isoDate.getUTCFullYear();
      const month = String(isoDate.getUTCMonth() + 1).padStart(2, '0');
      const day = String(isoDate.getUTCDate()).padStart(2, '0');
      return `${month}/${day}/${year}`;
    }

    onMounted(() => {
      loadData();
    })

    return {
      events,
      searchBy,
      name,
      eventDate,
      hoverId,
      loadData,
      handleSubmitForm,
      formatDate
    }
  }
}
</script>