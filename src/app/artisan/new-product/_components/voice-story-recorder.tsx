'use client';

import { useState, useEffect, useRef } from 'react';
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
  const isListeningRef = useRef(false);
  const recognitionRef = useRef<any>(null);

  const { activeLanguage } = useAssistantContext();
  const { toast } = useToast();

  const setListeningState = (state: boolean) => {
    setIsListening(state);
    isListeningRef.current = state;
  };

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

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognitionRef.current = recognition;

    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  const processTranscript = async (transcript: string) => {
    onTranscriptUpdate(transcript);
  };

  const startRecording = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (isListeningRef.current) return;

    try {
      const recognition = recognitionRef.current;
      recognition.lang = getLangCode(activeLanguage || 'en');

      recognition.onstart = () => {
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
        toast({
          title: '🎤 Listening...',
          description: 'Speak now.',
        });
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + ' ';
          }
        }
        if (finalTranscript.trim()) {
          processTranscript(finalTranscript.trim());
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);

        if (event.error === "network") {
          console.warn("Temporary speech service issue. Stopping recognition to prevent loops.");
          setListeningState(false);
          recognition.stop();
          return;
        }

        if (event.error === "not-allowed") {
          alert("Microphone permission denied.");
          setListeningState(false);
        }
      };

      recognition.onend = () => {
        setListeningState(false);
      };

      recognition.start();
      setListeningState(true);
    } catch (e) {
      console.error("Failed to start recording", e);
    }
  };

  const stopRecording = () => {
    if (!recognitionRef.current) return;
    setListeningState(false);
    recognitionRef.current.stop();
  };

  const toggleListening = () => {
    if (isListeningRef.current) {
      stopRecording();
    } else {
      startRecording();
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
