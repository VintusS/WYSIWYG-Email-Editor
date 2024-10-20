<template>
  <div :class="{ 'dark': isDarkMode }" class="min-h-screen flex flex-col justify-center items-center bg-gray-100 dark:bg-gray-900">
    <!-- Logo Section -->
    <div class="absolute top-4 left-4">
      <img src="@/assets/logo.png" alt="Logo" class="h-20" />
    </div>

    <!-- Authentication Content -->
    <div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-96 mt-30">
      <h1 class="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100 text-center">
        {{ isSignUp ? 'Sign Up' : 'Log In' }}
      </h1>
      
      <!-- Sign-Up Form -->
      <div v-if="isSignUp">
        <div class="mb-4">
          <label class="block text-gray-700 dark:text-gray-300">Email</label>
          <input 
            type="email" 
            v-model="email" 
            class="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100" 
            placeholder="Email" 
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 dark:text-gray-300">Password</label>
          <input 
            type="password" 
            v-model="password" 
            class="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100" 
            placeholder="Password" 
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 dark:text-gray-300">Confirm Password</label>
          <input 
            type="password" 
            v-model="confirmPassword" 
            class="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100" 
            placeholder="Confirm Password" 
          />
        </div>
      </div>
      
      <!-- Login Form -->
      <div v-else>
        <div class="mb-4">
          <label class="block text-gray-700 dark:text-gray-300">Email</label>
          <input 
            type="email" 
            v-model="email" 
            class="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100" 
            placeholder="Email" 
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 dark:text-gray-300">Password</label>
          <input 
            type="password" 
            v-model="password" 
            class="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100" 
            placeholder="Password" 
          />
        </div>
      </div>

      <div class="flex flex-col items-center">
        <button @click="handleAuth" class="bg-blue-500 text-white py-2 px-4 rounded-lg w-full mb-2">
          {{ isSignUp ? 'Sign Up' : 'Log In' }}
        </button>
        <button @click="toggleForm" class="text-blue-500 underline w-full">
          {{ isSignUp ? 'Already have an account?' : 'Need an account?' }}
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
      isSignUp: false,
      email: '',
      password: '',
      confirmPassword: '',
    };
  },
  methods: {
    async handleAuth() {
      if (this.isSignUp) {
        if (this.password !== this.confirmPassword) {
          alert('Passwords do not match');
          return;
        }

        try {
         // Sign-up API request
          const response = await axios.post('http://localhost:8081/2fa/users', {
            email: this.email,
            password: this.password,
          });

          // Get the QR code from the response
          const qrCode = response.data.qrCode; 

          // Redirect to the QR code page with QR code as param
          this.$router.push({
            name: 'QRCode',
            params: { qrCode, email: this.email },
          });

        } catch (error) {
          console.error('Sign Up Error:', error);
        }
      } else {
        try {
          // Login API request
          await axios.post('http://localhost:8081/2fa/login', {
            email: this.email,
            password: this.password,
          });

          this.$router.push({
          name: 'TwoFactor',
          params: { email: this.email },
        });
        } catch (error) {
          console.error('Login Error:', error);
        }
      }
    },
    toggleForm() {
      this.isSignUp = !this.isSignUp;
    },
  },
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
