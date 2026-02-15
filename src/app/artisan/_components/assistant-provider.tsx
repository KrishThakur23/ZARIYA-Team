'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

type AssistantMessage = {
  message: string;
  timestamp: number;
};

type AssistantContextType = {
  assistantMessage: AssistantMessage;
  setAssistantMessage: (message: string) => void;
};

const AssistantContext = createContext<AssistantContextType | undefined>(
  undefined
);

export function AssistantProvider({ 
  children,
  initialMessage = "Welcome, Artisan! Let's get started." 
}: { 
  children: ReactNode,
  initialMessage?: string,
}) {
  const [assistantMessage, setAssistantMessageState] = useState<AssistantMessage>(
    {
      message: initialMessage,
      timestamp: Date.now(),
    }
  );

  const setAssistantMessage = useCallback((message: string) => {
    setAssistantMessageState({ message, timestamp: Date.now() });
  }, []);

  return (
    <AssistantContext.Provider
      value={{ assistantMessage, setAssistantMessage }}
    >
      {children}
    </AssistantContext.Provider>
  );
}

export function useAssistantContext() {
  const context = useContext(AssistantContext);
  if (context === undefined) {
    throw new Error(
      'useAssistantContext must be used within an AssistantProvider'
    );
  }
  return context;
}
