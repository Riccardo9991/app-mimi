let selectedTopic = 0;

const topics = document.querySelectorAll(".topic");
const rouletteButton = document.querySelector(".roulette-button");

// Gestione della selezione del topic
topics.forEach(topic => {
  topic.addEventListener("click", () => {
    // Deseleziona tutti i topic
    topics.forEach(t => t.classList.remove("selected"));
    // Seleziona quello cliccato
    topic.classList.add("selected");
    // Salva il topic selezionato nel localStorage
    selectedTopic = topic.getAttribute("data-topic");
    localStorage.setItem("selectedTopic", selectedTopic);
  });
});

function startGame() {
  // Verifica se un topic è stato selezionato
  if (selectedTopic === null) {
    // Se non è stato selezionato alcun topic, prova a recuperarlo dal localStorage
    selectedTopic = localStorage.getItem("selectedTopic");
  }

  if (selectedTopic === null) {
    alert("Per favore, seleziona un argomento prima di iniziare!");
    return;
  }

  // Vai alla pagina del gioco
  window.location.href = "config.html";
  localStorage.setItem('selectedTopic', selectedTopic);
}

// Simula la ruota della fortuna
rouletteButton.addEventListener("click", () => {
  const randomIndex = Math.floor(Math.random() * topics.length);
  topics.forEach(t => t.classList.remove("selected"));
  topics[randomIndex].classList.add("selected");
});
