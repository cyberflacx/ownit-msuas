function toggleChatbot() {
  document.getElementById("chatbot-window").classList.toggle("hidden");
}

function sendMessage() {
  const input = document.getElementById("chat-text");
  const chatBody = document.getElementById("chat-body");
  const msg = input.value.trim();
  if (!msg) return;

  const userMsg = `<div class="user-msg">${msg}</div>`;
  chatBody.innerHTML += userMsg;

  let reply = "🤖 I’m still learning. Could you rephrase?";
  const lower = msg.toLowerCase();

  if (lower.includes("stress")) reply = "🧘 Try deep breathing or short breaks. Want a link to relaxation tips?";
  if (lower.includes("study")) reply = "📚 Remember the Pomodoro method — study 25 min, rest 5 min!";
  if (lower.includes("relationship")) reply = "❤️ Healthy relationships are built on respect and consent.";
  if (lower.includes("depressed")) reply = "💬 Please talk to a counsellor. You are not alone — MSUAS Health Office can help.";

  const botMsg = `<div class="bot-msg">${reply}</div>`;
  chatBody.innerHTML += botMsg;
  input.value = "";
  chatBody.scrollTop = chatBody.scrollHeight;
}
