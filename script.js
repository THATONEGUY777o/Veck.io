// Referência à base de dados inicializada no HTML
const db = window.database;

// Função para iniciar a cena visual do jogo
function launchGameView() {
    // 1. Esconde o menu inicial
    const mainMenu = document.getElementById('mainMenu') || document.querySelector('.card-menu');
    if (mainMenu) mainMenu.style.display = 'none';

    // 2. Esconde o lobby/sala se houver
    const roomLobby = document.getElementById('roomLobby') || document.querySelector('.room-lobby');
    if (roomLobby) roomLobby.style.display = 'none';

    // 3. Mostra o Canvas do jogo
    const gameCanvas = document.getElementById('gameCanvas') || document.querySelector('canvas');
    if (gameCanvas) gameCanvas.style.display = 'block';

    // 4. Executa a função principal que roda o jogo
    if (typeof startGame === 'function') {
        startGame();
    } else if (typeof initGame === 'function') {
        initGame();
    } else if (typeof animate === 'function') {
        animate();
    }
}

// Função para criar a sala no Firebase
function createRoom() {
    if (!window.database || !window.dbRef || !window.dbSet) {
        alert("A aguardar conexão ao servidor...");
        return;
    }

    const roomCode = Math.floor(100000 + Math.random() * 900000).toString();
    const nicknameInput = document.getElementById('nicknameInput') || document.querySelector('input[type="text"]');
    const playerName = (nicknameInput && nicknameInput.value.trim() !== "") ? nicknameInput.value : 'CyberPilot';

    const roomRef = window.dbRef(window.database, 'rooms/' + roomCode);

    window.dbSet(roomRef, {
        host: playerName,
        status: 'waiting',
        createdAt: Date.now()
    }).then(() => {
        console.log("Sala criada com sucesso:", roomCode);

        // 1. Atualiza o indicador de status da conexão
        const statusElement = document.querySelector('.status-text') || document.getElementById('connectionStatus');
        if (statusElement) {
            statusElement.innerText = "Conectado ao Cloud Server";
            statusElement.style.color = "#34d399";
        }

        // 2. Coloca o código da sala no ecrã
        const codeElement = document.getElementById('activeRoomCode');
        if (codeElement) {
            codeElement.innerText = roomCode;
        }

        // 3. Muda para a tela do jogo/canvas
        launchGameView();

    }).catch((error) => {
        console.error("Erro ao criar sala:", error);
        alert("Falha ao criar sala. Tente novamente.");
    });
}

// Ligar o botão "+ CRIAR SALA" à função
document.addEventListener('DOMContentLoaded', () => {
    // Procura o botão pelo ID
    let btnCreate = document.getElementById('btnCreateRoom');

    // Se não encontrar por ID, procura todos os botões e acha o que tem o texto "CRIAR SALA"
    if (!btnCreate) {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(btn => {
            if (btn.innerText.includes('CRIAR SALA')) {
                btnCreate = btn;
            }
        });
    }

    // Associa o clique
    if (btnCreate) {
        btnCreate.addEventListener('click', createRoom);
    } else {
        console.warn("Botão de criar sala não foi encontrado no HTML.");
    }
});
