<template>
  <div class="flex flex-col space-y-2">
    <div class="flex items-center space-x-2">
      <input 
        :value="modelValue" 
        @input="$emit('update:modelValue', $event.target.value)" 
        @keyup.enter="$emit('send-message')" 
        class="flex-1 border rounded-lg p-2 bg-white text-black dark:bg-gray-800 dark:text-white"
        placeholder="Type a message..."
      />
      <label for="file-upload" class="cursor-pointer bg-gray-300 hover:bg-gray-400 text-black dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white px-4 py-2 flex items-center justify-center">
        📎
      </label>
      <input 
        id="file-upload" 
        type="file" 
        @change="handleFileUpload" 
        class="hidden" 
        accept=".pdf,.doc,.docx,.txt"
      />
      <button @click="$emit('send-message')" class="bg-blue-500 text-white px-4 py-2 rounded-lg">
        Send
      </button>
    </div>

    <div v-if="selectedFile" class="text-sm mt-2">
      <span class="font-bold">Attached file:</span> {{ selectedFile.name }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: String,
    selectedFile: Object,
  },
  emits: ['update:modelValue', 'send-message', 'file-upload'],
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      this.$emit('file-upload', file);
    }
  }
};
</script>