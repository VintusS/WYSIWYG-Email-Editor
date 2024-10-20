<template>
  <div class="min-h-screen flex flex-col justify-center items-center bg-gray-100 dark:bg-gray-900">
    <h1 class="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100 text-center">
      Scan the QR Code
    </h1>

    <div v-if="qrCode" class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-80 flex justify-center items-center">
      <!-- Display the QR code -->
      <img :src="'data:image/png;base64,' + qrCode" alt="QR Code" class="h-40 w-40" />
    </div>

    <p class="text-gray-700 dark:text-gray-300 mt-4">
      Scan this QR code with your mobile authenticator app.
    </p>

    <button @click="proceedTo2FA" class="bg-blue-500 text-white py-2 px-4 rounded-lg mt-6">
      Proceed to 2FA
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      qrCode: '', 
      email: '',
    };
  },
  mounted() {
    // Access the QR code from route params
    this.qrCode = this.$route.params.qrCode;
    this.email = this.$route.params.email;
  },
  methods: {
    proceedTo2FA() {
        // Redirect to the 2fa page with email as param
        this.$router.push({
          name: 'TwoFactor',
          params: { email: this.email },
        });
    }
  }
};
</script>

<style scoped>
html, body {
  transition: background-color 0.3s ease, color 0.3s ease;
}

.absolute img {
  max-width: 100%;
}
</style>
