import { useState, useEffect, useCallback, useRef } from 'react';
import type { CastMessage } from '../types';
import { CAST_NAMESPACE } from '../types';

// Set this to your registered Cast application ID.
// During development, use the default media receiver for testing discovery.
const CAST_APP_ID = import.meta.env.VITE_CAST_APP_ID || 'CC1AD845';

interface CastSessionState {
  available: boolean;
  connected: boolean;
  startCasting: () => void;
  stopCasting: () => void;
  sendMessage: (message: CastMessage) => void;
}

export default function useCastSession(): CastSessionState {
  const [available, setAvailable] = useState(false);
  const [connected, setConnected] = useState(false);
  const sdkLoadedRef = useRef(false);

  useEffect(() => {
    // Load the Cast Sender SDK
    if (document.querySelector('script[src*="cast_sender"]')) {
      return;
    }

    window.__onGCastApiAvailable = (isAvailable: boolean) => {
      if (!isAvailable) return;
      sdkLoadedRef.current = true;

      const context = cast.framework.CastContext.getInstance();
      context.setOptions({
        receiverApplicationId: CAST_APP_ID,
        autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,
      });

      context.addEventListener(
        cast.framework.CastContextEventType.CAST_STATE_CHANGED,
        (event: cast.framework.CastStateEventData) => {
          setAvailable(event.castState !== cast.framework.CastState.NO_DEVICES_AVAILABLE);
          setConnected(event.castState === cast.framework.CastState.CONNECTED);
        },
      );
    };

    const script = document.createElement('script');
    script.src = 'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1';
    script.async = true;
    document.head.appendChild(script);
  }, []);

  const startCasting = useCallback(() => {
    if (!sdkLoadedRef.current) return;
    cast.framework.CastContext.getInstance()
      .requestSession()
      .catch(() => {
        // User cancelled or no device selected
      });
  }, []);

  const stopCasting = useCallback(() => {
    if (!sdkLoadedRef.current) return;
    cast.framework.CastContext.getInstance().endCurrentSession(true);
    setConnected(false);
  }, []);

  const sendMessage = useCallback((message: CastMessage) => {
    if (!sdkLoadedRef.current) return;
    const session = cast.framework.CastContext.getInstance().getCurrentSession();
    if (session) {
      session.sendMessage(CAST_NAMESPACE, JSON.stringify(message)).catch((err: unknown) => {
        console.error('[Cast] Failed to send message:', err);
      });
    }
  }, []);

  return { available, connected, startCasting, stopCasting, sendMessage };
}
