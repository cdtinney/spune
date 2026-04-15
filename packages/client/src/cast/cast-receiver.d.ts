// Minimal type declarations for Google Cast Receiver SDK (CAF)
declare namespace cast.framework {
  class CastReceiverContext {
    static getInstance(): CastReceiverContext;
    start(options?: CastReceiverOptions): void;
    stop(): void;
    addCustomMessageListener(namespace: string, listener: (event: system.Event) => void): void;
    addEventListener(type: string, listener: (event: system.Event) => void): void;
    sendCustomMessage(namespace: string, senderId: string, message: unknown): void;
  }

  class CastReceiverOptions {
    disableIdleTimeout?: boolean;
  }

  namespace system {
    interface Event {
      type: string;
    }

    interface MessageEvent extends Event {
      data: unknown;
      senderId: string;
    }

    const EventType: {
      SENDER_CONNECTED: string;
      SENDER_DISCONNECTED: string;
    };
  }
}
