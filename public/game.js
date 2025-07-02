let love = 50;
const chatBox = document.getElementById("chatBox");
const loveFill = document.getElementById("loveFill");

function sendMessage() {
  const input = document.getElementById("playerInput");
  const message = input.value.trim();
  if (!message) return;

  addMessage("Tú", message);
  input.value = "";

  processResponseFromClaude(message);

  
}

function addMessage(sender, text) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender === "Tú" ? "player" : "npc");
  msg.innerHTML = `<div class="bubble"><strong>${sender}:</strong> ${text}</div>`;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}


function handleKey(e) {
  if (e.key === "Enter") {
    sendMessage();
  }
}

function openActionModal() {
  document.getElementById("actionModal").style.display = "flex";
}

function closeActionModal() {
  document.getElementById("actionModal").style.display = "none";
}

function insertSelectedAction() {
  const select = document.getElementById("actionSelect");
  const input = document.getElementById("playerInput");
  const action = select.value;

  if (action) {
    input.value = action;
    closeActionModal();
  }
}


async function processResponseFromClaude(userMessage) {
  const typingIndicator = document.getElementById("typingIndicator");
  typingIndicator.style.display = "block"; // Mostrar que Ana está escribiendo

  try {
    const response = await fetch("/api/claude", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: userMessage })
    });

    const data = await response.json();
    const json = data;

    addMessage("Ella", json.response);

    if (json.liked) {
      love = Math.min(100, love + 10);
      setCharacterEmotion("love");
    } else {
      love = Math.max(0, love - 10);
      setCharacterEmotion("angry");
    }

    updateLoveBar();

    setTimeout(() => {
      setCharacterEmotion("normal");
    }, 3000);

    if (love >= 100) {
      alert("¡Ganaste la cotorra! 🔥");
    } else if (love <= 0) {
      alert("Te friendzonearon 😅");
    }

  } catch (e) {
    addMessage("Ella", "No entendí muy bien eso...");
  } finally {
    typingIndicator.style.display = "none"; // Ocultar cuando termine
  }
}

function updateLoveBar() {
  const scale = love / 100;
  loveFill.style.transform = `scaleY(${scale})`;
}

function setCharacterEmotion(emotion) {
  const img = document.getElementById("characterImage");
  img.src = `images/${emotion}.png`;
}