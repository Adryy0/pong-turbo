// Pong Turbo - Canvas + requestAnimationFrame
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const LARGURA = canvas.width;
const ALTURA = canvas.height;

const menu = document.getElementById("menu");
const aviso = document.getElementById("aviso");
const placarP1 = document.getElementById("p1");
const placarP2 = document.getElementById("p2");
const rotuloNivel = document.getElementById("nivel");

const PONTOS_PARA_VENCER = 7;
const RAQUETE_L = 12;
const RAQUETE_A = 90;
const BOLA_R = 8;

// velocidade da bola, velocidade da CPU (px/frame) e aceleração a cada rebatida
const NIVEIS = {
  facil: { nome: "Fácil", bola: 5, cpu: 3.2, aceleracao: 1.03 },
  normal: { nome: "Normal", bola: 6, cpu: 4.4, aceleracao: 1.05 },
  dificil: { nome: "Difícil", bola: 7, cpu: 5.8, aceleracao: 1.07 },
};

let modo = "cpu";
let nivel = "normal";
let estado = "menu"; // menu | jogando | pausado | fim
let placar = { p1: 0, p2: 0 };
const teclas = {};

const j1 = { x: 20, y: ALTURA / 2 - RAQUETE_A / 2, vel: 7 };
const j2 = { x: LARGURA - 20 - RAQUETE_L, y: ALTURA / 2 - RAQUETE_A / 2, vel: 7 };
const bola = { x: LARGURA / 2, y: ALTURA / 2, vx: 0, vy: 0 };

function limitar(valor, min, max) {
  return Math.max(min, Math.min(max, valor));
}

function saque(direcao) {
  const velocidade = NIVEIS[nivel].bola;
  const angulo = (Math.random() * 0.8 - 0.4); // entre -0,4 e 0,4 rad
  bola.x = LARGURA / 2;
  bola.y = ALTURA / 2;
  bola.vx = Math.cos(angulo) * velocidade * direcao;
  bola.vy = Math.sin(angulo) * velocidade;
}

function reiniciarPartida() {
  placar = { p1: 0, p2: 0 };
  j1.y = j2.y = ALTURA / 2 - RAQUETE_A / 2;
  atualizarPlacar();
  saque(Math.random() < 0.5 ? 1 : -1);
}

function atualizarPlacar() {
  placarP1.textContent = placar.p1;
  placarP2.textContent = placar.p2;
}

function mostrarAviso(html) {
  aviso.innerHTML = html;
  aviso.hidden = false;
}

function esconderAviso() {
  aviso.hidden = true;
}

// ---------- Entrada ----------
window.addEventListener("keydown", (e) => {
  teclas[e.key.toLowerCase()] = true;
  if (["arrowup", "arrowdown", " "].includes(e.key.toLowerCase())) e.preventDefault();

  if (e.key.toLowerCase() === "p" || e.key === " ") alternarPausa();
  if (e.key === "Enter" && estado === "fim") irParaMenu();
});
window.addEventListener("keyup", (e) => {
  teclas[e.key.toLowerCase()] = false;
});

function posicaoNaQuadra(evento) {
  const caixa = canvas.getBoundingClientRect();
  const toque = evento.touches ? evento.touches[0] : evento;
  return ((toque.clientY - caixa.top) / caixa.height) * ALTURA;
}

function moverComToque(evento) {
  if (estado !== "jogando") return;
  evento.preventDefault();
  j1.y = limitar(posicaoNaQuadra(evento) - RAQUETE_A / 2, 0, ALTURA - RAQUETE_A);
}
canvas.addEventListener("touchstart", moverComToque, { passive: false });
canvas.addEventListener("touchmove", moverComToque, { passive: false });

function alternarPausa() {
  if (estado === "jogando") {
    estado = "pausado";
    mostrarAviso("⏸ Pausado<br><small>Pressione P ou Espaço para continuar</small>");
  } else if (estado === "pausado") {
    estado = "jogando";
    esconderAviso();
  }
}

// ---------- Menu ----------
document.querySelectorAll("[data-nivel]").forEach((botao) => {
  botao.addEventListener("click", () => {
    nivel = botao.dataset.nivel;
    document.querySelectorAll("[data-nivel]").forEach((b) => b.classList.remove("ativo"));
    botao.classList.add("ativo");
  });
});

document.querySelectorAll("[data-modo]").forEach((botao) => {
  botao.addEventListener("click", () => {
    modo = botao.dataset.modo;
    rotuloNivel.textContent = modo === "cpu" ? `Nível: ${NIVEIS[nivel].nome}` : "2 jogadores";
    menu.hidden = true;
    esconderAviso();
    reiniciarPartida();
    estado = "jogando";
  });
});

function irParaMenu() {
  estado = "menu";
  esconderAviso();
  menu.hidden = false;
}

// ---------- Lógica ----------
function moverRaquetes() {
  if (teclas["w"]) j1.y -= j1.vel;
  if (teclas["s"]) j1.y += j1.vel;

  if (modo === "2p") {
    if (teclas["arrowup"]) j2.y -= j2.vel;
    if (teclas["arrowdown"]) j2.y += j2.vel;
  } else {
    // CPU: segue a bola, com velocidade limitada pelo nível
    const alvo = bola.y - RAQUETE_A / 2;
    const dif = alvo - j2.y;
    const passo = NIVEIS[nivel].cpu;
    j2.y += limitar(dif, -passo, passo);
  }
  j1.y = limitar(j1.y, 0, ALTURA - RAQUETE_A);
  j2.y = limitar(j2.y, 0, ALTURA - RAQUETE_A);
}

function rebater(raquete, lado) {
  const centro = raquete.y + RAQUETE_A / 2;
  const impacto = limitar((bola.y - centro) / (RAQUETE_A / 2), -1, 1); // -1 a 1
  const velocidade = Math.hypot(bola.vx, bola.vy) * NIVEIS[nivel].aceleracao;
  const angulo = impacto * (Math.PI / 4); // até 45 graus
  bola.vx = Math.cos(angulo) * velocidade * lado;
  bola.vy = Math.sin(angulo) * velocidade;
}

function marcarPonto(jogador) {
  placar[jogador]++;
  atualizarPlacar();

  if (placar[jogador] >= PONTOS_PARA_VENCER) {
    estado = "fim";
    const quem = jogador === "p1" ? "Jogador 1" : modo === "cpu" ? "Computador" : "Jogador 2";
    mostrarAviso(`🏆 ${quem} venceu!<br><small>Pressione Enter para voltar ao menu</small>`);
    return;
  }
  saque(jogador === "p1" ? -1 : 1);
}

function atualizar() {
  moverRaquetes();

  bola.x += bola.vx;
  bola.y += bola.vy;

  // paredes de cima e de baixo
  if (bola.y - BOLA_R <= 0) { bola.y = BOLA_R; bola.vy = Math.abs(bola.vy); }
  if (bola.y + BOLA_R >= ALTURA) { bola.y = ALTURA - BOLA_R; bola.vy = -Math.abs(bola.vy); }

  // raquete 1
  if (
    bola.vx < 0 &&
    bola.x - BOLA_R <= j1.x + RAQUETE_L &&
    bola.x - BOLA_R >= j1.x &&
    bola.y >= j1.y && bola.y <= j1.y + RAQUETE_A
  ) {
    bola.x = j1.x + RAQUETE_L + BOLA_R;
    rebater(j1, 1);
  }

  // raquete 2
  if (
    bola.vx > 0 &&
    bola.x + BOLA_R >= j2.x &&
    bola.x + BOLA_R <= j2.x + RAQUETE_L &&
    bola.y >= j2.y && bola.y <= j2.y + RAQUETE_A
  ) {
    bola.x = j2.x - BOLA_R;
    rebater(j2, -1);
  }

  // pontos
  if (bola.x < -BOLA_R) marcarPonto("p2");
  else if (bola.x > LARGURA + BOLA_R) marcarPonto("p1");
}

// ---------- Desenho ----------
function desenhar() {
  ctx.clearRect(0, 0, LARGURA, ALTURA);

  // linha central
  ctx.fillStyle = "#1e293b";
  for (let y = 10; y < ALTURA; y += 30) ctx.fillRect(LARGURA / 2 - 2, y, 4, 16);

  // raquetes
  ctx.fillStyle = "#22d3ee";
  ctx.fillRect(j1.x, j1.y, RAQUETE_L, RAQUETE_A);
  ctx.fillStyle = "#f472b6";
  ctx.fillRect(j2.x, j2.y, RAQUETE_L, RAQUETE_A);

  // bola
  ctx.fillStyle = "#f8fafc";
  ctx.beginPath();
  ctx.arc(bola.x, bola.y, BOLA_R, 0, Math.PI * 2);
  ctx.fill();
}

function loop() {
  if (estado === "jogando") atualizar();
  desenhar();
  requestAnimationFrame(loop);
}

desenhar();
loop();
