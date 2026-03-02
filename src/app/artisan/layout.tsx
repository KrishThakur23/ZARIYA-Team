
import { AssistantProvider } from './_components/assistant-provider';
import VoiceAssistant from './_components/voice-assistant';

export default function ArtisanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AssistantProvider>
      {children}
      <VoiceAssistant />
    </AssistantProvider>
  );
}
