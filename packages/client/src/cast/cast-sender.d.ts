// Minimal type declarations for Google Cast Sender SDK (CAF)
declare namespace cast.framework {
  class CastContext {
    static getInstance(): CastContext;
    setOptions(options: CastOptions): void;
    getCurrentSession(): CastSession | null;
    requestSession(): Promise<void>;
    endCurrentSession(stopCasting: boolean): void;
    addEventListener(type: string, listener: (event: CastStateEventData) => void): void;
    removeEventListener(type: string, listener: (event: CastStateEventData) => void): void;
    getCastState(): string;
  }

  interface CastOptions {
    receiverApplicationId: string;
    autoJoinPolicy: string;
  }

  interface CastSession {
    sendMessage(namespace: string, message: string): Promise<void>;
    getSessionId(): string;
  }

  interface CastStateEventData {
    castState: string;
  }

  const CastContextEventType: {
    CAST_STATE_CHANGED: string;
    SESSION_STATE_CHANGED: string;
  };

  const CastState: {
    NO_DEVICES_AVAILABLE: string;
    NOT_CONNECTED: string;
    CONNECTING: string;
    CONNECTED: string;
  };
}

declare namespace chrome.cast {
  const AutoJoinPolicy: {
    ORIGIN_SCOPED: string;
    TAB_AND_ORIGIN_SCOPED: string;
    PAGE_SCOPED: string;
  };
}

interface Window {
  __onGCastApiAvailable?: (isAvailable: boolean) => void;
}
