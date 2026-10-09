// -------------------------------------------------------------
// 1. Função para Ocultar Menu e Iniciar o Canvas do Jogo
// -------------------------------------------------------------
// 1. Função para esconder a UI e exibir o Canvas
function launchGameView() {
    // Esconde o card do menu principal
    const mainMenu = document.getElementById('mainMenu') || document.querySelector('.card-menu');
    if (mainMenu) mainMenu.style.display = 'none';

    // Exibe o canvas do jogo
    const canvas = document.getElementById('gameCanvas') || document.querySelector('canvas');
    if (canvas) {
        canvas.style.display = 'block';
        
        // Garante as dimensões do ecrã
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    // --- AQUI ENTRA O TEU JOGO ---
    // Executa a função do teu código antigo que inicia o loop do canvas / física
    if (typeof startGame === 'function') {
        startGame(); 
    } else if (typeof init === 'function') {
        init();
    } else if (typeof animate === 'function') {
        animate();
    }
}

    // 3. Ativa o loop de jogo (se existir no teu script)
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
    }
}

// -------------------------------------------------------------
// 2. Função para Criar Sala no Firebase
// -------------------------------------------------------------
function createRoom() {
    // 1. Garante que os módulos do Firebase estão disponíveis no window
    const database = window.database;
    const dbRef = window.dbRef;
    const dbSet = window.dbSet;

    if (!database || !dbRef || !dbSet) {
        alert("O servidor ainda está a conectar. Aguarde 2 segundos...");
        return;
    }

    // 2. Gera o código da sala e obtém o apelido
    const roomCode = Math.floor(100000 + Math.random() * 900000).toString();
    const nicknameInput = document.getElementById('nicknameInput') || document.querySelector('input[type="text"]');
    const playerName = (nicknameInput && nicknameInput.value.trim() !== "") ? nicknameInput.value : 'CyberPilot';

    // 3. Regista a sala na base de dados (Sem alterar a lógica que já funciona)
    const roomRef = dbRef(database, 'rooms/' + roomCode);

    dbSet(roomRef, {
        host: playerName,
        status: 'waiting',
        createdAt: Date.now()
    }).then(() => {
        console.log("Sala guardada no Firebase com sucesso! Código:", roomCode);

        // 4. Atualiza o status da conexão para verde
        const statusElement = document.querySelector('.status-text') || document.getElementById('connectionStatus');
        if (statusElement) {
            statusElement.innerText = "Conectado ao Cloud Server";
            statusElement.style.color = "#34d399";
        }

        // 5. Transforma o botão "JOGAR OFFLINE" em "JOGAR ONLINE"
        let btnMainPlay = document.getElementById('btnPlayOffline');
        if (!btnMainPlay) {
            const buttons = document.querySelectorAll('button');
            buttons.forEach(btn => {
                if (btn.innerText.includes('OFFLINE') || btn.innerText.includes('JOGAR')) {
                    btnMainPlay = btn;
                }
            });
        }

        if (btnMainPlay) {
            btnMainPlay.innerText = `🚀 JOGAR ONLINE (SALA: ${roomCode})`;
            btnMainPlay.style.backgroundColor = "#10b981";
            btnMainPlay.style.color = "#ffffff";

            // 6. Ao clicar no botão verde "JOGAR ONLINE":
            const newBtn = btnMainPlay.cloneNode(true);
            btnMainPlay.parentNode.replaceChild(newBtn, btnMainPlay);

            newBtn.addEventListener('click', () => {
                // Esconde o menu
                const mainMenu = document.getElementById('mainMenu') || document.querySelector('.card-menu');
                if (mainMenu) mainMenu.style.display = 'none';

                // Exibe e dimensiona o Canvas do jogo
                const canvas = document.getElementById('gameCanvas') || document.querySelector('canvas');
                if (canvas) {
                    canvas.style.display = 'block';
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
                }

                // Dispara o loop original do jogo
                if (typeof startGame === 'function') startGame();
                else if (typeof initGame === 'function') initGame();
                else if (typeof init === 'function') init();
                else if (typeof animate === 'function') animate();
            });
        }

    }).catch((error) => {
        console.error("Erro ao criar sala:", error);
        alert("Falha ao criar sala na nuvem. Tente novamente.");
    });
}

// -------------------------------------------------------------
// 3. Atribuição dos Botões ao Carregar a Página
// -------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
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
