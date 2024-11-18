let scoreRed = 0;
let scoreBlue = 0;
let skips = localStorage.getItem("skipLimit");
let timer = localStorage.getItem("turnTime");
let turnsNumber = parseInt(localStorage.getItem("turnsNumber")) || Infinity;
let currentTurn = 1;
let currentTeam = "red"; // Il team iniziale è rosso
let countdownInterval;
let wordsList = [];
let currentIndex = 0;
let currentWordIndex = 0;
let selectedTopic = parseInt(localStorage.getItem('selectedTopic'));
document.addEventListener("DOMContentLoaded", function() {
    // Questo assicura che lo sfondo venga aggiornato anche all'inizio
    updateBackground();
    selectTopic();
});

const wordsByTopic = {
    mestieri: [
        "DENTISTA", "MECCANICO", "POMPIERE", "POLIZIOTTO", "CARABINIERE", "PROGRAMMATORE"
    ],
    azioni: [
        "MANGIARE", "CAMMINNARE", "CANTARE", "BALLARE", "STUDIARE", "BERE"
    ],
    sport: [
        "CALCIO", "PALLAVOLO", "BASKET", "JUDO", "DANZA", "TENNIS"
    ],
    animali: [
        "CANE", "GATTO", "LEONE", "TIGRE", "ELEFANTE", "ZEBRA"
    ],
    harrypotter: [
        "HARRY POTTER", "ERMIONE", "LUNA", "AGRID", "PITON", "SILENTE"
    ],
    film: [
        "TITANIC", "AVATAR", "IL TRONO DI SPADE", "HARRY POTTER", "IL GLADIATORE", "TROY", "IL PADRINO",
        "PULP FICTION",
        "SCHINDLER'S LIST",
        "THE DARK KNIGHT",
        "INCEPTION",
        "FIGHT CLUB",
        "THE SHAWSHANK REDEMPTION",
        "THE GODFATHER: PART II",
        "THE LORD OF THE RINGS",
        "THE MATRIX",
        "THE EMPIRE STRIKES BACK",
        "CITIZEN KANE",
        "INTERSTELLAR",
        "BACK TO THE FUTURE",
        "GOODFELLAS",
        "STAR WARS: A NEW HOPE",
        "CASABLANCA",
        "ONE FLEW OVER THE CUCKOO'S NEST",
        "THE SILENCE OF THE LAMBS",
        "THE USUAL SUSPECTS",
        "LORD OF THE FLIES",
        "JURASSIC PARK",
        "THE SHINING",
        "A CLOCKWORK ORANGE",
        "THE GREEN MILE",
        "SAVING PRIVATE RYAN",
        "IN THE NAME OF THE FATHER",
        "AMERICAN HISTORY X",
        "LA LA LAND",
        "PSYCHO",
        "12 ANGRY MEN",
        "THE DARK KNIGHT RISES",
        "MATRIX RELOADED",
        "THE SOCIAL NETWORK",
        "THE PRESTIGE",
        "SHREK",
        "THE TERMINATOR",
        "THE HURT LOCKER",
        "BLADE RUNNER",
        "TAXI DRIVER",
        "THE INTOUCHABLES",
        "THE WOLF OF WALL STREET",
        "SLUMDOG MILLIONAIRE",
        "FERRIS BUELLER'S DAY OFF",
        "LION KING"
    ],
};

// Funzione per selezionare il topic, che può essere modificato in base alla scelta dell'utente
function selectTopic() {
    // Mappatura dei numeri ai topic
    const topicNames = [
        "mestieri",  // 0
        "azioni",      // 1
        "sport",       // 2
        "animali",      // 3
        "harrypotter",      // 4
        "film"      // 5
    ];

    // Controlliamo se selectedTopic è valido
    if (selectedTopic !== null && selectedTopic >= 0 && selectedTopic < topicNames.length) {
        const topic = topicNames[selectedTopic];  // Ottieni il nome del topic
        console.log("Topic selezionato:", topic);  // Debugging
        if (wordsByTopic[topic]) {
            shuffleWords(topic);  // Passa il topic selezionato alla funzione shuffleWords
        } else {
            alert("Topic non valido1");
        }
    } else {
        alert("Topic non valido2");
    }
}

function startTurn() {
    document.getElementById("startTurnButton").style.display = "none"; // Nasconde il pulsante "Inizia Turno"
    skips = localStorage.getItem("skipLimit");
    timer = parseInt(localStorage.getItem("turnTime"));
    document.getElementById("skipButton").disabled = false;
    document.getElementById("correctButton").disabled = false;
    document.getElementById("decrementScoreButton").disabled = false;

    updateBackground();
    startTimer();
}

function updateBackground() {
    const gameBody = document.getElementById("gameBody");
    console.log(gameBody); // Controlla se viene trovato correttamente l'elemento

    if (currentTeam === "red") {
        gameBody.classList.remove("team-blue");
        gameBody.classList.add("team-red");
    } else {
        gameBody.classList.remove("team-red");
        gameBody.classList.add("team-blue");
    }
}

function switchTeam() {
    currentTeam = currentTeam === "red" ? "blue" : "red";
}


function startTimer() {
    const timerElement = document.getElementById("timer");

    // Ferma qualsiasi timer attivo prima di avviarne uno nuovo
    clearInterval(countdownInterval);

    // Aggiorna il display e imposta l'intervallo per far partire il timer
    timerElement.textContent = `${timer}s`;

    const countdown = setInterval(() => {
        if (timer <= 0) {
            clearInterval(countdown);
            document.getElementById("skipButton").disabled = true;
            document.getElementById("correctButton").disabled = true;
            document.getElementById("decrementScoreButton").disabled = true;
            endTurn();
        } else {
            timer--;
            timerElement.textContent = `${timer}s`;
        }
    }, 1000);
}

function endTurn() {
    clearInterval(countdownInterval); // Ferma il timer al termine del turno
    if (currentTurn >= turnsNumber) {
        if (scoreRed > scoreBlue) {
            showEndScreen('Rosso');
        } else if (scoreBlue > scoreRed) {
            showEndScreen('Blu');
        } else {
            showEndScreen('Nessuno (pareggio)');
        }
    } else {
        switchTeam();
        currentTurn++;
        document.getElementById("startTurnButton").style.display = "block"; // Mostra il pulsante per il prossimo turno
    }
}

function decrementScore() {
    if (currentTeam === "red"){
        scoreRed--;
    }
    else{
       scoreBlue--;
    }

    document.getElementById("score").textContent = `Team Rosso: ${scoreRed} - Team Blu: ${scoreBlue}`;
}

function correctAnswer() {
    if (currentTeam === "red"){
        scoreRed++;
    }
    else{
       scoreBlue++;
    }
    document.getElementById("score").textContent = `Team Rosso: ${scoreRed} - Team Blu: ${scoreBlue}`;
    nextWord();
}

function skipWord() {
    if (skips > 0) {
        skips--;
        nextWord();
    }
    if (skips === 0) {
        document.getElementById("skipButton").disabled = true;
    }
}

function shuffleWords(topic) {
// Verifica che il parametro topic sia effettivamente passato
    if (!topic) {
        console.error("Topic non valido3", topic);
        return;
    }
    const words = wordsByTopic[topic];  // Ottieni le parole per il topic selezionato
    if (!words) {
        console.error("Nessuna parola trovata per il topic:", topic);
        return;
    }

    // Mescola le parole
    wordsList = [...words];
    for (let i = wordsList.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [wordsList[i], wordsList[j]] = [wordsList[j], wordsList[i]]; // Scambia le parole
    }

    console.log("Parole mescolate:", wordsList);  // Debugging
    // Adesso carica o mostra le parole mescolate nel gioco
    loadWords();
}

function loadWords() {
    try {
        if (currentWordIndex >= wordsList.length) {
            alert("Tutte le parole sono state mostrate!");
            return; // Puoi terminare il gioco o riavviare
        }

        // Carica la parola e le parole proibite dalla lista mescolata
        const wordData = wordsList[currentWordIndex];
        document.getElementById("mainWord").textContent = wordData;

   } catch (error) {
        console.error("Errore nel caricamento delle parole:", error);
    }
}

// 4. Funzione per saltare alla parola successiva
function nextWord() {
    // Avanza all'elemento successivo dell'array, ricominciando se necessario
    currentWordIndex = (currentWordIndex + 1) % wordsList.length;
    loadWords();
}

function showEndScreen(winner) {

    const victorySound = new Audio('victory.mp3'); // Assicurati che il percorso sia corretto
    victorySound.play();

    // Impostiamo il testo del vincitore
    const winnerElement = document.getElementById('winner');
    winnerElement.textContent = `Vincitore: Team ${winner}`;

    // Mostriamo il punteggio finale
    const scoreResult = document.getElementById('scoreResult');
    scoreResult.textContent = `Team Rosso: ${scoreRed} - Team Blu: ${scoreBlue}`;

    // Aggiungi il pulsante "Nuova Partita"
    const newGameButton = document.createElement("button");
    newGameButton.id = "newGameButton";
    newGameButton.textContent = "Nuova Partita";
    document.getElementById('endScreen').appendChild(newGameButton);

    // Mostriamo la schermata di fine gioco
    document.getElementById('endScreen').style.display = 'block';

    // Avviamo l'animazione dei coriandoli
    createConfetti();

    newGameButton.addEventListener("click", function() {
        window.location.href = "topic.html"; // Sostituisci con il percorso esatto della tua pagina di configurazione
    });
}

// Funzione per creare i coriandoli
function createConfetti() {
    for (let i = 0; i < 100; i++) {
        let confetti = document.createElement('div');
        confetti.classList.add('confetti');
        document.body.appendChild(confetti);

        // Posizionamento e animazione casuale
        const startX = Math.random() * window.innerWidth;
        const endX = Math.random() * window.innerWidth;
        const animationDuration = Math.random() * 2 + 3; // Durata dell'animazione tra 3 e 5 secondi

        confetti.style.left = `${startX}px`;
        confetti.style.animationDuration = `${animationDuration}s`;
        confetti.style.animationDelay = `${Math.random() * 2}s`;
        confetti.style.animationName = 'confetti';

        // Effetto di colore casuale
        confetti.style.backgroundColor = getRandomColor();
    }
}

// Funzione per ottenere un colore casuale per i coriandoli
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Funzione per riavviare il gioco
function restartGame() {
    // Nascondi la schermata di fine gioco
    document.getElementById('endScreen').style.display = 'none';

    // Reindirizza alla pagina di configurazione
    window.location.href = 'topic.html'; // Assicurati che il nome del file di configurazione sia corretto
}

// Al termine del gioco, mostra la schermata finale


// 5. Chiamata della funzione per caricare la prima parola quando la pagina è caricata
document.addEventListener("DOMContentLoaded", loadWords);

document.addEventListener("DOMContentLoaded", () => {
    startTimer();
});
