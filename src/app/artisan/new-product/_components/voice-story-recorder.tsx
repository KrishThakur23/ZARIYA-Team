'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VoiceStoryRecorderProps {
  onTranscriptUpdate: (text: string) => void;
  isProcessing?: boolean;
}

// Declare Web Speech API types
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function VoiceStoryRecorder({ onTranscriptUpdate, isProcessing = false }: VoiceStoryRecorderProps) {
  const [isListening, setIsListening] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  // Load selected language from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const lang = localStorage.getItem('zariya_selected_language') || 'en';
      setSelectedLanguage(lang);
    }
  }, []);

  // Initialize Web Speech API
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    // Set language based on selection
    const getLangCode = (lang: string) => {
      const langMap: Record<string, string> = {
        'en': 'en-US',
        'hi': 'hi-IN',
        'ta': 'ta-IN',
        'bn': 'bn-IN',
        'mr': 'mr-IN',
        'gu': 'gu-IN',
        'te': 'te-IN',
        'kn': 'kn-IN',
        'ml': 'ml-IN',
      };
      return langMap[lang] || 'en-US';
    };

    recognition.lang = getLangCode(selectedLanguage);

    recognition.onresult = (event: any) => {
      let interimText = '';
      let finalText = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPiece = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalText += transcriptPiece + ' ';
        } else {
          interimText += transcriptPiece;
        }
      }

      if (finalText) {
        onTranscriptUpdate(finalText);
      }
    };

    recognition.onerror = (event: any) => {
      if (event.error !== 'no-speech') {
        setIsListening(false);
      }
    };

    recognition.onend = () => {
      if (isListening) {
        recognition.start();
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [selectedLanguage, isListening, onTranscriptUpdate]);

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) {
      toast({
        variant: 'destructive',
        title: 'Speech recognition unavailable',
        description: 'Your browser doesn\'t support speech recognition.',
      });
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      toast({
        title: 'Recording stopped',
        description: 'You can edit the text or click mic to add more.',
      });
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        toast({
          title: '🎤 Listening...',
          description: 'Speak now.',
        });
      } catch (error) {
        console.error('Error starting recognition:', error);
      }
    }
  }, [isListening, toast]);

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Button
        type="button"
        onClick={toggleListening}
        disabled={isProcessing}
        size="lg"
        className={`rounded-full h-16 w-16 transition-all duration-300 ${isListening
          ? 'bg-red-500 hover:bg-red-600 animate-pulse shadow-lg shadow-red-200'
          : 'bg-gradient-to-r from-orange-600 to-red-600 hover:scale-105 shadow-xl shadow-orange-200'
          }`}
      >
        {isListening ? (
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
    </div>
  );
}


