// Referência à base de dados inicializada no HTML
const db = window.database;

// Função para criar a sala no Firebase
function createRoom() {
    if (!window.database || !window.dbRef || !window.dbSet) {
        alert("A aguardar conexão ao servidor...");
        return;
    }

    const roomCode = Math.floor(100000 + Math.random() * 900000).toString();
    const nicknameInput = document.getElementById('nicknameInput') || document.querySelector('input[type="text"]');
    const playerName = nicknameInput ? nicknameInput.value : 'CyberPilot';

    const roomRef = window.dbRef(window.database, 'rooms/' + roomCode);

    window.dbSet(roomRef, {
        host: playerName,
        status: 'waiting',
        createdAt: Date.now()
    })// Exemplo dentro do callback da sala criada/unida:
.then(() => {
    console.log("Entrou na sala!");

    // 1. Esconder o menu principal
    const menu = document.getElementById('mainMenu') || document.querySelector('.card-menu');
    if (menu) menu.style.display = 'none';

    // 2. Mostrar o Canvas do jogo (se estiver escondido)
    const gameCanvas = document.getElementById('gameCanvas') || document.querySelector('canvas');
    if (gameCanvas) {
        gameCanvas.style.display = 'block';
    }

    // 3. Iniciar o loop de renderização do jogo (ajusta para o nome da tua função)
    if (typeof startGame === 'function') {
        startGame();
    } else if (typeof initGame === 'function') {
        initGame();
    } else if (typeof animate === 'function') {
        animate();
    }
});
        // 1. Atualiza o indicador de status da conexão
        const statusElement = document.querySelector('.status-text') || document.getElementById('connectionStatus');
        if (statusElement) {
            statusElement.innerText = "Conectado ao Cloud Server";
            statusElement.style.color = "#34d399"; // Verde
        }

        // 2. Coloca o código da sala no ecrã
        const codeElement = document.getElementById('activeRoomCode');
        if (codeElement) {
            codeElement.innerText = roomCode;
        }

        // 3. Muda a interface para o Lobby / Sala de Espera
        const mainMenu = document.getElementById('mainMenu') || document.querySelector('.card-menu');
        const roomLobby = document.getElementById('roomLobby') || document.querySelector('.room-lobby');

        if (mainMenu) mainMenu.style.display = 'none'; // Esconde o menu inicial
        if (roomLobby) roomLobby.style.display = 'block'; // Mostra a sala do jogo

    }).catch((error) => {
        console.error("Erro ao criar sala:", error);
        alert("Falha ao criar sala. Tente novamente.");
    });
}

// Ligar o botão "+ CRIAR SALA" à função
document.addEventListener('DOMContentLoaded', () => {
    // Procura o botão de criar sala pelo ID ou pela classe
    const btnCreate = document.getElementById('btnCreateRoom') || document.querySelector('button:contains("CRIAR SALA")');
    
    if (btnCreate) {
        btnCreate.addEventListener('click', createRoom);
    }
});
