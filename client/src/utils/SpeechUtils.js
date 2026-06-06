export const speakText = (text, onEnd) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }
    
    utterance.rate = 1.0; 
    utterance.pitch = 1.0; 
    
    const voices = window.speechSynthesis.getVoices();
    
    // Array of preferred voices (often sound more natural)
    const preferredVoiceNames = [
      "Google US English",
      "Microsoft Aria Online (Natural) - English (United States)",
      "Microsoft Jenny Online (Natural) - English (United States)",
      "Google UK English Female",
      "Samantha",
      "Victoria"
    ];

    let selectedVoice = null;
    for (const name of preferredVoiceNames) {
      selectedVoice = voices.find(voice => voice.name.includes(name));
      if (selectedVoice) break;
    }

    // Fallback to the first available English voice
    if (!selectedVoice) {
      selectedVoice = voices.find(voice => voice.lang.includes('en'));
    }

    if (selectedVoice) utterance.voice = selectedVoice;

    window.speechSynthesis.speak(utterance);
  } else {
    alert("Your browser does not support text-to-speech.");
    if (onEnd) onEnd();
  }
};

export const stopSpeech = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};
