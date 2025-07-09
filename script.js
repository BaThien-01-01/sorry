// script.js (nâng cấp: trái tim nổ sáng khi click, thư tình trượt ra)
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const music = document.getElementById("bg-music");
const loveNote = document.getElementById("love-note");

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});

window.addEventListener("click", () => {
  music.play().catch(() => {});
  triggerHeartExplosion();
  showLoveNote();
});

function heartShape(t, scale = 1) {
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
  return { x: x * scale, y: -y * scale };
}

let heartScaleBase = Math.min(width, height) * 0.018;
let pulse = 0;

const heartParticles = [];
const stars = [];
let explosionParticles = [];
let explosionTime = 0;
const centerX = width / 2;
const centerY = height / 2;
const heartCount = 1000;

for (let i = 0; i < heartCount; i++) {
  const t = (Math.PI * 2 * i) / heartCount;
  const pos = heartShape(t, heartScaleBase);
  heartParticles.push({
    x: Math.random() * width,
    y: Math.random() * height,
    tx: centerX + pos.x + (Math.random() - 0.5) * 8,
    ty: centerY + pos.y + (Math.random() - 0.5) * 8,
    baseTx: pos.x,
    baseTy: pos.y,
    size: Math.random() * 2 + 1.5,
    baseHue: Math.random() * 60 + 300,
    hueShift: Math.random() * 20,
    alpha: Math.random(),
    speed: Math.random() * 0.02 + 0.01
  });
}

for (let i = 0; i < 200; i++) {
  stars.push({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 1.2 + 0.3,
    baseAlpha: Math.random() * 0.5 + 0.5,
    phase: Math.random() * Math.PI * 2
  });
}

const messages = [
  "Em là vũ trụ của anh",
  "Mãi yêu em",
  "Yêu em đến tận cùng không gian",
  "Trái tim này chỉ dành cho em",
  "Chỉ cần em ở đây là đủ",
  "Tình yêu vượt mọi vũ trụ"
];

const pastelColors = [
  "hsl(340, 100%, 80%)",
  "hsl(200, 100%, 80%)",
  "hsl(100, 100%, 80%)",
  "hsl(45, 100%, 80%)",
  "hsl(280, 100%, 85%)"
];

const fallingTexts = [];

function createFallingText() {
  if (fallingTexts.length > 10) return;
  const text = messages[Math.floor(Math.random() * messages.length)];
  const fontSize = Math.random() * 6 + 14;
  const x = Math.random() * (width - 200);
  const color = pastelColors[Math.floor(Math.random() * pastelColors.length)];
  fallingTexts.push({
    text,
    x,
    y: -20,
    speed: Math.random() * 1.2 + 0.8,
    alpha: 1,
    fontSize,
    color
  });
}

setInterval(createFallingText, 1200);

function triggerHeartExplosion() {
  explosionParticles = [];
  for (let i = 0; i < 100; i++) {
    explosionParticles.push({
      x: centerX,
      y: centerY,
      vx: Math.cos(i) * (Math.random() * 4 + 2),
      vy: Math.sin(i) * (Math.random() * 4 + 2),
      alpha: 1,
      radius: Math.random() * 3 + 2,
      hue: Math.random() * 60 + 300
    });
  }
  explosionTime = 60;
}

function showLoveNote() {
  if (loveNote) {
    loveNote.classList.add("show");
    setTimeout(() => loveNote.classList.remove("show"), 5000);
  }
}

function animate() {
  ctx.clearRect(0, 0, width, height);

  for (const s of stars) {
    s.phase += 0.02;
    const alpha = s.baseAlpha + Math.sin(s.phase) * 0.3;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.fill();
  }

  pulse += 0.05;
  const scaleOffset = Math.sin(pulse) * 0.15 + 1;

  for (const p of heartParticles) {
    const targetX = centerX + p.baseTx * scaleOffset;
    const targetY = centerY + p.baseTy * scaleOffset;
    const dx = targetX - p.x;
    const dy = targetY - p.y;
    p.x += dx * p.speed;
    p.y += dy * p.speed;

    const dynamicHue = p.baseHue + Math.sin(pulse) * p.hueShift;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `hsl(${dynamicHue}, 100%, 70%)`;
    ctx.globalAlpha = p.alpha;
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  if (explosionTime > 0) {
    for (const e of explosionParticles) {
      e.x += e.vx;
      e.y += e.vy;
      e.alpha -= 0.02;

      ctx.beginPath();
      ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${e.hue}, 100%, 70%, ${e.alpha})`;
      ctx.fill();
    }
    explosionTime--;
  }

  for (let i = fallingTexts.length - 1; i >= 0; i--) {
    const t = fallingTexts[i];
    t.y += t.speed;
    t.alpha -= 0.003;

    ctx.font = `bold ${t.fontSize}px Pacifico`;
    ctx.fillStyle = t.color;
    ctx.shadowBlur = 8;
    ctx.shadowColor = t.color;
    ctx.globalAlpha = t.alpha;
    ctx.fillText(t.text, t.x, t.y);
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;

    if (t.alpha <= 0 || t.y > height + 50) {
      fallingTexts.splice(i, 1);
    }
  }

  requestAnimationFrame(animate);
}

animate();