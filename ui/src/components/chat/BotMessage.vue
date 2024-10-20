<template>
    <div class="bot-message flex items-start mb-4 justify-start">
      <div class="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-md flex items-center justify-center mr-2">
        🤖
      </div>
      <div class="inline-block p-2 rounded-lg max-w-full break-words bg-gray-200 text-black dark:bg-gray-700 dark:text-white">
        <div v-html="message.content"></div>
        <div v-if="message.file" class="mt-2 text-sm">
          <span class="font-bold">Attached file:</span> {{ message.file.name }}
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      message: {
        type: Object,
        required: true
      }
    }
  };
  </script>
  
  <style scoped>
  .bot-message {
    word-break: break-word;
  }
  </style>  