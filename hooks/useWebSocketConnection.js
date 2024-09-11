import { useState, useEffect, useCallback } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { API_URL } from '../const';

const useWebSocketConnection = () => {
  const [socketUrl] = useState(API_URL);
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    onOpen: () => console.log('WebSocket connection opened'),
    onError: (error) => console.error('WebSocket error:', error),
    onClose: (event) => console.log('WebSocket connection closed:', event),
    shouldReconnect: (closeEvent) => true,
    reconnectInterval: 3000,
  });

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  useEffect(() => {
    console.log('WebSocket connection status:', connectionStatus);
  }, [connectionStatus]);

  const sendWebSocketMessage = useCallback((message) => {
    if (readyState === ReadyState.OPEN) {
      sendMessage(message);
    } else {
      console.warn('WebSocket is not connected. Current status:', connectionStatus);
    }
  }, [sendMessage, readyState, connectionStatus]);

  return {
    sendWebSocketMessage,
    lastMessage,
    connectionStatus,
    isConnected: readyState === ReadyState.OPEN,
  };
};

export default useWebSocketConnection;