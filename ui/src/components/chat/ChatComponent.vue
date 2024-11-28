<template>
  <div class="flex flex-col h-full max-h-screen">
    <div ref="chatContainer" class="flex-1 flex flex-col bg-gray-100 dark:bg-gray-900 overflow-y-auto p-4 overflow-x-hidden">
      <div v-for="(message, index) in visibleMessages" :key="index">
        <BotMessage v-if="message.sender === 'bot'" :message="message" />
        <UserMessage v-if="message.sender === 'user'" :message="message" />
      </div>
    </div>

<MessageInput 
  :modelValue="newMessage" 
  :selectedFile="selectedFile" 
  @update:modelValue="newMessage = $event" 
  @send-message="sendMessage" 
  @file-upload="handleFileUpload" 
/>

  </div>
</template>

<script>
import { ref, nextTick } from 'vue';
import axios from 'axios';
import { marked } from 'marked';
import BotMessage from '@/components/chat/BotMessage.vue';
import UserMessage from '@/components/chat/UserMessage.vue';
import MessageInput from '@/components/chat/MessageInput.vue';

const apiUrl = 'http://localhost:3000';

export default {
  components: {
    BotMessage,
    UserMessage,
    MessageInput
  },
  data() {
    return {
      messages: [],
      newMessage: '',
      selectedFile: null,
      threadId: null,
      hasUserSentMessage: false
    };
  },
  computed: {
    visibleMessages() {
      if (!this.hasUserSentMessage) {
        return [];
      }
      return this.messages;
    }
  },
  methods: {
    async initializeConversation() {
      try {
        const response = await axios.post(`${apiUrl}/campaign`);
        this.threadId = response.data.thread.id;
      } catch (error) {
        console.error('Error initializing campaign:', error);
      }
    },
    
async sendMessage() {
  if (this.newMessage.trim() || this.selectedFile) {
    const userMessage = {
      sender: 'user',
      content: marked(this.newMessage.trim()),
      file: this.selectedFile ? { name: this.selectedFile.name } : null, 
    };

    this.messages.push(userMessage);
    this.newMessage = '';
    this.selectedFile = null; 
    this.hasUserSentMessage = true;
    this.scrollToBottom();

    try {
      const formData = new FormData();
      formData.append('message', userMessage.content);
      if (this.selectedFile) {
        formData.append('file', this.selectedFile); 
      }

      const response = await axios.post(`${apiUrl}/conversation/${this.threadId}/messages`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data' 
        }
      });

      if (response.data && Array.isArray(response.data.messages)) {
        const botMessage = response.data.messages.slice(-1)[0];
        this.messages.push({
          sender: 'bot',
          content: marked(botMessage.content),
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }

    this.scrollToBottom();
  }
}
,
    
    handleFileUpload(file) {
      this.selectedFile = file;
      // Handle file upload logic here
    },
    
    scrollToBottom() {
      nextTick(() => {
        const chatContainer = this.$refs.chatContainer;
        chatContainer.scrollTop = chatContainer.scrollHeight;
      });
    }
  },
  mounted() {
    this.initializeConversation();
    this.scrollToBottom();
  }
};
</script>