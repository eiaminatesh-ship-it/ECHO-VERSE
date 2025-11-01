const textInput = document.getElementById('text-input');
const languageSelect = document.getElementById('language');
const voiceSelect = document.getElementById('voice');
const speedInput = document.getElementById('speed');
const speakBtn = document.getElementById('speak');
const downloadBtn = document.getElementById('download');

let synth = window.speechSynthesis;
let voices = [];

function populateVoices() {
  voices = synth.getVoices();
  voiceSelect.innerHTML = '';
  voices.forEach(voice => {
    const option = document.createElement('option');
    option.value = voice.name;
    option.textContent = `${voice.name} (${voice.lang})`;
    voiceSelect.appendChild(option);
  });
}

if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoices;
}

// Translate function using free API
async function translateText(text, targetLang) {
  if(targetLang === "en") return text; // no translation needed
  try {
    const response = await fetch("https://libretranslate.de/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q: text, source: "en", target: targetLang })
    });
    const data = await response.json();
    return data.translatedText;
  } catch (err) {
    console.error("Translation error:", err);
    return text;
  }
}

speakBtn.addEventListener('click', async () => {
  const text = textInput.value.trim();
  if (!text) return alert("Please enter text!");

  const targetLang = languageSelect.value;
  const translatedText = await translateText(text, targetLang);

  const utterance = new SpeechSynthesisUtterance(translatedText);
  const selectedVoice = voices.find(v => v.name === voiceSelect.value);
  utterance.voice = selectedVoice;
  utterance.lang = selectedVoice ? selectedVoice.lang : targetLang;
  utterance.rate = parseFloat(speedInput.value);

  synth.speak(utterance);
});

downloadBtn.addEventListener('click', () => {
  alert("Download requires backend support to save TTS audio.");
});
