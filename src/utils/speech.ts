// Indonesian Speech Synthesis Helper for "Baca Nyaring" (id-ID)

class SpeechManager {
  private isSpeakingState: boolean = false;

  public speak(text: string, onEnd?: () => void) {
    if (!('speechSynthesis' in window)) {
      return;
    }

    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      utterance.rate = 0.95; // slightly slower for Grade 4 elementary students
      utterance.pitch = 1.05;

      // Try finding Indonesian voice if available
      const voices = window.speechSynthesis.getVoices();
      const idVoice = voices.find(v => v.lang.startsWith('id') || v.lang.includes('ID'));
      if (idVoice) {
        utterance.voice = idVoice;
      }

      this.isSpeakingState = true;

      utterance.onend = () => {
        this.isSpeakingState = false;
        if (onEnd) onEnd();
      };

      utterance.onerror = () => {
        this.isSpeakingState = false;
        if (onEnd) onEnd();
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      this.isSpeakingState = false;
    }
  }

  public stop() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeakingState = false;
    }
  }

  public isSpeaking(): boolean {
    return 'speechSynthesis' in window && window.speechSynthesis.speaking;
  }
}

export const speech = new SpeechManager();
