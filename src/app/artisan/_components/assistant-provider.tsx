'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

type AssistantMessage = {
  message: string;
  timestamp: number;
};

type AssistantContextType = {
  assistantMessage: AssistantMessage;
  setAssistantMessage: (message: string) => void;
  activeLanguage: string | null;
  setActiveLanguage: (lang: string | null) => void;
};

const AssistantContext = createContext<AssistantContextType | undefined>(
  undefined
);

export function AssistantProvider({
  children,
}: {
  children: ReactNode,
}) {
  const [assistantMessage, setAssistantMessageState] = useState<AssistantMessage>(
    {
      message: '',
      timestamp: Date.now(),
    }
  );

  const [activeLanguage, setActiveLanguage] = useState<string | null>(null);

  const setAssistantMessage = useCallback((message: string) => {
    setAssistantMessageState({ message, timestamp: Date.now() });
  }, []);

  return (
    <AssistantContext.Provider
      value={{ assistantMessage, setAssistantMessage, activeLanguage, setActiveLanguage }}
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
