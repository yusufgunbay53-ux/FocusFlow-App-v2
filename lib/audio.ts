let ctx: AudioContext | null = null;
let nodes: AudioNode[] = [];

function getCtx() {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

export function stopAmbient() {
  nodes.forEach((n) => {
    try { n.disconnect(); } catch { /* ignore */ }
  });
  nodes = [];
}

export function playRain(volume = 0.25) {
  stopAmbient();
  const c = getCtx();
  const bufferSize = 2 * c.sampleRate;
  const noiseBuffer = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const noise = c.createBufferSource();
  noise.buffer = noiseBuffer;
  noise.loop = true;
  const filter = c.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 900;
  const gain = c.createGain();
  gain.gain.value = volume;
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(c.destination);
  noise.start();
  nodes = [noise, filter, gain];
}

export function playLofi(volume = 0.18) {
  stopAmbient();
  const c = getCtx();
  const master = c.createGain();
  master.gain.value = volume;
  master.connect(c.destination);
  const notes = [196, 247, 294, 330, 392];
  notes.forEach((freq, i) => {
    const osc = c.createOscillator();
    osc.type = i % 2 === 0 ? "triangle" : "sine";
    osc.frequency.value = freq;
    const g = c.createGain();
    g.gain.value = 0.03;
    const filter = c.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 1200;
    osc.connect(filter);
    filter.connect(g);
    g.connect(master);
    osc.start();
    nodes.push(osc, g, filter);
  });
  nodes.push(master);
}

export function playChime() {
  const c = getCtx();
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = "sine";
  o.frequency.setValueAtTime(880, c.currentTime);
  o.frequency.exponentialRampToValueAtTime(440, c.currentTime + 0.6);
  g.gain.setValueAtTime(0.2, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.8);
  o.connect(g);
  g.connect(c.destination);
  o.start();
  o.stop(c.currentTime + 0.85);
}

export function setAmbientVolume(v: number) {
  nodes.forEach((n) => {
    if (n instanceof GainNode) n.gain.value = v;
  });
}
