<template>
    <div v-if="showDialog" class="confirmation-dialog-overlay">
      <div class="confirmation-dialog">
        <h3>{{ title }}</h3>
        <p>{{ message }}</p>
        <div class="confirmation-buttons">
          <button @click="confirmAction">{{ confirmButtonText }}</button>
          <button @click="cancelAction">{{ cancelButtonText }}</button>
        </div>
      </div>
    </div>
</template>
  
<script>
  export default {
    name: 'ConfirmationDialog',
    props: {
      show: {
        type: Boolean,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
      confirmButtonText: {
        type: String,
        default: 'Confirm',
      },
      cancelButtonText: {
        type: String,
        default: 'Cancel',
      },
    },
    computed: {
      showDialog() {
        return this.show;
      },
    },
    methods: {
      confirmAction() {
        this.$emit('confirm');
      },
      cancelAction() {
        this.$emit('cancel');
      },
    },
  };
</script>
  
<style scoped>
  .confirmation-dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }
  
  .confirmation-dialog {
    background-color: white;
    padding: 20px;
    border-radius: 4px;
    text-align: center;
  }
  
  .confirmation-buttons {
    margin-top: 20px;
  }
  
  .confirmation-buttons button {
    margin: 0 10px;
  }
</style>

<!--
  Put Confirmation Dialog in form <template>
  <ConfirmationDialog 
    v-if="showConfirmationDialog"
    :show="showConfirmationDialog"
    title="Confirm Action"
    message="Are you sure you want to perform this action?"
    @confirm="handleConfirmation"
    @cancel="showConfirmationDialog = false"
  />

  
  
-->