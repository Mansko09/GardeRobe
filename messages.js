const conversations = document.querySelectorAll("#conversations button");
const chatUser = document.getElementById("chatUser");
const messagesList = document.getElementById("messagesList");
const messageForm = document.getElementById("messageForm");
const messageInput = document.getElementById("messageInput");

let currentUser = null;
let messages = {};

conversations.forEach(button => {
  button.addEventListener("click", () => {
    currentUser = button.dataset.user;
    chatUser.textContent = `💬 Conversation avec ${currentUser}`;
    messageForm.style.display = "flex";
    afficherMessages();
  });
});

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = messageInput.value.trim();
  if (!text || !currentUser) return;

  if (!messages[currentUser]) messages[currentUser] = [];
  messages[currentUser].push({ texte: text, moi: true });
  messageInput.value = "";
  afficherMessages();
});

function afficherMessages() {
  messagesList.innerHTML = "";

  if (!messages[currentUser]) return;

  messages[currentUser].forEach(msg => {
    const p = document.createElement("p");
    p.textContent = msg.texte;
    p.style.textAlign = msg.moi ? "right" : "left";
    messagesList.appendChild(p);
  });
}
