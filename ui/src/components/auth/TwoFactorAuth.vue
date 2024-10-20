<template>
  <div :class="{ 'dark': isDarkMode }" class="min-h-screen flex flex-col justify-center items-center bg-gray-100 dark:bg-gray-900">

    <div class="absolute top-4 left-4">
      <img src="@/assets/logo.png" alt="Logo" class="h-20" />
    </div>

    <div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-96 mt-30">
      <h1 class="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100 text-center">
        Two-Factor Authentication
      </h1>

      <p class="mb-4 text-gray-700 dark:text-gray-300 text-center">
        Enter the 6-digit code sent to your device
      </p>

      <div class="mb-4">
        <input 
          type="text" 
          v-model="twoFactorCode" 
          maxlength="6" 
          class="w-full p-2 text-center border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100" 
          placeholder="Enter 6-digit code" 
        />
      </div>

      <div class="flex flex-col items-center">
        <button @click="verifyCode" class="bg-blue-500 text-white py-2 px-4 rounded-lg w-full mb-2">
          Verify Code
        </button>
      </div>
    </div>
  </div>
</template>

<script>

import axios from 'axios';

export default {
  data() {
    return {
      twoFactorCode: '',
      email: '',
    };
  },
  mounted() {
    this.email = this.$route.params.email;
  },
  methods: {
    verifyCode() {
      if (this.twoFactorCode.length !== 6) {
        alert('Please enter a valid 6-digit code');
        return;
      }
      
      axios.post(`http://localhost:8081/api/2fa/totp/validate`, { totpKey: this.twoFactorCode, email: "jora" })
        .then(response => {
          if (response.data && response.data.accessToken) {
            alert('2FA Verified');
            
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            this.$router.push('/home');
          } else {
            alert('Invalid 2FA code');
          }
        })
        .catch(error => {
          console.error('There was an error verifying the code:', error);
          alert('An error occurred. Please try again.');
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
