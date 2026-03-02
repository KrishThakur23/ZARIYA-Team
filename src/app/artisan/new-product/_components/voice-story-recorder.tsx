'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAssistantContext } from '@/app/artisan/_components/assistant-provider';

interface VoiceStoryRecorderProps {
  onTranscriptUpdate: (text: string) => void;
  onAiResponse?: (text: string) => void;
  isProcessing?: boolean;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function VoiceStoryRecorder({ onTranscriptUpdate, onAiResponse, isProcessing = false }: VoiceStoryRecorderProps) {
  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const { activeLanguage } = useAssistantContext();
  const { toast } = useToast();

  const getLangCode = (lang: string) => {
    const langMap: Record<string, string> = {
      'en': 'en-IN',
      'hi': 'hi-IN',
      'ta': 'ta-IN',
      'bn': 'bn-IN',
      'mr': 'mr-IN',
      'gu': 'gu-IN',
      'te': 'te-IN',
      'kn': 'kn-IN',
      'ml': 'ml-IN',
    };
    return langMap[lang] || 'en-IN';
  };

  const processTranscript = async (transcript: string) => {
    // 1. Send the spoken text back to the parent textarea immediately
    onTranscriptUpdate(transcript);
  };

  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast({
        variant: 'destructive',
        title: 'Not Supported',
        description: 'Speech recognition is not supported in this browser.',
      });
      return;
    }

    if (isListening) {
      // Note: 'continuous=false' stops smoothly on its own, 
      // but if the user clicks again, we just toggle the state off.
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = getLangCode(activeLanguage || 'en');

    recognition.onstart = () => {
      // Prevent voice feedback loops by stopping any currently playing AI response
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsListening(true);
      toast({
        title: '🎤 Listening...',
        description: 'Speak now.',
      });
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      processTranscript(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      if (event.error !== 'no-speech') {
        toast({
          variant: 'destructive',
          title: 'Microphone Error',
          description: `Error: ${event.error}`,
        });
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  const isDisable = isProcessing || isTranscribing;

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Button
        type="button"
        onClick={toggleListening}
        disabled={isDisable}
        size="lg"
        className={`rounded-full h-16 w-16 transition-all duration-300 ${isListening
          ? 'bg-red-500 hover:bg-red-600 animate-pulse shadow-lg shadow-red-200'
          : isDisable
            ? 'bg-gray-400'
            : 'bg-gradient-to-r from-orange-600 to-red-600 hover:scale-105 shadow-xl shadow-orange-200'
          }`}
      >
        {isTranscribing ? (
          <Loader2 className="h-6 w-6 animate-spin text-white" />
        ) : isListening ? (
          <Square className="h-6 w-6 fill-white" />
        ) : (
          <Mic className="h-6 w-6" />
        )}
      </Button>

      {isListening && (
        <span className="text-sm font-medium text-red-500 animate-pulse">
          Listening...
        </span>
      )}
      {isTranscribing && (
        <span className="text-sm font-medium text-orange-600 animate-pulse">
          AI is thinking...
        </span>
      )}
    </div>
  );
}
