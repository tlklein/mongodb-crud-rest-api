<template>
  <div>
    <!-- Header -->
    <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">
      Service Details
    </h1>
    
    <!-- Service Details Form -->
    <div class="px-10 py-20">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
        <h2 class="text-2xl font-bold">Service Details</h2>
        
        <!-- Service Name Input Field -->
        <div class="flex flex-col">
          <label class="block">
            <span class="text-gray-700">Service Name</span>
            <span style="color: #ff0000">*</span>
            <input type="text"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              v-model="service.name" />
          </label>
          <span v-if="v$.service.name.$error" class="text-red-500">
            Service Name is required
          </span>
        </div>

        <!-- Description Input Field -->
        <div class="flex flex-col">
          <label>
            <span class="text-gray-700">Description:</span>
            <textarea
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              v-model="service.description"></textarea>
          </label>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
        <div></div>
        <!-- Service Status Radio Buttons -->
        <div class="flex flex-col">
          <label class="block">
            <span class="text-gray-700">Service Status</span>
            <span style="color: #ff0000">*</span>
            <div class="mt-1">
              <label class="inline-flex items-center">
                <input type="radio" class="form-radio" value="Active" v-model="service.status">
                <span class="ml-2">Active</span>
              </label>
              <label class="inline-flex items-center ml-6">
                <input type="radio" class="form-radio" value="Inactive" v-model="service.status">
                <span class="ml-2">Inactive</span>
              </label>
            </div>
          </label>
        </div>
      </div>

      <!-- Buttons Section -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
        <div></div>
        
        <!-- Update Service Button -->
        <div class="flex justify-between mt-10 mr-20">
          <button @click="submitServiceUpdate" type="button" class="bg-green-700 disabled:opacity-50 text-white rounded"
            :disabled="user.role === 'viewer'">
            Update Service
          </button>
        </div>
        
        <!-- Delete Service Button -->
        <div class="flex justify-between mt-20 mr-20">
          <button @click="showDeleteConfirmation" type="button" class="bg-red-700 disabled:opacity-50 text-white rounded" :disabled="user.role === 'viewer'">
            Delete Service
          </button>
        </div>
        
        <!-- Confirmation Dialog for Delete -->
        <ConfirmationDialog
          :show="showDeleteDialog"
          title="Confirm Deletion"
          message="Are you sure you want to delete this service?"
          confirmButtonText="Yes, Delete"
          cancelButtonText="Cancel"
          @confirm="confirmDelete"
          @cancel="cancelDelete"
        />
        
        <!-- Go Back Button -->
        <div class="flex justify-between mt-20 mr-20">
          <button type="button" class="border border-red-700 bg-white text-red-700 rounded" @click="goBack">
            Go back
          </button>
        </div>
      </div>
    </div>

    <!-- Divider -->
    <hr class="mt-10 mb-10" />
    
    <!-- List of Events Table -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
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
  </div>
</template>

<script>
import ConfirmationDialog from '@/views/ConfirmationDialog.vue'; // Adjust the import path as per your project structure
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { useLoggedInUserStore } from "../store/loggedInUser";
import { getServiceById, getEventsByServiceId, updateService, deleteService } from '../api/api';
import { useToast } from 'vue-toastification';

// Notifications
const toast = useToast();

export default {
  components: {
    ConfirmationDialog,
  },
  data() {
    return {
      service: {
        name: null,
        description: null,
        status: null
      },
      events: [],
      hoverId: null,
      showDeleteDialog: false,
    };
  },
  setup() {
    const v$ = useVuelidate();
    const user = useLoggedInUserStore();
    return { v$, user };
  },
  validations() {
    return {
      service: {
        name: { required },
      },
    };
  },
  async mounted() {
    try {
      const [serviceResponse, eventsResponse] = await Promise.all([
        getServiceById(this.$route.params.id),
        getEventsByServiceId(this.$route.params.id),
      ]);

      this.service = serviceResponse;
      this.events = eventsResponse;
    } catch (error) {
      toast.error(error);
    }
  },
  methods: {
    formatDate(date) {
      const isoDate = new Date(date);
      const year = isoDate.getUTCFullYear();
      const month = String(isoDate.getUTCMonth() + 1).padStart(2, '0');
      const day = String(isoDate.getUTCDate()).padStart(2, '0');
      return `${month}/${day}/${year}`;
    },
    async submitServiceUpdate() {
      this.v$.$validate();

      if (this.v$.$error) {
        return;
      }

      try {
        const response = await updateService(this.$route.params.id, this.service);
        this.$router.push('/findservice');
        toast.success(response);
      } catch (error) {
        toast.error('Error updating service', error);
      }
    },
    async submitDeleteService() {
      try {
        if (this.events.length !== 0) {
          toast.info('Service cannot be deleted since it is being used by events.');
          return;
        }
        const response = await deleteService(this.$route.params.id);
        toast.success(response);
        this.$router.push('/findservice');
      } catch (error) {
        toast.error(error);
      }
    },
    showDeleteConfirmation() {
      this.showDeleteDialog = true;
    },
    cancelDelete() {
      this.showDeleteDialog = false;
    },
    confirmDelete() {
      this.submitDeleteService();
      this.showDeleteDialog = false;
    },
    goBack() {
      this.$router.back();
    },
  },
};
</script>


