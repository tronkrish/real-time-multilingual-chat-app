import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:8080/ws';

let stompClient = null;
let connectionStatusCallback = null;
let typingTimeout = null;

export function setConnectionStatusCallback(callback) {
  connectionStatusCallback = callback;
}

export function connectWebSocket(userId, onMessageReceived) {
  if (connectionStatusCallback) connectionStatusCallback('connecting');

  stompClient = new Client({
    webSocketFactory: () => new SockJS(WS_URL),
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    debug: () => {},
  });

  stompClient.onConnect = () => {
    console.log('WebSocket connected');
    if (connectionStatusCallback) connectionStatusCallback('connected');

    // Subscribe to personal message channel
    stompClient.subscribe(`/topic/messages/${userId}`, (message) => {
      const body = JSON.parse(message.body);
      onMessageReceived(body);
    });
  };

  stompClient.onStompError = (frame) => {
    console.error('STOMP error:', frame);
    if (connectionStatusCallback) connectionStatusCallback('disconnected');
  };

  stompClient.onDisconnect = () => {
    if (connectionStatusCallback) connectionStatusCallback('disconnected');
  };

  stompClient.onWebSocketClose = () => {
    if (connectionStatusCallback) connectionStatusCallback('connecting');
  };

  stompClient.activate();

  return stompClient;
}

export function sendMessage(messageDTO) {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: '/app/sendMessage',
      body: JSON.stringify(messageDTO),
    });
  }
}

export function sendTypingIndicator(senderId, receiverId) {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: '/app/typing',
      body: JSON.stringify({ senderId, receiverId, type: 'typing' }),
    });
  }
}

export function sendMarkAsRead(senderId, receiverId) {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: '/app/markRead',
      body: JSON.stringify({ senderId, receiverId, type: 'read' }),
    });
  }
}

/**
 * Debounced typing indicator — sends at most once per second
 */
export function emitTyping(senderId, receiverId) {
  if (typingTimeout) return;
  sendTypingIndicator(senderId, receiverId);
  typingTimeout = setTimeout(() => {
    typingTimeout = null;
  }, 1000);
}

export function disconnectWebSocket() {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
  }
  if (connectionStatusCallback) connectionStatusCallback(null);
}
