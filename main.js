const morseCodeMap = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....',
  'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.',
  'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.', '.': '.-.-.-', ',': '--..--',
  '?': '..--..', "'": '.----.', '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...',
  ':': '---...', ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.',
  '$': '...-..-', '@': '.--.-.', ' ': '/'
};

let speed = 5;
let currentPlayback = null;
let trainingInterval = null;
let currentCharacter = null;
let characterCount = 0;
let correctCount = 0;
let incorrectCount = 0;

function startTraining() {
  stopTraining();
  trainingInterval = setInterval(showNextCharacter, 2000);
}

function stopTraining() {
  clearInterval(trainingInterval);
  currentCharacter = null;
  characterCount = 0;
  correctCount = 0;
  incorrectCount = 0;
  updateStatistics();
}

function showNextCharacter() {
  const characters = Object.keys(morseCodeMap);
  const randomIndex = Math.floor(Math.random() * characters.length);
  currentCharacter = characters[randomIndex];
  const morseCode = morseCodeMap[currentCharacter];
  document.getElementById('morseCode').innerHTML = `${currentCharacter} - ${morseCode}`;
  playMorseCode(morseCode);
  characterCount++;
  updateStatistics();
}

function playMorseCode(morseCode) {
  stopPlayback();
  const audioFeedbackEnabled = document.getElementById('audioFeedback').checked;
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const dotDuration = 100 / speed; // milliseconds
  const dashDuration = dotDuration * 3;
  const frequency = 800; // Hz
  const oscillator = audioContext.createOscillator();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  oscillator.connect(audioContext.destination);

  for (let morseIndex = 0; morseIndex < morseCode.length; morseIndex++) {
    switch (morseCode[morseIndex]) {
      case '.':
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime + morseIndex * dotDuration / 1000);
        oscillator.start(audioContext.currentTime + morseIndex * dotDuration / 1000);
        oscillator.stop(audioContext.currentTime + (morseIndex + 1) * dotDuration / 1000);
        break;
      case '-':
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime + morseIndex * dashDuration / 1000);
        oscillator.start(audioContext.currentTime + morseIndex * dashDuration / 1000);
        oscillator.stop(audioContext.currentTime + (morseIndex + 1) * dashDuration / 1000);
        break;
      default:
        break;
    }
  }
  currentPlayback = oscillator;

  if (audioFeedbackEnabled) {
    oscillator.onended = () => {
      if (currentPlayback === oscillator) {
        currentPlayback = null;
      }
    };
  }
}

function stopPlayback() {
  if (currentPlayback) {
    currentPlayback.stop();
    currentPlayback = null;
  }
}

function updateSpeed() {
  speed = document.getElementById('speed').value;
}

function updateStatistics() {
  const statsDiv = document.getElementById('stats');
  statsDiv.innerHTML = `
    Total Characters: ${characterCount}<br>
    Correct: ${correctCount}<br>
    Incorrect: ${incorrectCount}
  `;
}

function clearInput() {
  document.getElementById('inputText').value = '';
  document.getElementById('morseCode').innerHTML = '';
  document.getElementById('stats').innerHTML = '';
  stopTraining();
}