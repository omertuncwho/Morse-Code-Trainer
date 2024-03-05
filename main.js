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

  function convertToMorse() {
    const userInput = document.getElementById('inputText').value.toUpperCase();
    const morseCodeDiv = document.getElementById('morseCode');
    morseCodeDiv.innerHTML = '';
    for (let charIndex = 0; charIndex < userInput.length; charIndex++) {
      const character = userInput[charIndex];
      if (morseCodeMap.hasOwnProperty(character)) {
        const morseCode = morseCodeMap[character];
        morseCodeDiv.innerHTML += `${character} - ${morseCode}<br>`;
        playMorseCode(morseCode);
      } else {
        morseCodeDiv.innerHTML += `${character} - Character not supported<br>`;
      }
    }
  }

  function playMorseCode(morseCode) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const dotDuration = 100; // ms
    const dashDuration = dotDuration * 3;
    const frequency = 800; //hz
    const oscillator = audioContext.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.connect(audioContext.destination);

    for (let morseIndex = 0; morseIndex < morseCode.length; morseIndex++) {
      switch (morseCode[morseIndex]) {
        case '.':
          oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime + morseIndex * (dotDuration / 1000));
          oscillator.start(audioContext.currentTime + morseIndex * (dotDuration / 1000));
          oscillator.stop(audioContext.currentTime + (morseIndex + 1) * (dotDuration / 1000));
          break;
        case '-':
          oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime + morseIndex * (dashDuration / 1000));
          oscillator.start(audioContext.currentTime + morseIndex * (dashDuration / 1000));
          oscillator.stop(audioContext.currentTime + (morseIndex + 1) * (dashDuration / 1000));
          break;
        default:
          break;
      }
    }
  }