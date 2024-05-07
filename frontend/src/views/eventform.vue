<template>
  <main>
    <div>
      <!-- Header -->
      <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">
        Create New Event
      </h1>
    </div>
    <div class="px-10 py-20">
      <!-- Form -->
      <form @submit.prevent="handleSubmitForm">
        <!-- grid container -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          <h2 class="text-2xl font-bold">Event Details</h2>

          <!-- Event Name Input Field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Event Name</span>
              <span style="color: #ff0000">*</span>
              <input type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                v-model="event.name" />
            </label>
            <!-- Validation error messages -->
            <span v-if="errors.name" class="text-red-500">
              {{ errors.name }}
            </span>
          </div>

          <!-- Date input field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Date</span>
              <span style="color: #ff0000">*</span>
              <input
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                v-model="event.date" type="date" />
            </label>
            <!-- Validation error messages -->
            <span v-if="errors.date" class="text-red-500">
              {{ errors.date }}
            </span>
          </div>

          <div></div>
          <div></div>
          <!-- Description input field -->
          <div class="flex col-span-2 flex-col">
            <label class="block">
              <span class="text-gray-700">Description</span>
              <textarea
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                rows="2" v-model="event.description"></textarea>
            </label>
          </div>
        </div>

        <!-- Services Offered at Event checkboxes -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 mt-10">
          <h2 class="text-2xl font-bold">Services Offered at Event</h2>
          <div class="flex flex-col grid-cols-3">
            <div>
              <ul v-if="activeServices.length" class="space-y-2">
                <li v-for="service in activeServices" :key="service._id" :data-service-id="service._id"
                  class="rounded-lg border border-gray-300 p-2 hover:bg-gray-100 transition-colors relative">
                  <label class="block w-full h-full">
                    <input type="checkbox" :id="service._id" :value="service._id"
                      :checked="event.services.includes(service._id)" @change="toggleService(service._id)"
                      class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50 mr-2">
                    <span class="font-medium">{{ service.name }}</span>
                  </label>
                </li>
              </ul> 
              <!-- If there are no active services for the user's organization, this will appear instead of list of checkboxes -->
              <p v-else class="text-gray-600">No Active Services Available</p>
            </div>
          </div>
        </div>

        <!-- Grid container for Address -->
        <div class="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          <h2 class="text-2xl font-bold">Address</h2>
          <!-- Address fields -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Address Line 1</span>
              <input type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder v-model="event.address.line1" />
            </label>
          </div>
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Address Line 2</span>
              <input type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder v-model="event.address.line2" />
            </label>
          </div>
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">City</span>
              <input type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder v-model="event.address.city" />
            </label>
          </div>
          <div></div>
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">County</span>
              <input type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder v-model="event.address.county" />
            </label>
          </div>
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Zip Code</span>
              <input type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder v-model="event.address.zip" />
            </label>
          </div>
        </div>

        <!-- Add New Event submit button -->
        <div class="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          <div></div>
          <div class="flex justify-between mr-20">
            <button class="bg-red-700 text-white rounded" type="submit">
              Add New Event
            </button>
          </div>
        </div>
      </form>
    </div>
    
  </main>
</template>

<script>
import { reactive, ref } from 'vue';
import { getServices, createEvent } from '../api/api';
import { useToast } from 'vue-toastification';
import ConfirmationDialog from './ConfirmationDialog.vue';

export default {
  setup() {
    const event = reactive({
      name: null,
      description: null,
      date: null,
      services: [],
      address: {
        line1: null,
        line2: null,
        city: null,
        county: null,
        zip: null
      },
      attendees: [],
    });

    const errors = reactive({
      name: null,
      date: null
    });

    const activeServices = ref([]);

    const toast = useToast();
    // Check and handle data
    const toggleService = (serviceId) => {
      const index = event.services.indexOf(serviceId);
      if (index === -1) {
        event.services.push(serviceId);
      } else {
        event.services.splice(index, 1);
      }
    };

    const handleSubmitForm = async () => {
      if (!event.name || !event.date) {
        errors.name = event.name ? null : 'Event Name is required';
        errors.date = event.date ? null : 'Event Date is required';
        return;
      }

      const today = new Date().toISOString().split('T')[0];
      if (event.date < today) {
        errors.date = 'New Event Date cannot be in the past.';
        return;
      }

      try {
        const response = await createEvent(event);
        toast.success(response);
      } catch (error) {
        app.use(ToastService);
      }
    };

    const fetchData = async () => {
      try {
        const response = await getServices();
        activeServices.value = response.filter(item => item.status === 'Active');
      } catch (error) {
        app.use(ToastService);
      }
    };

    fetchData();

    return {
      event,
      errors,
      activeServices,
      handleSubmitForm,
      toggleService
    };
    },
    components: {
      ConfirmationDialog,
    },
    data() {
      return {
        showConfirmationDialog: false,
      };
    },
    methods: {
      handleConfirmation() {
        // Perform the action
        console.log('Action confirmed');
        this.showConfirmationDialog = false;
      },
    }
};
</script>
