"use client";

import React, { createContext, useContext, useRef } from "react";

export type EventName = 'Selected' | 'Unselected' | 'Updated' | 'Open' | 'Load' | 'Unload';

export type MessengerCallback = (arg?: unknown) => void;

// doesn't need to be exported, only used here to track event subscriptions
interface MessengerEvents {
  [key: string]: MessengerCallback[];
}

export interface MessageKey {
  id: string;
  name?: EventName;
}

export interface MessengerContextType {
  subscribe: (event: string, callback: MessengerCallback) => void;
  publish: (event: string, data?: object) => void;
  unsubscribe: (event: string, callback: MessengerCallback) => void;
}

const MessengerContext = createContext<MessengerContextType | undefined>(undefined);

export function MessengerProvider({ children }: { children: React.ReactNode }) {

  const messengerRef = useRef<MessengerEvents>({ });

  const getMessenger = () => {
    return messengerRef.current;
  };

  const subscribe = (event: string, callback: MessengerCallback) => {
    const messenger = getMessenger();
    if (!messenger[event]) {
      messenger[event] = [];
    }
    messenger[event].push(callback);
  };

  const publish = (event: string, data?: object) => {
    const messenger = getMessenger();
    if (messenger[event]) {
      messenger[event].forEach((callback) => callback(data));
    }
  };

  const unsubscribe = (event: string, callback: MessengerCallback) => {
    const messenger = getMessenger();
    if (messenger[event]) {
      messenger[event] = messenger[event].filter(
        (cb) => cb !== callback,
      );
    }
  };

  const value = {
    subscribe,
    publish,
    unsubscribe,
  };

  return (
    <MessengerContext.Provider value={value}>
      {children}
    </MessengerContext.Provider>
  );
}

export function useMessenger() {
  const context = useContext(MessengerContext);
  if (!context) {
    throw new Error("useMessenger must be used within a MessengerProvider");
  }
  return context;
}
