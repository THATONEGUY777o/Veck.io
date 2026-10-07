// Referência à base de dados que foi inicializada no HTML
const db = window.database;

// -------------------------------------------------------------
// 1. Função para Ocultar Menu e Iniciar o Canvas do Jogo
// -------------------------------------------------------------
function launchGameView() {
    console.log("A iniciar a arena do jogo...");

    // 1. Esconde o menu principal e lobbies
    const mainMenu = document.getElementById('mainMenu') || document.querySelector('.card-menu');
    const roomLobby = document.getElementById('roomLobby') || document.querySelector('.room-lobby');
    
    if (mainMenu) mainMenu.style.display = 'none';
    if (roomLobby) roomLobby.style.display = 'none';

    // 2. Localiza e exibe o Canvas do jogo
    const canvas = document.getElementById('gameCanvas') || document.querySelector('canvas');
    if (canvas) {
        canvas.style.display = 'block';
        
        // Ajusta dimensões se necessário
        if (canvas.width === 0 || canvas.height === 0) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    }

    // 3. Ativa o loop do jogo (tenta as funções padrão do teu projeto)
    if (typeof isPlaying !== 'undefined') isPlaying = true;
    if (typeof gameRunning !== 'undefined') gameRunning = true;

    if (typeof startGame === 'function') {
        startGame();
    } else if (typeof initGame === 'function') {
        initGame();
    } else if (typeof init === 'function') {
        init();
    } else if (typeof animate === 'function') {
        animate();
    } else {
        console.log("Iniciando modo de renderização do jogo...");
    }
}

// -------------------------------------------------------------
// 2. Função para Criar Sala e Alterar o Botão de Jogar
// -------------------------------------------------------------
function createRoom() {
    if (!window.database || !window.dbRef || !window.dbSet) {
        alert("O servidor ainda está a conectar. Aguarde alguns segundos...");
        return;
    }

    // Gera um código de sala aleatório de 6 dígitos
    const roomCode = Math.floor(100000 + Math.random() * 900000).toString();
    const nicknameInput = document.getElementById('nicknameInput') || document.querySelector('input[type="text"]');
    const playerName = (nicknameInput && nicknameInput.value.trim() !== "") ? nicknameInput.value : 'CyberPilot';

    // Aponta para 'rooms/CÓDIGO' no Realtime Database
    const roomRef = window.dbRef(window.database, 'rooms/' + roomCode);

    window.dbSet(roomRef, {
        host: playerName,
        status: 'waiting',
        createdAt: Date.now()
    }).then(() => {
        console.log("Sala criada no Firebase com sucesso! Código:", roomCode);

        // 1. Atualiza o status da conexão para Verde
        const statusElement = document.querySelector('.status-text') || document.getElementById('connectionStatus');
        if (statusElement) {
            statusElement.innerText = "Conectado ao Cloud Server";
            statusElement.style.color = "#34d399";
        }

        // 2. Coloca o código da sala no ecrã (se houver elemento reservado)
        const codeElement = document.getElementById('activeRoomCode');
        if (codeElement) {
            codeElement.innerText = roomCode;
        }

        // 3. Localiza e transforma o botão "JOGAR OFFLINE" em "JOGAR ONLINE"
        let btnMainPlay = document.getElementById('btnPlayOffline');
        
        if (!btnMainPlay) {
            // Se não tiver ID, procura o botão pelo texto original
            const buttons = document.querySelectorAll('button');
            buttons.forEach(btn => {
                if (btn.innerText.includes('JOGAR OFFLINE')) {
                    btnMainPlay = btn;
                }
            });
        }

        if (btnMainPlay) {
            // Altera visualmente o botão
            btnMainPlay.innerText = `🚀 JOGAR ONLINE (SALA: ${roomCode})`;
            btnMainPlay.style.backgroundColor = "#10b981"; // Verde Neon
            btnMainPlay.style.color = "#ffffff";

            // Substitui o evento de clique antigo para iniciar a partida online
            const newBtn = btnMainPlay.cloneNode(true);
            btnMainPlay.parentNode.replaceChild(newBtn, btnMainPlay);

            newBtn.addEventListener('click', () => {
                launchGameView();
            });
        }

    }).catch((error) => {
        console.error("Erro ao criar sala:", error);
        alert("Falha ao criar sala na nuvem. Tente novamente.");
    });
}

// -------------------------------------------------------------
// 3. Configuração dos Cliques dos Botões ao Carregar
// -------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    // Localiza o botão "+ CRIAR SALA"
    let btnCreate = document.getElementById('btnCreateRoom');

    if (!btnCreate) {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(btn => {
            if (btn.innerText.includes('CRIAR SALA')) {
                btnCreate = btn;
            }
        });
    }

    if (btnCreate) {
        btnCreate.addEventListener('click', createRoom);
    }
});
