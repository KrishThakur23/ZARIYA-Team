
'use client';

import { useAssistantContext } from '@/app/artisan/_components/assistant-provider';
import { assistantTranslations } from '@/lib/i18n';
import { Volume2, VolumeX } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

const langMap: Record<string, string> = {
  en: "en-US",
  hi: "hi-IN",
  mr: "mr-IN",
  ta: "ta-IN",
  te: "te-IN",
  bn: "bn-IN",
  pa: "pa-IN"
};

export default function VoiceAssistant() {
  const { assistantMessage, activeLanguage } = useAssistantContext();
  const [displayedMessage, setDisplayedMessage] = useState('');
  const [animationKey, setAnimationKey] = useState(0);
  const isMobile = useIsMobile();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isSpeakingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const setIsSpeakingState = (state: boolean) => {
    setIsSpeaking(state);
    isSpeakingRef.current = state;
  };

  // Effect to handle user interaction for autoplay
  useEffect(() => {
    // Auto-enable interaction after a short delay to allow page to load
    const autoEnableTimer = setTimeout(() => {
      setHasInteracted(true);
    }, 500);

    const handleInteraction = () => {
      setHasInteracted(true);
      clearTimeout(autoEnableTimer);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);

    return () => {
      clearTimeout(autoEnableTimer);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

  // Initialize audio element and attach listeners
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      // Configure audio element for better resilience
      audioRef.current.preload = 'auto';
      audioRef.current.crossOrigin = 'anonymous';
    }
    const currentAudioRef = audioRef.current;

    const onEnded = () => setIsSpeakingState(false);
    const onPause = () => {
      // If audio was paused by browser (e.g., due to camera access), try to resume
      if (isSpeaking && currentAudioRef.currentTime > 0 && currentAudioRef.duration > currentAudioRef.currentTime) {
        setTimeout(() => {
          currentAudioRef.play().catch(console.warn);
        }, 100);
      }
    };

    currentAudioRef.addEventListener('ended', onEnded);
    currentAudioRef.addEventListener('pause', onPause);

    return () => {
      if (currentAudioRef) {
        currentAudioRef.pause();
        currentAudioRef.removeEventListener('ended', onEnded);
        currentAudioRef.removeEventListener('pause', onPause);
      }
    };
  }, [isSpeaking]);

  useEffect(() => {
    const messageToSpeak = assistantMessage?.message;
    if (!activeLanguage || !messageToSpeak) return;

    setDisplayedMessage(messageToSpeak);

    if (isMuted) return;

    const speakWithPolly = async (text: string) => {
      try {
        if (isSpeakingRef.current) {
          console.log('Voice Assistant - Already speaking, skipping');
          return;
        }
        setIsSpeakingState(true);

        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text,
            language: activeLanguage,
          }),
        });

        if (!response.ok) {
          throw new Error('TTS request failed');
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        if (audioRef.current) {
          audioRef.current.src = url;
          audioRef.current.onended = () => {
            console.log("Speech finished");
            setIsSpeakingState(false);
            URL.revokeObjectURL(url);
          };
          audioRef.current.onerror = (e) => {
            console.error("Speech error", e);
            setIsSpeakingState(false);
            URL.revokeObjectURL(url);
          };
          await audioRef.current.play();
        } else {
          const audio = new Audio(url);
          audio.onended = () => {
            console.log("Speech finished");
            setIsSpeakingState(false);
            URL.revokeObjectURL(url);
          };
          audio.onerror = (e) => {
            console.error("Speech error", e);
            setIsSpeakingState(false);
            URL.revokeObjectURL(url);
          };
          await audio.play();
        }
      } catch (err) {
        console.error('Text-to-Speech Error:', err);
        setIsSpeakingState(false);
      }
    };

    if (hasInteracted || !isMuted) {
      speakWithPolly(messageToSpeak);
    }
  }, [assistantMessage, activeLanguage, isMuted, hasInteracted]);

  if (isMobile === undefined || !activeLanguage) return null;

  const handleMuteToggle = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (nextMuted) {
      // Stop audio element if playing
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsSpeakingState(false);
    }
  }

  return (
    <div
      key={animationKey}
      className={cn(
        'fixed bottom-4 right-4 z-50 w-[calc(100%-2rem)] max-w-sm rounded-lg border bg-card/80 p-4 shadow-2xl backdrop-blur-sm animate-in fade-in-50 slide-in-from-bottom-5',
        'md:right-8 md:bottom-28'
      )}
    >
      <div className="flex items-start gap-3">
        <button onClick={handleMuteToggle} className="relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary transition-colors hover:bg-primary/80">
          {isMuted ? (
            <VolumeX className="h-5 w-5 text-primary-foreground" />
          ) : (
            <>
              <Volume2 className="h-5 w-5 text-primary-foreground" />
              {isSpeaking && <div className="absolute inset-0 animate-ping rounded-full bg-primary/70"></div>}
            </>
          )}
        </button>
        <div className="min-h-[3rem] pt-1 text-card-foreground">
          <p>{displayedMessage || (assistantTranslations[activeLanguage!] || assistantTranslations.en).noMessage}</p>
        </div>
      </div>
    </div>
  );
}
