// ❤️ Floating emoji hearts
const heartOverlay = document.getElementById("heartOverlay");
const heartEmojis = ["❤️", "💗", "💕", "💞", "💓"];

function spawnHeart() {
  const heart = document.createElement("div");
  heart.className = "heart";
  heart.innerText = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.top = Math.random() * 100 + "vh";
  heart.style.fontSize = Math.random() * 20 + 20 + "px";
  heartOverlay.appendChild(heart);
  setTimeout(() => heart.remove(), 5000);
}

setInterval(spawnHeart, 500);

// 💜 Concentric pulsing hearts visualizer
const audioEl = document.getElementById("audio");
const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

let audioCtx, analyser, source, bufferLength, dataArray;

function setupVisualizer() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  analyser = audioCtx.createAnalyser();
  source = audioCtx.createMediaElementSource(audioEl);

  source.connect(analyser);
  analyser.connect(audioCtx.destination);

  analyser.fftSize = 64;
  bufferLength = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);

  drawPulsingHearts();
}

function drawPulsingHearts() {
  requestAnimationFrame(drawPulsingHearts);
  analyser.getByteFrequencyData(dataArray);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const avg = dataArray.reduce((sum, val) => sum + val, 0) / bufferLength;

  const cx = canvas.width / 2;
  const cy = canvas.height / 2; // perfectly centered
  const baseSize = Math.min(canvas.width, canvas.height) / 3.2;
  const layers = 4;
  const maxPulse = avg * 0.4;

  for (let i = 0; i < layers; i++) {
    const scale = 1 - i * 0.1 + maxPulse / 100;
    drawHeart(cx, cy, baseSize * scale, `rgba(155, 93, 229, ${1 - i * 0.2})`);
  }
}

function drawHeart(x, y, size, color) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.bezierCurveTo(x - size, y - size, x - size, y + size / 1.5, x, y + size);
  ctx.bezierCurveTo(x + size, y + size / 1.5, x + size, y - size, x, y);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.stroke();
}

audioEl.addEventListener("play", () => {
  if (!audioCtx) setupVisualizer();
});