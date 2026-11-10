// TROQUE pela data real em que vocês começaram a namorar.
// Formato: AAAA-MM-DDTHH:MM:SS
const dataInicio = new Date("2026-04-05T00:00:00");

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(screen => screen.classList.remove("active"));
  const target = document.getElementById(id);
  if (target) {
    target.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function updateCounter() {
  const now = new Date();
  let diff = Math.max(0, now - dataInicio);
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  document.getElementById("days").textContent = days;
  document.getElementById("hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
  document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}
updateCounter();
setInterval(updateCounter, 1000);

const surpriseMessages = [
  "Se eu pudesse escolher um lugar para estar agora, seria ao seu lado. ♡",
  "Você faz os dias comuns virarem lembranças especiais. 💗",
  "Ainda temos tantas histórias bonitas para viver.",
  "Meu sorriso tem muito a ver com você. 🌷",
  "Obrigado por ser parte tão bonita da minha vida. ❤️",
  "Gosto de nós. Do nosso jeitinho, das nossas risadas e das nossas memórias."
];
let lastMessage = -1;
function showSurprise() {
  let index;
  do { index = Math.floor(Math.random() * surpriseMessages.length); }
  while (index === lastMessage && surpriseMessages.length > 1);
  lastMessage = index;
  const el = document.getElementById("surpriseText");
  el.style.opacity = "0";
  setTimeout(() => {
    el.textContent = surpriseMessages[index];
    el.style.opacity = "1";
  }, 180);
}

function makeHeart() {
  const layer = document.getElementById("hearts");
  if (!layer) return;
  const heart = document.createElement("span");
  heart.className = "heart";
  heart.textContent = ["♡", "♥", "✧"][Math.floor(Math.random() * 3)];
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.fontSize = (14 + Math.random() * 18) + "px";
  heart.style.animationDuration = (7 + Math.random() * 5) + "s";
  layer.appendChild(heart);
  setTimeout(() => heart.remove(), 12000);
}
setInterval(makeHeart, 850);


// ===== FOTOS E VÍDEOS "VIRADOS" =====
// Tudo começa coberto. Ao tocar, vira e revela. Na foto, um segundo toque amplia.
(function () {
  const reduz = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function criaCobertura(texto) {
    const cover = document.createElement("div");
    cover.className = "cover";
    const heart = document.createElement("span"); heart.className = "cover-heart"; heart.textContent = "♡";
    const t = document.createElement("small"); t.textContent = texto;
    cover.append(heart, t);
    return cover;
  }

  // vira a cobertura (some) e depois mostra o conteúdo girando de volta
  function revelar(cover, conteudo, depois) {
    if (reduz || !cover.animate) { cover.remove(); if (depois) depois(); return; }
    const sai = cover.animate(
      [{ transform: "perspective(900px) rotateY(0deg)" }, { transform: "perspective(900px) rotateY(90deg)" }],
      { duration: 260, easing: "ease-in", fill: "forwards" });
    sai.onfinish = () => {
      cover.remove();
      conteudo.animate(
        [{ transform: "perspective(900px) rotateY(-90deg)" }, { transform: "perspective(900px) rotateY(0deg)" }],
        { duration: 320, easing: "ease-out" });
      if (depois) depois();
    };
  }

  // ----- Fotos -----
  const lb = document.getElementById("lightbox");
  const img = lb ? lb.querySelector("img") : null, cap = lb ? lb.querySelector("p") : null;
  const fechar = () => { lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true"); };

  document.querySelectorAll(".photo-card").forEach(card => {
    const face = document.createElement("div");
    face.className = "card-face";
    while (card.firstChild) face.appendChild(card.firstChild);
    card.appendChild(face);
    const cover = criaCobertura("toque para revelar");
    card.appendChild(cover);
    let aberta = false;
    card.addEventListener("click", () => {
      if (!aberta) {
        aberta = true;
        card.classList.add("revealed");
        revelar(cover, face);
        return;
      }
      if (!lb) return;
      const src = card.querySelector("img");
      img.src = src.src; img.alt = src.alt;
      cap.textContent = card.querySelector("figcaption").textContent;
      lb.classList.add("open"); lb.setAttribute("aria-hidden", "false");
    });
  });

  if (lb) {
    lb.addEventListener("click", fechar);
    document.addEventListener("keydown", e => { if (e.key === "Escape") fechar(); });
  }

  // ----- Vídeos -----
  document.querySelectorAll(".video-grid video").forEach(video => {
    const wrap = document.createElement("div");
    wrap.className = "video-wrap" + (video.classList.contains("wide") ? " wide" : "");
    video.parentNode.insertBefore(wrap, video);
    wrap.appendChild(video);
    const cover = criaCobertura("toque para ver o vídeo");
    wrap.appendChild(cover);
    cover.addEventListener("click", () => {
      revelar(cover, video, () => { video.play().catch(() => {}); });
    });
  });
})();

// ===== CUPONS =====
// Seu WhatsApp com DDI+DDD+número, só números (ex.: "5511999999999").
// Se preencher, ao resgatar um cupom abre uma mensagem pronta para você. Se deixar vazio, só marca como resgatado.
const whatsappNumero = "5511976591407";

// Edite, apague ou crie cupons à vontade: { icone, titulo, texto }
const cupons = [
  { icone: "🍝", titulo: "Jantar a dois", texto: "Um jantar especial, do jeitinho que você escolher." },
  { icone: "🎬", titulo: "Dia de filme", texto: "Filme, pipoca e você escolhe o que assistir." },
  { icone: "💆", titulo: "Massagem relaxante", texto: "Uma massagem caprichada para desestressar." },
  { icone: "🥞", titulo: "Café da manhã especial", texto: "Café da manhã preparado com muito carinho." },
  { icone: "🤗", titulo: "Abraço de 10 minutos", texto: "Sem pressa, sem celular, só abraço." },
  { icone: "🎶", titulo: "Você escolhe a música", texto: "Hoje a trilha sonora é toda sua." },
  { icone: "🌅", titulo: "Passeio surpresa", texto: "Um passeio planejado só para nós dois." },
  { icone: "👑", titulo: "Dia da rainha", texto: "Um dia em que o seu desejo é uma ordem." },
  { icone: "🥐", titulo: "Padaria 😈", texto: "Uma ida à padaria para você escolher o que quiser." }
];

(function () {
  const grid = document.getElementById("couponGrid");
  if (!grid) return;
  const KEY = "cuponsResgatados";
  let usados = [];
  try { usados = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) {}
  const salvar = () => { try { localStorage.setItem(KEY, JSON.stringify(usados)); } catch (e) {} };

  function atualizaContagem() {
    const el = document.getElementById("couponCount");
    const sobram = cupons.length - usados.length;
    el.textContent = sobram === 0 ? "Você resgatou todos os cupons. Que tal ganhar mais? ♡" : sobram + " de " + cupons.length + " cupons disponíveis";
  }

  function render() {
    grid.innerHTML = "";
    cupons.forEach((c, i) => {
      const usado = usados.includes(i);
      const card = document.createElement("div");
      card.className = "coupon" + (usado ? " used" : "");
      const icone = document.createElement("div"); icone.className = "coupon-icon"; icone.textContent = c.icone;
      const body = document.createElement("div"); body.className = "coupon-body";
      const t = document.createElement("h3"); t.textContent = c.titulo;
      const p = document.createElement("p"); p.textContent = c.texto;
      const b = document.createElement("button"); b.className = "coupon-btn";
      b.textContent = usado ? "Resgatado ✓" : "Resgatar"; b.disabled = usado;
      b.addEventListener("click", () => {
        if (!confirm("Resgatar o cupom '" + c.titulo + "'? Ele só vale uma vez.")) return;
        usados.push(i); salvar(); render();
        mostrarAviso(c);
      });
      body.append(t, p, b);
      card.append(icone, body);
      grid.appendChild(card);
    });
    atualizaContagem();
  }
  // Janelinha de confirmação com botão para avisar no WhatsApp (um toque direto, que o navegador não bloqueia)
  function mostrarAviso(c) {
    const box = document.createElement("div");
    box.className = "coupon-modal";
    const card = document.createElement("div"); card.className = "coupon-modal-card";
    const h = document.createElement("h3"); h.textContent = "Cupom resgatado! 🎉";
    const p = document.createElement("p"); p.textContent = c.titulo;
    card.append(h, p);
    if (whatsappNumero) {
      const msg = "Resgatei o cupom: " + c.titulo + " 💌";
      const a = document.createElement("a");
      a.className = "primary-btn"; a.target = "_blank"; a.rel = "noopener";
      a.href = "https://wa.me/" + whatsappNumero + "?text=" + encodeURIComponent(msg);
      a.textContent = "Avisar no WhatsApp 💌";
      const hint = document.createElement("small");
      hint.textContent = "Toque e depois em enviar, para eu saber que você resgatou.";
      card.append(a, hint);
    }
    const fechar = document.createElement("button"); fechar.className = "soft-btn"; fechar.textContent = "Fechar";
    fechar.addEventListener("click", () => box.remove());
    card.append(fechar);
    box.append(card);
    box.addEventListener("click", e => { if (e.target === box) box.remove(); });
    document.body.appendChild(box);
  }
  render();
})();
