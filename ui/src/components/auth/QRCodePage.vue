<template>
  <div class="min-h-screen flex flex-col justify-center items-center bg-gray-100 dark:bg-gray-900">
    <!-- Logo Section -->
    <div class="absolute top-4 left-4 flex items-center space-x-2">
      <img
        src="@/assets/logo.png"
        alt="Logo"
        class="h-16 cursor-pointer"
        @click="$router.push('/')"
      />
      <span class="text-red-600 font-bold text-xl">Extole</span>
    </div>

    <!-- Title -->
    <h1 class="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100 text-center">
      Scan the QR Code
    </h1>

    <!-- QR Code Section -->
    <div
      v-if="qrCode"
      class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-80 flex flex-col justify-center items-center"
    >
      <!-- QR Code with enhanced styling -->
      <div
        class="border-4 border-transparent rounded-lg bg-gradient-to-r from-red-500 via-white to-red-500 p-2 hover:shadow-lg transition"
      >
        <img
          :src="'data:image/png;base64,' + qrCode"
          alt="QR Code"
          class="h-40 w-40 rounded-md"
        />
      </div>
    </div>

    <p class="text-gray-700 dark:text-gray-300 mt-4 text-center">
      Scan this QR code with your mobile authenticator app.
    </p>

    <!-- Proceed Button -->
    <button
      @click="proceedTo2FA"
      class="bg-red-600 text-white py-2 px-6 rounded-lg mt-6 hover:bg-red-700 transition"
    >
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

button {
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

button:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}
</style>
