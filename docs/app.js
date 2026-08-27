/*
  DESAFIO AUTH
  ------------
  O gabarito fica SOMENTE neste arquivo.

  IMPORTANTE:
  Os ranges abaixo foram configurados com base nos trechos didáticos dos materiais
  da aula. Como números de linha mudam quando o código do repositório é formatado,
  você pode ajustar minLine/maxLine para refletir exatamente o projeto da turma.

  A validação aceita um intervalo informado pelo aluno quando ele "toca" o range correto.
  Ex.: gabarito 42-49 e aluno informa 44-47 => correto.
*/

const CARDS = [
  {
    id: "login-http",
    text: "Usuário envia email + senha para POST /auth/login",
    order: 1,
    file: "auth.http",
    minLine: 1,
    maxLine: 8
  },
  {
    id: "auth-controller-login",
    text: "AuthController recebe a requisição de login",
    order: 2,
    file: "src/auth/auth.controller.ts",
    minLine: 7,
    maxLine: 11
  },
  {
    id: "auth-service-login",
    text: "AuthService.login() inicia a autenticação",
    order: 3,
    file: "src/auth/auth.service.ts",
    minLine: 12,
    maxLine: 21
  },
  {
    id: "find-user",
    text: "UsersService.findByEmail() busca o usuário pelo email",
    order: 4,
    file: "src/users/users.service.ts",
    minLine: 1,
    maxLine: 4
  },
  {
    id: "bcrypt-compare",
    text: "bcrypt.compare() compara a senha digitada com o hash do banco",
    order: 5,
    file: "src/auth/auth.service.ts",
    minLine: 23,
    maxLine: 31
  },
  {
    id: "jwt-sign",
    text: "JwtService.signAsync() gera o access_token",
    order: 6,
    file: "src/auth/auth.service.ts",
    minLine: 16,
    maxLine: 20
  },
  {
    id: "bearer-request",
    text: "Cliente envia Authorization: Bearer TOKEN em uma rota protegida",
    order: 7,
    file: "auth.http",
    minLine: 17,
    maxLine: 19
  },
  {
    id: "guard",
    text: "JwtAuthGuard intercepta a requisição antes do Controller",
    order: 8,
    file: "src/auth/jwt-auth.guard.ts",
    minLine: 7,
    maxLine: 29
  },
  {
    id: "extract-token",
    text: "Guard lê o header Authorization e extrai o token Bearer",
    order: 9,
    file: "src/auth/jwt-auth.guard.ts",
    minLine: 17,
    maxLine: 23
  },
  {
    id: "jwt-verify",
    text: "jwt.verify() valida assinatura e expiração do token",
    order: 10,
    file: "src/auth/jwt-auth.guard.ts",
    minLine: 24,
    maxLine: 28
  },
  {
    id: "protected-controller",
    text: "Com token válido, a requisição segue para o Controller da rota protegida",
    order: 11,
    file: "src/users/users.controller.ts",
    minLine: 1,
    maxLine: 9999
  }
];

const state = {
  studentName: "",
  studentId: "",
  attempts: 0
};

const startScreen = document.querySelector("#start-screen");
const gameScreen = document.querySelector("#game-screen");
const nameInput = document.querySelector("#student-name");
const idInput = document.querySelector("#student-id");
const startButton = document.querySelector("#start-button");
const startError = document.querySelector("#start-error");
const greeting = document.querySelector("#student-greeting");
const attemptCount = document.querySelector("#attempt-count");

const cardBank = document.querySelector("#card-bank");
const flowZone = document.querySelector("#flow-zone");
const emptyFlow = document.querySelector("#empty-flow");
const bankCount = document.querySelector("#bank-count");
const flowCount = document.querySelector("#flow-count");

const resetButton = document.querySelector("#reset-button");
const validateButton = document.querySelector("#validate-button");
const result = document.querySelector("#result");

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function normalizeFile(value) {
  return String(value || "")
    .trim()
    .replaceAll("\\", "/")
    .replace(/^\.?\//, "")
    .toLowerCase();
}

function parseRange(value) {
  const cleaned = String(value || "").trim().replace(/\s+/g, "");
  if (!cleaned) return null;

  const match = cleaned.match(/^(\d+)(?:-(\d+))?$/);
  if (!match) return null;

  const a = Number(match[1]);
  const b = match[2] ? Number(match[2]) : a;

  return {
    start: Math.min(a, b),
    end: Math.max(a, b)
  };
}

function rangeTouchesExpected(userRange, expectedMin, expectedMax) {
  if (!userRange) return false;
  return userRange.end >= expectedMin && userRange.start <= expectedMax;
}

function createCard(cardData) {
  const card = document.createElement("article");
  card.className = "auth-card";
  card.draggable = true;
  card.dataset.id = cardData.id;

  card.innerHTML = `
    <div class="card-main">
      <div class="drag-handle" title="Arraste para ordenar">⋮⋮</div>
      <div class="card-text">${cardData.text}</div>
      <div class="card-order hidden" aria-hidden="true"></div>
    </div>

    <div class="card-meta">
      <div class="meta-field">
        <label>Arquivo</label>
        <input
          class="file-answer"
          type="text"
          placeholder="Ex.: src/auth/auth.service.ts"
          spellcheck="false"
          autocomplete="off"
        />
      </div>

      <div class="meta-field">
        <label>Linha(s)</label>
        <input
          class="line-answer"
          type="text"
          placeholder="Ex.: 42-49"
          inputmode="numeric"
          spellcheck="false"
          autocomplete="off"
        />
      </div>
    </div>
  `;

  card.addEventListener("dragstart", handleDragStart);
  card.addEventListener("dragend", handleDragEnd);

  return card;
}

function renderInitialCards() {
  cardBank.innerHTML = "";
  flowZone.innerHTML = "";
  flowZone.appendChild(emptyFlow);

  shuffle(CARDS).forEach(cardData => {
    cardBank.appendChild(createCard(cardData));
  });

  state.attempts = 0;
  attemptCount.textContent = "0";
  hideResult();
  updateCountersAndPositions();
}

function updateCountersAndPositions() {
  const bankCards = [...cardBank.querySelectorAll(".auth-card")];
  const flowCards = [...flowZone.querySelectorAll(".auth-card")];

  bankCount.textContent = `${bankCards.length} restantes`;
  flowCount.textContent = `${flowCards.length}/${CARDS.length}`;

  emptyFlow.classList.toggle("hidden", flowCards.length > 0);

  flowCards.forEach((card, index) => {
    const badge = card.querySelector(".card-order");
    badge.textContent = index + 1;
    badge.classList.remove("hidden");
  });

  bankCards.forEach(card => {
    const badge = card.querySelector(".card-order");
    badge.textContent = "";
    badge.classList.add("hidden");
  });
}

let draggedCard = null;

function handleDragStart(event) {
  draggedCard = event.currentTarget;
  draggedCard.classList.add("dragging");
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", draggedCard.dataset.id);
}

function handleDragEnd() {
  if (draggedCard) {
    draggedCard.classList.remove("dragging");
  }

  document.querySelectorAll(".drop-zone").forEach(zone => {
    zone.classList.remove("drag-over");
  });

  draggedCard = null;
  updateCountersAndPositions();
}

function getCardAfterPointer(container, y) {
  const cards = [...container.querySelectorAll(".auth-card:not(.dragging)")];

  return cards.reduce(
    (closest, card) => {
      const box = card.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;

      if (offset < 0 && offset > closest.offset) {
        return { offset, element: card };
      }

      return closest;
    },
    { offset: Number.NEGATIVE_INFINITY, element: null }
  ).element;
}

function setupDropZone(zone) {
  zone.addEventListener("dragover", event => {
    event.preventDefault();
    zone.classList.add("drag-over");

    if (!draggedCard) return;

    if (zone === flowZone) {
      const after = getCardAfterPointer(flowZone, event.clientY);
      if (after) {
        flowZone.insertBefore(draggedCard, after);
      } else {
        flowZone.appendChild(draggedCard);
      }
    } else {
      cardBank.appendChild(draggedCard);
    }
	flowZone.scrollTop = flowZone.scrollHeight;
    updateCountersAndPositions();
  });

  zone.addEventListener("dragleave", event => {
    if (!zone.contains(event.relatedTarget)) {
      zone.classList.remove("drag-over");
    }
  });

  zone.addEventListener("drop", event => {
    event.preventDefault();
    zone.classList.remove("drag-over");
    updateCountersAndPositions();
  });
}

function validateStudent() {
  const name = nameInput.value.trim();
  const studentId = idInput.value.trim();

  if (!name || !studentId) {
    startError.textContent = "Preencha nome e matrícula para iniciar.";
    return false;
  }

  state.studentName = name;
  state.studentId = studentId;
  startError.textContent = "";
  return true;
}

function startGame() {
  if (!validateStudent()) return;

  greeting.textContent = `Olá, ${state.studentName} — ${state.studentId}`;
  startScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  renderInitialCards();
}

function validateGame() {
  state.attempts += 1;
  attemptCount.textContent = String(state.attempts);

  const flowCards = [...flowZone.querySelectorAll(".auth-card")];

  if (flowCards.length !== CARDS.length) {
    showResult(false);
    return;
  }

  const orderedCorrectly = flowCards.every((card, index) => {
    const expected = CARDS.find(item => item.id === card.dataset.id);
    return expected.order === index + 1;
  });

  /* const metadataCorrect = flowCards.every(card => {
    const expected = CARDS.find(item => item.id === card.dataset.id);
    const fileValue = card.querySelector(".file-answer").value;
    const lineValue = card.querySelector(".line-answer").value;

    const fileCorrect = normalizeFile(fileValue) === normalizeFile(expected.file);
    const rangeCorrect = rangeTouchesExpected(
      parseRange(lineValue),
      expected.minLine,
      expected.maxLine
    );

    return fileCorrect && rangeCorrect;
    
  }); */

  showResult(orderedCorrectly && metadataCorrect);
}

function showResult(isCorrect) {
  result.classList.remove("hidden", "correct", "wrong");

  if (isCorrect) {
    result.classList.add("correct");
    result.textContent = "✅ Correto";
  } else {
    result.classList.add("wrong");
    result.textContent = "❌ Incorreto";
  }
}

function hideResult() {
  result.classList.add("hidden");
  result.classList.remove("correct", "wrong");
  result.textContent = "";
}

startButton.addEventListener("click", startGame);
validateButton.addEventListener("click", validateGame);
resetButton.addEventListener("click", renderInitialCards);

[nameInput, idInput].forEach(input => {
  input.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      startGame();
    }
  });
});

setupDropZone(cardBank);
setupDropZone(flowZone);
