const soundtrack = new Audio(
  new URL("./assets/music/theme.mp3", import.meta.url).href,
);
soundtrack.loop = true;
soundtrack.preload = "auto";
soundtrack.volume = 0.35;

let muted = false;
let soundtrackStarted = false;
let context;
let effectsBus;

function getContext() {
  if (!context) {
    context = new AudioContext();
    effectsBus = context.createGain();
    effectsBus.gain.value = muted ? 0 : 0.72;
    effectsBus.connect(context.destination);
  }
  return context;
}

function playNote(
  audioContext,
  frequency,
  delay,
  duration,
  volume,
  type = "sine",
) {
  const start = audioContext.currentTime + delay;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.018);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(gain);
  gain.connect(effectsBus);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
}

function playWhoosh(
  audioContext,
  duration,
  volume,
  fromFrequency,
  toFrequency,
) {
  const length = Math.floor(audioContext.sampleRate * duration);
  const buffer = audioContext.createBuffer(1, length, audioContext.sampleRate);
  const samples = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    const fade = Math.sin((i / length) * Math.PI);
    samples[i] = (Math.random() * 2 - 1) * fade;
  }

  const source = audioContext.createBufferSource();
  const filter = audioContext.createBiquadFilter();
  const gain = audioContext.createGain();
  const start = audioContext.currentTime;
  source.buffer = buffer;
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(fromFrequency, start);
  filter.frequency.exponentialRampToValueAtTime(toFrequency, start + duration);
  gain.gain.setValueAtTime(volume, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  source.connect(filter);
  filter.connect(gain);
  gain.connect(effectsBus);
  source.start(start);
}

export async function startBackgroundMusic() {
  soundtrackStarted = true;
  if (muted) return;

  try {
    await soundtrack.play();
  } catch (error) {
    soundtrackStarted = false;
    throw error;
  }
}

export async function toggleAudio() {
  muted = !muted;
  soundtrack.muted = muted;
  if (effectsBus) {
    effectsBus.gain.setTargetAtTime(
      muted ? 0 : 0.72,
      context.currentTime,
      0.025,
    );
  }

  if (muted) {
    soundtrack.pause();
  } else if (soundtrackStarted) {
    try {
      await soundtrack.play();
    } catch (error) {
      muted = true;
      soundtrack.muted = true;
      throw error;
    }
  }

  return muted;
}

export function isAudioMuted() {
  return muted;
}

export async function playSoundEffect(name, variation = 0) {
  if (muted) return;

  const audioContext = getContext();
  if (audioContext.state === "suspended") await audioContext.resume();

  switch (name) {
    case "start":
      [392, 523.25, 659.25, 783.99].forEach((frequency, index) =>
        playNote(audioContext, frequency, index * 0.075, 0.36, 0.075),
      );
      break;
    case "collect": {
      const pitch = 1 + Math.min(variation, 20) * 0.012;
      [659.25, 880, 1174.66].forEach((frequency, index) =>
        playNote(
          audioContext,
          frequency * pitch,
          index * 0.055,
          0.28,
          0.1,
          index === 1 ? "triangle" : "sine",
        ),
      );
      break;
    }
    case "reveal":
      [523.25, 659.25, 783.99, 1046.5].forEach((frequency, index) =>
        playNote(audioContext, frequency, index * 0.09, 0.5, 0.075),
      );
      playNote(audioContext, 1567.98, 0.3, 0.36, 0.035);
      break;
    case "jump":
      playWhoosh(audioContext, 0.28, 0.14, 1500, 220);
      playNote(audioContext, 220, 0, 0.22, 0.045, "triangle");
      break;
    case "wardrobe":
      [440, 554.37, 659.25].forEach((frequency, index) =>
        playNote(audioContext, frequency, index * 0.045, 0.24, 0.06),
      );
      break;
    case "step":
      playNote(audioContext, 92, 0, 0.055, 0.025, "triangle");
      break;
    case "firework":
      playWhoosh(audioContext, 0.55, 0.2, 1800, 180);
      playNote(audioContext, 110, 0, 0.32, 0.07, "triangle");
      break;
    case "victory":
      [523.25, 659.25, 783.99, 1046.5, 1318.51].forEach((frequency, index) =>
        playNote(audioContext, frequency, index * 0.085, 0.52, 0.08),
      );
      break;
    default:
      throw new Error(`Unknown sound effect: ${name}`);
  }
}
