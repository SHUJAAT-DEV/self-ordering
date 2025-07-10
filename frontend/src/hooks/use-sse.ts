import { useEffect, useRef } from "react";
import { SSEClient, type SSEMessage } from "@/lib/sse";

export function useSSE(url: string, onMessage: (data: SSEMessage) => void) {
  const sseClientRef = useRef<SSEClient | null>(null);
  const onMessageRef = useRef<(data: SSEMessage) => void>(onMessage);

  // Update the callback ref when onMessage changes
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    // Create SSE client
    sseClientRef.current = new SSEClient(url);

    // Add message listener
    const messageHandler = (data: SSEMessage) => {
      onMessageRef.current(data);
    };

    sseClientRef.current.addListener(messageHandler);

    // Cleanup on unmount
    return () => {
      if (sseClientRef.current) {
        sseClientRef.current.removeListener(messageHandler);
        sseClientRef.current.close();
        sseClientRef.current = null;
      }
    };
  }, [url]);

  return {
    isConnected: sseClientRef.current?.isConnected() || false,
    readyState: sseClientRef.current?.getReadyState() || EventSource.CLOSED,
  };
}
