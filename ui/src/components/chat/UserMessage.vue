<template>
    <div class="user-message flex items-start mb-4 justify-end">
      <div class="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center ml-2 mr-1">
        👤
      </div>
      <div class="inline-block p-2 rounded-lg max-w-full break-words bg-blue-500 text-white">
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
  .user-message {
    word-break: break-word;
  }
  </style>
  