
import { AssistantProvider } from './_components/assistant-provider';
import VoiceAssistant from './_components/voice-assistant';

export default function ArtisanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AssistantProvider initialMessage="Welcome to Zariya! I'm your voice assistant. Let's help you create amazing product listings.">
      {children}
      <VoiceAssistant />
    </AssistantProvider>
  );
}
