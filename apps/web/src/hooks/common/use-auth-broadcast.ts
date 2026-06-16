import { useEffect, useCallback } from 'react';
import type { AuthBroadcastMessage } from '@/types';

const CHANNEL_NAME = 'cryptokit_auth_stream';

export function useAuthBroadcast(
  onMessage?: (data: AuthBroadcastMessage) => void
) {
  const emit = useCallback((message: AuthBroadcastMessage) => {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channel.postMessage(message);
    channel.close();
  }, []);

  useEffect(() => {
    if (!onMessage) return;
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channel.onmessage = (event: MessageEvent<AuthBroadcastMessage>) => {
      onMessage(event.data);
    };

    return () => {
      channel.close();
    };
  }, [onMessage]);

  return { emit };
}
