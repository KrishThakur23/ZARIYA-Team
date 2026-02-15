
'use client';

import { useAssistantContext } from '@/app/artisan/_components/assistant-provider';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import { Volume2, VolumeX } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

export default function VoiceAssistant() {
  const { assistantMessage } = useAssistantContext();
  const [displayedMessage, setDisplayedMessage] = useState('');
  const [animationKey, setAnimationKey] = useState(0);
  const isMobile = useIsMobile();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

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
    
    const onEnded = () => setIsSpeaking(false);
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

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    const messageToSpeak = assistantMessage.message;
    console.log('Voice Assistant - Message received:', messageToSpeak);
    if (!messageToSpeak) {
      console.log('Voice Assistant - No message to speak');
      return;
    }

    // Abort any previous speech synthesis
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setAnimationKey((prev) => prev + 1);
    setDisplayedMessage('');

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    setIsSpeaking(false);


    let i = 0;
    const typingTimer = setInterval(() => {
      if (signal.aborted) {
        clearInterval(typingTimer);
        return;
      }
      if (i < messageToSpeak.length) {
        setDisplayedMessage((prev) => prev + messageToSpeak.charAt(i));
        i++;
      } else {
        clearInterval(typingTimer);
      }
    }, 30);

    const speak = async () => {
      if (signal.aborted || isMuted) return;
      
      try {
        // Try browser's built-in speech synthesis first (more reliable)
        if ('speechSynthesis' in window) {
          // Cancel any existing speech to prevent overlapping
          speechSynthesis.cancel();
          
          const utterance = new SpeechSynthesisUtterance(messageToSpeak);
          utterance.rate = 0.9;
          utterance.pitch = 1;
          utterance.volume = 1;
          
          utterance.onstart = () => {
            if (!signal.aborted) {
              setIsSpeaking(true);
            }
          };
          utterance.onend = () => {
            if (!signal.aborted) {
              setIsSpeaking(false);
            }
          };
          utterance.onerror = (event) => {
            console.warn('Speech synthesis error:', event.error);
            if (!signal.aborted) {
              setIsSpeaking(false);
            }
          };
          
          // Ensure speech starts even if user hasn't interacted yet
          if (hasInteracted || !isMuted) {
            speechSynthesis.speak(utterance);
          }
          return;
        }

        // Fallback to AI text-to-speech
        const { audio } = await textToSpeech({ text: messageToSpeak });
        if (signal.aborted || !audioRef.current) {
          return;
        }

        audioRef.current.src = audio;

        if (hasInteracted) {
            setIsSpeaking(true);
            
            // Enhanced audio play with retry mechanism
            const playAudio = async (retryCount = 0) => {
              try {
                await audioRef.current.play();
              } catch (e) {
                if ((e as Error).name !== 'AbortError') {
                  console.warn(`Audio play failed (attempt ${retryCount + 1}):`, e);
                  
                  // Retry up to 3 times with increasing delays
                  if (retryCount < 3) {
                    setTimeout(() => {
                      playAudio(retryCount + 1);
                    }, 200 * (retryCount + 1));
                  } else {
                    setIsSpeaking(false);
                  }
                } else {
                  setIsSpeaking(false);
                }
              }
            };
            
            await playAudio();
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Text-to-Speech Error:', error);
        }
        setIsSpeaking(false);
      }
    };

    // Delay speech to allow typing animation to start
    const speechTimeout = setTimeout(speak, 300);

    return () => {
      clearInterval(typingTimer);
      clearTimeout(speechTimeout);
      abortControllerRef.current?.abort();
    };
  }, [assistantMessage, hasInteracted, isMuted]);

  if (isMobile === undefined) return null;
  
  const handleMuteToggle = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (nextMuted) {
        // Stop browser speech synthesis
        speechSynthesis.cancel();
        // Stop audio element if playing
        if (audioRef.current) {
            audioRef.current.pause();
        }
        setIsSpeaking(false);
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
          <p>{displayedMessage || 'No message yet...'}</p>
        </div>
      </div>
    </div>
  );
}
