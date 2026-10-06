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

        // 1. Atualiza o estado da conexão para Verde
        const statusElement = document.querySelector('.status-text') || document.getElementById('connectionStatus');
        if (statusElement) {
            statusElement.innerText = "Conectado ao Cloud Server";
            statusElement.style.color = "#34d399";
        }

        // 2. Procura o botão principal do jogo
        const btnMainPlay = document.getElementById('btnPlayOffline') || document.querySelector('button.btn-primary') || document.querySelector('button');

        if (btnMainPlay) {
            // Transforma o botão para "JOGAR ONLINE" com o código da sala
            btnMainPlay.innerText = `🚀 JOGAR ONLINE (SALA: ${roomCode})`;
            btnMainPlay.style.backgroundColor = "#10b981"; // Verde Neon/Emeralda
            btnMainPlay.style.color = "#ffffff";

            // Remove ouvintes antigos e define que o clique agora inicia o jogo online
            const newBtn = btnMainPlay.cloneNode(true);
            btnMainPlay.parentNode.replaceChild(newBtn, btnMainPlay);

            newBtn.addEventListener('click', () => {
                launchGameView();
            });
        }

        // 3. Mostra o código da sala em qualquer outro elemento reservado
        const codeElement = document.getElementById('activeRoomCode');
        if (codeElement) {
            codeElement.innerText = roomCode;
        }

    }).catch((error) => {
        console.error("Erro ao criar sala:", error);
        alert("Falha ao criar sala. Tente novamente.");
    });
}
        // 3. Muda para a tela do jogo/canvas
function launchGameView() {
    // 1. Oculta os menus
    const mainMenu = document.getElementById('mainMenu') || document.querySelector('.card-menu');
    const roomLobby = document.getElementById('roomLobby') || document.querySelector('.room-lobby');
    
    if (mainMenu) mainMenu.style.display = 'none';
    if (roomLobby) roomLobby.style.display = 'none';

    // 2. Localiza e exibe o Canvas do jogo
    const canvas = document.getElementById('gameCanvas') || document.querySelector('canvas');
    if (canvas) {
        canvas.style.display = 'block';
        
        // Redimensiona o canvas para o tamanho da janela se estiver zerado
        if (canvas.width === 0 || canvas.height === 0) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    }

    // 3. Tenta iniciar as variáveis e loops padrão do Veck.io
    if (typeof isPlaying !== 'undefined') isPlaying = true;
    if (typeof gameRunning !== 'undefined') gameRunning = true;

    // Tenta executar a função de arranque do jogo
    if (typeof startGame === 'function') {
        startGame();
    } else if (typeof init === 'function') {
        init();
    } else if (typeof start === 'function') {
        start();
    } else if (typeof loop === 'function') {
        loop();
    } else if (typeof animate === 'function') {
        animate();
    } else {
        console.warn("Nenhuma função de loop (startGame, init, loop) foi encontrada no script.js.");
    }
}
    // Associa o clique
    if (btnCreate) {
        btnCreate.addEventListener('click', createRoom);
    } else {
        console.warn("Botão de criar sala não foi encontrado no HTML.");
    }
});
