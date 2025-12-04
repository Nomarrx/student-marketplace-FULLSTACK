<template>
  <div class="container-fluid py-4" style="height: calc(100vh - 200px)">
    <div class="row h-100">
      <!-- Left Sidebar: Conversations List -->
      <div class="col-md-4 border-end">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h4 class="fw-bold mb-0">Messages</h4>
          <span class="badge bg-primary">{{ conversations.length }}</span>
        </div>

        <!-- Search Messages -->
        <div class="mb-3">
          <input
            type="text"
            class="form-control"
            placeholder="Search messages..."
            v-model="searchQuery"
          />
        </div>

        <!-- Conversations List -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border spinner-border-sm" role="status"></div>
          <p class="text-muted small mt-2">Loading conversations...</p>
        </div>

        <div v-else-if="filteredConversations.length === 0" class="text-center py-5">
          <i class="bi bi-chat-dots display-4 text-muted"></i>
          <p class="text-muted mt-3">No messages yet</p>
          <small class="text-muted">Start a conversation with a seller!</small>
        </div>

        <div v-else class="conversation-list">
          <div
            v-for="conversation in filteredConversations"
            :key="conversation.conversationId"
            class="conversation-item p-3 border-bottom"
            :class="{ active: selectedConversation?.conversationId === conversation.conversationId }"
            @click="selectConversation(conversation)"
            style="cursor: pointer"
          >
            <div class="d-flex align-items-start">
              <!-- Avatar -->
              <div class="me-3 flex-shrink-0">
                <div
                  v-if="conversation.otherUser.profilePicture"
                  class="rounded-circle overflow-hidden"
                  style="width: 50px; height: 50px"
                >
                  <img
                    :src="getProfilePictureUrl(conversation.otherUser.profilePicture)"
                    alt="Profile"
                    style="width: 100%; height: 100%; object-fit: cover"
                  />
                </div>
                <div
                  v-else
                  class="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center"
                  style="width: 50px; height: 50px; font-size: 18px"
                >
                  {{ getInitials(conversation.otherUser.fullName) }}
                </div>
              </div>

              <!-- Conversation Info -->
              <div class="flex-grow-1 overflow-hidden">
                <div class="d-flex justify-content-between align-items-center mb-1">
                  <h6 class="mb-0 fw-bold">{{ conversation.otherUser.fullName }}</h6>
                  <small class="text-muted">{{ formatTime(conversation.lastMessageTime) }}</small>
                </div>
                <p class="text-muted small mb-1">{{ conversation.listing.title }}</p>
                <p class="text-muted small mb-0 text-truncate">
                  {{ conversation.lastMessage }}
                </p>
              </div>

              <!-- Unread Badge -->
              <span
                v-if="conversation.unreadCount > 0"
                class="badge bg-primary rounded-pill ms-2"
              >
                {{ conversation.unreadCount }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Side: Active Chat -->
      <div class="col-md-8 d-flex flex-column">
        <!-- No Conversation Selected -->
        <div v-if="!selectedConversation" class="d-flex align-items-center justify-content-center h-100">
          <div class="text-center">
            <i class="bi bi-chat-left-dots display-1 text-muted"></i>
            <h5 class="text-muted mt-3">Select a conversation to start messaging</h5>
          </div>
        </div>

        <!-- Active Chat -->
        <div v-else class="d-flex flex-column h-100">
          <!-- Chat Header -->
          <div class="border-bottom p-3 bg-light">
            <div class="d-flex align-items-center">
              <!-- Avatar -->
              <div class="me-3">
                <div
                  v-if="selectedConversation.otherUser.profilePicture"
                  class="rounded-circle overflow-hidden"
                  style="width: 45px; height: 45px"
                >
                  <img
                    :src="getProfilePictureUrl(selectedConversation.otherUser.profilePicture)"
                    alt="Profile"
                    style="width: 100%; height: 100%; object-fit: cover"
                  />
                </div>
                <div
                  v-else
                  class="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center"
                  style="width: 45px; height: 45px; font-size: 16px"
                >
                  {{ getInitials(selectedConversation.otherUser.fullName) }}
                </div>
              </div>

              <!-- Info -->
              <div class="flex-grow-1">
                <h6 class="mb-0 fw-bold">{{ selectedConversation.otherUser.fullName }}</h6>
                <small class="text-muted">Re: {{ selectedConversation.listing.title }}</small>
              </div>

              <!-- View Listing Button -->
              <button
                class="btn btn-outline-primary btn-sm"
                @click="viewListing(selectedConversation.listing.listingID)"
              >
                View Listing
              </button>
            </div>
          </div>

          <!-- Messages Area -->
          <div class="flex-grow-1 overflow-auto p-3" ref="messagesContainer" style="background-color: #f8f9fa">
            <div v-if="loadingMessages" class="text-center py-5">
              <div class="spinner-border spinner-border-sm" role="status"></div>
            </div>

            <div v-else>
              <div
                v-for="message in messages"
                :key="message.messageID"
                class="mb-3"
                :class="message.senderID === currentUserId ? 'text-end' : 'text-start'"
              >
                <!-- Debug info (remove later) -->
                <!-- <small class="text-muted">senderID: {{ message.senderID }}, currentUserId: {{ currentUserId }}</small> -->
                <div
                  class="d-inline-block p-3 rounded-3"
                  :class="message.senderID === currentUserId ? 'bg-dark text-white' : 'bg-white'"
                  style="max-width: 70%"
                >
                  <p class="mb-1">{{ message.messageText }}</p>
                  <small :class="message.senderID === currentUserId ? 'text-light' : 'text-muted'">
                    {{ formatTime(message.sentAt) }}
                  </small>
                </div>
              </div>
            </div>
          </div>

          <!-- Message Input -->
          <div class="border-top p-3 bg-white">
            <form @submit.prevent="sendMessage" class="d-flex gap-2">
              <input
                type="text"
                class="form-control"
                placeholder="Type your message..."
                v-model="newMessage"
                :disabled="sending"
              />
              <button
                type="submit"
                class="btn btn-dark px-4"
                :disabled="!newMessage.trim() || sending"
              >
                {{ sending ? 'Sending...' : 'Send' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import axios from 'axios';

const router = useRouter();
const { user } = useAuth();

const loading = ref(true);
const loadingMessages = ref(false);
const sending = ref(false);
const searchQuery = ref('');

const conversations = ref([]);
const selectedConversation = ref(null);
const messages = ref([]);
const newMessage = ref('');
const messagesContainer = ref(null);

const currentUserId = computed(() => {
  const userId = user.value?.userID;
  console.log('Current user ID:', userId);
  return userId;
});

const filteredConversations = computed(() => {
  if (!searchQuery.value) return conversations.value;

  const query = searchQuery.value.toLowerCase();
  return conversations.value.filter(
    (c) =>
      c.otherUser.fullName.toLowerCase().includes(query) ||
      c.listing.title.toLowerCase().includes(query) ||
      c.lastMessage.toLowerCase().includes(query)
  );
});

// Check for pending message from "Contact Seller" button
const checkPendingMessage = async () => {
  const pendingData = localStorage.getItem('pendingMessage');
  
  if (pendingData) {
    try {
      const { listingID, sellerID, listingTitle, sellerName } = JSON.parse(pendingData);
      
      // Clear pending message
      localStorage.removeItem('pendingMessage');
      
      // Check if conversation already exists
      const existingConv = conversations.value.find(
        c => c.listing.listingID === listingID && c.otherUser.userID === sellerID
      );
      
      if (existingConv) {
        // Open existing conversation
        selectConversation(existingConv);
      } else {
        // Create a temporary conversation object and open it
        const tempConv = {
          conversationId: `${listingID}-${sellerID}`,
          listing: {
            listingID: listingID,
            title: listingTitle
          },
          otherUser: {
            userID: sellerID,
            fullName: sellerName,
            email: '',
            profilePicture: null
          },
          lastMessage: '',
          lastMessageTime: new Date(),
          unreadCount: 0
        };
        
        // Add to conversations list temporarily
        conversations.value.unshift(tempConv);
        
        // Select it
        selectConversation(tempConv);
      }
    } catch (error) {
      console.error('Failed to process pending message:', error);
    }
  } else {
    // Check if there was a selected conversation before refresh
    const savedConv = localStorage.getItem('selectedConversation');
    if (savedConv) {
      try {
        const { listingID, otherUserID } = JSON.parse(savedConv);
        
        // Find the conversation in the loaded list
        const conv = conversations.value.find(
          c => c.listing.listingID === listingID && c.otherUser.userID === otherUserID
        );
        
        if (conv) {
          selectConversation(conv);
        }
      } catch (error) {
        console.error('Failed to restore conversation:', error);
      }
    }
  }
};

// Fetch all conversations
const fetchConversations = async () => {
  loading.value = true;
  try {
    const response = await axios.get('http://localhost:5000/api/messages/conversations', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    conversations.value = response.data.conversations || [];
  } catch (error) {
    console.error('Failed to fetch conversations:', error);
  } finally {
    loading.value = false;
  }
};

// Select a conversation
const selectConversation = async (conversation) => {
  console.log('Selecting conversation:', conversation);
  selectedConversation.value = conversation;
  
  // Save to localStorage so it persists on refresh
  localStorage.setItem('selectedConversation', JSON.stringify({
    conversationId: conversation.conversationId,
    listingID: conversation.listing.listingID,
    otherUserID: conversation.otherUser.userID
  }));
  
  await fetchMessages(conversation.listing.listingID, conversation.otherUser.userID);
};

// Fetch messages for a conversation
const fetchMessages = async (listingId, otherUserId) => {
  loadingMessages.value = true;
  messages.value = []; // Clear old messages
  
  try {
    console.log('Fetching messages for listing:', listingId, 'with user:', otherUserId);
    
    const response = await axios.get(
      `http://localhost:5000/api/messages/${listingId}/${otherUserId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );

    console.log('Messages response:', response.data);
    messages.value = response.data.messages || [];
    console.log('Loaded messages:', messages.value);

    // Scroll to bottom after loading
    await nextTick();
    scrollToBottom();
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    messages.value = [];
  } finally {
    loadingMessages.value = false;
  }
};

// Send a message
const sendMessage = async () => {
  if (!newMessage.value.trim() || !selectedConversation.value) return;

  sending.value = true;
  const messageText = newMessage.value.trim();
  
  // Store current conversation details
  const listingID = selectedConversation.value.listing.listingID;
  const receiverID = selectedConversation.value.otherUser.userID;

  try {
    const response = await axios.post(
      'http://localhost:5000/api/messages',
      {
        listingID: listingID,
        receiverID: receiverID,
        messageText: messageText
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );

    // Add message to current chat
    messages.value.push(response.data.message);

    // Clear input
    newMessage.value = '';

    // Scroll to bottom
    await nextTick();
    scrollToBottom();

    // DON'T refresh conversations - just update the current one
    const convIndex = conversations.value.findIndex(
      c => c.listing.listingID === listingID && c.otherUser.userID === receiverID
    );
    
    if (convIndex !== -1) {
      // Update existing conversation
      conversations.value[convIndex].lastMessage = messageText;
      conversations.value[convIndex].lastMessageTime = response.data.message.sentAt;
      
      // Move to top
      const conv = conversations.value.splice(convIndex, 1)[0];
      conversations.value.unshift(conv);
      
      // Keep it selected
      selectedConversation.value = conv;
    }
  } catch (error) {
    console.error('Failed to send message:', error);
    alert('Failed to send message. Please try again.');
  } finally {
    sending.value = false;
  }
};

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const viewListing = (listingId) => {
  router.push(`/listing/${listingId}`);
};

const getProfilePictureUrl = (picturePath) => {
  if (!picturePath) return '';
  return `http://localhost:5000/${picturePath}`;
};

const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

const formatTime = (date) => {
  if (!date) return '';

  const now = new Date();
  const messageDate = new Date(date);
  const diffMs = now - messageDate;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;

  return messageDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

onMounted(async () => {
  await fetchConversations();
  checkPendingMessage();
});
</script>

<style scoped>
.conversation-item {
  transition: background-color 0.2s;
}

.conversation-item:hover {
  background-color: #f8f9fa;
}

.conversation-item.active {
  background-color: #e7f3ff;
  border-left: 3px solid #0d6efd;
}

.conversation-list {
  max-height: calc(100vh - 300px);
  overflow-y: auto;
}

.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
