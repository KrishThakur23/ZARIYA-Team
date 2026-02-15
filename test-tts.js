// Multi-Language TTS Test Script
import { textToSpeech } from './src/ai/flows/text-to-speech';

async function testMultiLanguageTTS() {
    console.log('🧪 Testing Multi-Language TTS Support\\n');

    // Test English
    console.log('📢 Testing English (Algenib voice)...');
    const englishResult = await textToSpeech({
        text: 'Welcome to Zariya, your marketplace for traditional Indian art.',
        language: 'en'
    });
    console.log('✅ English audio generated:', englishResult.audio.substring(0, 50) + '...');

    // Test Hindi
    console.log('\\n📢 Testing Hindi (Puck voice)...');
    const hindiResult = await textToSpeech({
        text: 'ज़रिया में आपका स्वागत है, पारंपरिक भारतीय कला के लिए आपका बाज़ार।',
        language: 'hi'
    });
    console.log('✅ Hindi audio generated:', hindiResult.audio.substring(0, 50) + '...');

    // Test Tamil
    console.log('\\n📢 Testing Tamil (Charon voice)...');
    const tamilResult = await textToSpeech({
        text: 'பாரம்பரிய இந்திய கலைக்கான உங்கள் சந்தையான சாரியாவுக்கு வரவேற்கிறோம்.',
        language: 'ta'
    });
    console.log('✅ Tamil audio generated:', tamilResult.audio.substring(0, 50) + '...');

    console.log('\\n✨ All tests passed! Multi-language TTS is working.');
}

// Run tests
testMultiLanguageTTS().catch(console.error);
