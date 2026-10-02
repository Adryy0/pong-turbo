# 🏓 Pong Turbo

Evolução do Pong que fiz no curso de lógica de programação da Alura.
Agora com **modo 1 ou 2 jogadores, três níveis de dificuldade, placar, pausa e controle por toque**.
Feito com **HTML5 Canvas e JavaScript puro**.

🔗 **Demo:** _(coloque aqui o link do GitHub Pages)_

## 💡 Por que fiz este projeto

Quis mostrar que sei **evoluir um projeto**, e não só terminar um tutorial:
partir de uma base simples e transformá-la em um jogo completo.

## ✨ Funcionalidades

- Modo **1 jogador** (contra o computador) e **2 jogadores**
- Dificuldade **Fácil / Normal / Difícil** (muda a velocidade da bola e a reação da CPU)
- A bola **acelera** a cada rebatida
- O ângulo da bola depende do ponto da raquete onde ela bate
- Placar e vitória com 7 pontos
- **Pausa** com `P` ou `Espaço`
- Controle por **toque** no celular
- Menu inicial e reinício de partida

## 🎮 Controles

| Ação | Tecla |
|------|-------|
| Jogador 1 | `W` / `S` (ou arrastar o dedo na tela) |
| Jogador 2 | `↑` / `↓` |
| Pausar | `P` ou `Espaço` |
| Voltar ao menu (fim de jogo) | `Enter` |

## 🛠️ Tecnologias

- HTML5 Canvas
- CSS3
- JavaScript (loop de jogo com `requestAnimationFrame`, detecção de colisão, máquina de estados)

## ▶️ Como rodar

1. Baixe ou clone o repositório
2. Abra o `index.html` no navegador

## 🧠 O que aprendi

- Estrutura de um loop de jogo (atualizar → desenhar)
- Detecção de colisão entre bola e raquete
- Estados do jogo (`menu`, `jogando`, `pausado`, `fim`)
- Lógica simples de IA com velocidade limitada
- Eventos de teclado e de toque

## 🚀 Próximos passos

- [ ] Efeitos sonoros
- [ ] Power-ups (bola rápida, raquete maior)
- [ ] Ranking de vitórias salvo no LocalStorage
