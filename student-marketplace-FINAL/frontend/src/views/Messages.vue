<template>
  <div class="container-fluid py-4" style="height: 85vh;">
    <div class="row h-100 shadow-sm rounded bg-white overflow-hidden border">
      
      <div class="col-md-4 border-end d-flex flex-column h-100 bg-white p-0">
        
        <div class="p-3 border-bottom">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h4 class="fw-bold mb-0">Messages</h4>
            <span class="badge bg-primary rounded-pill">{{ conversations.length }}</span>
          </div>

          <div class="">
            <input
              type="text"
              class="form-control bg-light border-0"
              placeholder="Search messages..."
              v-model="searchQuery"
            />
          </div>
        </div>

        <div class="flex-grow-1 overflow-auto">
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
            <p class="text-muted small mt-2">Loading conversations...</p>
          </div>

          <div v-else-if="filteredConversations.length === 0" class="text-center py-5 px-3">
            <i class="bi bi-chat-dots display-4 text-muted opacity-50"></i>
            <p class="text-muted mt-3 fw-bold">No messages yet</p>
            <small class="text-muted d-block">Start a conversation from a listing!</small>
          </div>

          <div v-else>
            <div
              v-for="conversation in filteredConversations"
              :key="conversation.conversationId"
              class="conversation-item p-3 border-bottom position-relative"
              :class="{ 'active-chat': selectedConversation?.conversationId === conversation.conversationId }"
              @click="selectConversation(conversation)"
              style="cursor: pointer"
            >
              <div class="d-flex align-items-start">
                <div class="me-3 flex-shrink-0">
                  <div
                    v-if="conversation.otherUser.profilePicture"
                    class="rounded-circle overflow-hidden border"
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
                    class="bg-primary bg-gradient text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm"
                    style="width: 50px; height: 50px; font-size: 18px"
                  >
                    {{ getInitials(conversation.otherUser.fullName) }}
                  </div>
                </div>

                <div class="flex-grow-1 overflow-hidden">
                  <div class="d-flex justify-content-between align-items-center mb-1">
                    <h6 class="mb-0 fw-bold text-truncate" style="max-width: 140px;">{{ conversation.otherUser.fullName }}</h6>
                    <small class="text-muted" style="font-size: 0.75rem;">{{ formatTime(conversation.lastMessageTime) }}</small>
                  </div>
                  <p class="text-primary small mb-1 fw-medium text-truncate">
                    <i class="bi bi-tag-fill me-1"></i>{{ conversation.listing.title }}
                  </p>
                  <div class="d-flex justify-content-between align-items-center">
                    <p class="text-muted small mb-0 text-truncate flex-grow-1" style="max-width: 180px;">
                      {{ conversation.lastMessage }}
                    </p>
                    <span v-if="conversation.unreadCount > 0" class="badge bg-danger rounded-pill ms-2">
                      {{ conversation.unreadCount }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-8 d-flex flex-column h-100 p-0 bg-light">
        
        <div v-if="!selectedConversation" class="d-flex align-items-center justify-content-center h-100 flex-column text-center opacity-50">
          <i class="bi bi-chat-left-text display-1 mb-3"></i>
          <h5>Select a conversation to start messaging</h5>
        </div>

        <div v-else class="d-flex flex-column h-100">
          
          <div class="border-bottom p-3 bg-white shadow-sm z-index-1">
            <div class="d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center">
                <div class="me-3">
                  <div v-if="selectedConversation.otherUser.profilePicture" class="rounded-circle overflow-hidden" style="width: 40px; height: 40px">
                    <img :src="getProfilePictureUrl(selectedConversation.otherUser.profilePicture)" style="width: 100%; height: 100%; object-fit: cover" />
                  </div>
                  <div v-else class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px">
                    {{ getInitials(selectedConversation.otherUser.fullName) }}
                  </div>
                </div>
                <div>
                  <h6 class="mb-0 fw-bold">{{ selectedConversation.otherUser.fullName }}</h6>
                  <small class="text-muted">Item: {{ selectedConversation.listing.title }}</small>
                </div>
              </div>
              <button class="btn btn-outline-primary btn-sm rounded-pill px-3" @click="viewListing(selectedConversation.listing.listingID)">
                View Listing
              </button>
            </div>
          </div>

          <div class="flex-grow-1 overflow-auto p-4" ref="messagesContainer" style="background-color: #f8f9fa">
            <div v-if="loadingMessages" class="text-center py-5">
              <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
            </div>

            <div v-else>
              <TransitionGroup name="message-anim" tag="div">
                <div
                  v-for="message in messages"
                  :key="message.messageID"
                  class="mb-3 d-flex"
                  :class="message.senderID === currentUserId ? 'justify-content-end' : 'justify-content-start'"
                >
                  <div
                    class="d-inline-block p-3 rounded-4 shadow-sm text-start"
                    :class="message.senderID === currentUserId ? 'bg-primary text-white rounded-bottom-right-0' : 'bg-white text-dark rounded-bottom-left-0'"
                    style="max-width: 75%; min-width: 100px; position: relative"
                  >
                    <p class="mb-1" style="word-wrap: break-word;">{{ message.messageText }}</p>
                    
                    <div class="d-flex align-items-center justify-content-end gap-1 mt-1">
                      <small :class="message.senderID === currentUserId ? 'text-white-50' : 'text-muted'" style="font-size: 0.7rem;">
                        {{ formatTime(message.sentAt) }}
                      </small>
                      <span v-if="message.senderID === currentUserId" class="ms-1" style="font-size: 0.9rem; line-height: 1;">
                        <i v-if="message.isRead" class="bi bi-check-all text-white" title="Read"></i>
                        <i v-else class="bi bi-check text-white-50" title="Sent"></i>
                      </span>
                    </div>
                  </div>
                </div>
              </TransitionGroup>
            </div>
          </div>

          <div class="border-top p-3 bg-white">
            <form @submit.prevent="sendMessage" class="d-flex gap-2">
              <input
                type="text"
                class="form-control bg-light border-0 py-2"
                placeholder="Type your message..."
                v-model="newMessage"
                :disabled="sending"
              />
              <button
                type="submit"
                class="btn btn-primary px-4"
                :disabled="!newMessage.trim() || sending"
              >
                <span v-if="sending" class="spinner-border spinner-border-sm me-1"></span>
                <i v-else class="bi bi-send-fill"></i>
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
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
let pollingInterval = null;

// Simple notification sound
const notificationSound = new Audio('https://cdn.freesound.org/previews/536/536108_11562226-lq.mp3');

const currentUserId = computed(() => {
  const userId = user.value?.userID;
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
      
      localStorage.removeItem('pendingMessage');
      
      const existingConv = conversations.value.find(
        c => c.listing.listingID === listingID && c.otherUser.userID === sellerID
      );
      
      if (existingConv) {
        selectConversation(existingConv);
      } else {
        const tempConv = {
          conversationId: `${listingID}-${sellerID}`,
          listing: { listingID: listingID, title: listingTitle },
          otherUser: { userID: sellerID, fullName: sellerName, email: '', profilePicture: null },
          lastMessage: '',
          lastMessageTime: new Date(),
          unreadCount: 0
        };
        conversations.value.unshift(tempConv);
        selectConversation(tempConv);
      }
    } catch (error) {
      console.error('Failed to process pending message:', error);
    }
  } else {
    const savedConv = localStorage.getItem('selectedConversation');
    if (savedConv) {
      try {
        const { listingID, otherUserID } = JSON.parse(savedConv);
        const conv = conversations.value.find(
          c => c.listing.listingID === listingID && c.otherUser.userID === otherUserID
        );
        if (conv) selectConversation(conv);
      } catch (error) {
        console.error('Failed to restore conversation:', error);
      }
    }
  }
};

const fetchConversations = async () => {
  loading.value = true;
  try {
    const response = await axios.get('http://localhost:5000/api/messages/conversations', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    conversations.value = response.data.conversations || [];
  } catch (error) {
    console.error('Failed to fetch conversations:', error);
  } finally {
    loading.value = false;
  }
};

const selectConversation = async (conversation) => {
  selectedConversation.value = conversation;
  
  localStorage.setItem('selectedConversation', JSON.stringify({
    conversationId: conversation.conversationId,
    listingID: conversation.listing.listingID,
    otherUserID: conversation.otherUser.userID
  }));
  
  await fetchMessages(conversation.listing.listingID, conversation.otherUser.userID);
  startPolling();
};

const fetchMessages = async (listingId, otherUserId) => {
  loadingMessages.value = true;
  messages.value = [];
  
  try {
    const response = await axios.get(
      `http://localhost:5000/api/messages/${listingId}/${otherUserId}`,
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    );
    messages.value = response.data.messages || [];
    await nextTick();
    scrollToBottom();
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    messages.value = [];
  } finally {
    loadingMessages.value = false;
  }
};

const sendMessage = async () => {
  if (!newMessage.value.trim() || !selectedConversation.value) return;

  sending.value = true;
  const messageText = newMessage.value.trim();
  const listingID = selectedConversation.value.listing.listingID;
  const receiverID = selectedConversation.value.otherUser.userID;

  try {
    const response = await axios.post(
      'http://localhost:5000/api/messages',
      { listingID, receiverID, messageText },
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    );

    messages.value.push(response.data.message);
    newMessage.value = '';
    await nextTick();
    scrollToBottom();

    const convIndex = conversations.value.findIndex(
      c => c.listing.listingID === listingID && c.otherUser.userID === receiverID
    );
    
    if (convIndex !== -1) {
      conversations.value[convIndex].lastMessage = messageText;
      conversations.value[convIndex].lastMessageTime = response.data.message.sentAt;
      const conv = conversations.value.splice(convIndex, 1)[0];
      conversations.value.unshift(conv);
      selectedConversation.value = conv;
    }
  } catch (error) {
    console.error('Failed to send message:', error);
    alert('Failed to send message. Please try again.');
  } finally {
    sending.value = false;
  }
};

const startPolling = () => {
  stopPolling();
  pollingInterval = setInterval(async () => {
    if (selectedConversation.value) {
      try {
        const listingId = selectedConversation.value.listing.listingID;
        const otherUserId = selectedConversation.value.otherUser.userID;
        
        const response = await axios.get(
          `http://localhost:5000/api/messages/${listingId}/${otherUserId}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        
        const newMessages = response.data.messages || [];
        const hasChanges = JSON.stringify(newMessages) !== JSON.stringify(messages.value);

        if (hasChanges) {
          if (newMessages.length > messages.value.length) {
            const lastMsg = newMessages[newMessages.length - 1];
            if (lastMsg.senderID !== currentUserId.value) {
              try {
                notificationSound.currentTime = 0;
                notificationSound.play();
              } catch (e) {
                console.log("Audio autoplay prevented", e);
              }
              const originalTitle = document.title;
              document.title = "💬 New Message!";
              setTimeout(() => document.title = originalTitle, 3000);
            }
          }

          messages.value = newMessages;
          
          if (newMessages.length > messages.value.length) {
             await nextTick();
             scrollToBottom();
          }
        }
      } catch (e) {
        console.error("Polling error", e);
      }
    }
  }, 3000);
};

const stopPolling = () => {
  if (pollingInterval) clearInterval(pollingInterval);
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
  return name.split(' ').map((word) => word[0]).join('').toUpperCase().substring(0, 2);
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

onUnmounted(() => {
  stopPolling();
});
</script>

<style scoped>
/* Scoped styles for highlighting the active chat */
.conversation-item:hover {
  background-color: #f8f9fa;
}

.active-chat {
  background-color: #e7f3ff !important;
  border-left: 4px solid #0d6efd;
}

/* Animations */
.message-anim-enter-active,
.message-anim-leave-active {
  transition: all 0.3s ease;
}

.message-anim-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.message-anim-leave-to {
  opacity: 0;
}

.rounded-bottom-right-0 {
  border-bottom-right-radius: 0 !important;
}

.rounded-bottom-left-0 {
  border-bottom-left-radius: 0 !important;
}

/* Custom Scrollbar */
.overflow-auto::-webkit-scrollbar {
  width: 6px;
}
.overflow-auto::-webkit-scrollbar-track {
  background: transparent;
}
.overflow-auto::-webkit-scrollbar-thumb {
  background-color: #ced4da;
  border-radius: 10px;
}
</style>