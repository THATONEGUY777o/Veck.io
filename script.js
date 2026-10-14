// -------------------------------------------------------------
// Função para Criar Sala no Firebase
// -------------------------------------------------------------
function createRoom() {
    console.log("Tentando criar sala...");

    // 1. Verifica se as funções do Firebase estão prontas no window
    if (!window.database || !window.dbRef || !window.dbSet) {
        console.error("Firebase ainda não foi inicializado no index.html!");
        alert("O servidor ainda está a conectar. Aguarde 2 segundos e tente novamente.");
        return;
    }

    // 2. Gera um código de sala aleatório de 6 dígitos
    const roomCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Obtém o nome digitado no campo de texto
    const nicknameInput = document.getElementById('nicknameInput') || document.querySelector('input[type="text"]');
    const playerName = (nicknameInput && nicknameInput.value.trim() !== "") ? nicknameInput.value : 'CyberPilot';

    // 3. Cria a referência 'rooms/CODIGO'
    const roomRef = window.dbRef(window.database, 'rooms/' + roomCode);

    // 4. Envia para a nuvem
    window.dbSet(roomRef, {
        host: playerName,
        status: 'waiting',
        createdAt: Date.now()
    }).then(() => {
        console.log("✅ Sala criada no Firebase! Código:", roomCode);

        // Atualiza o texto de status
        const statusElement = document.querySelector('.status-text') || document.getElementById('connectionStatus');
        if (statusElement) {
            statusElement.innerText = "Conectado ao Cloud Server";
            statusElement.style.color = "#34d399";
        }

        // Coloca o código da sala no ecrã
        const codeElement = document.getElementById('activeRoomCode');
        if (codeElement) {
            codeElement.innerText = roomCode;
        }

        // Procura e transforma o botão "JOGAR OFFLINE" em "JOGAR ONLINE"
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

            // Substitui o evento para iniciar a partida
            const newBtn = btnMainPlay.cloneNode(true);
            btnMainPlay.parentNode.replaceChild(newBtn, btnMainPlay);

            newBtn.addEventListener('click', () => {
                // Esconde o menu e mostra o Canvas
                const mainMenu = document.getElementById('mainMenu') || document.querySelector('.card-menu');
                if (mainMenu) mainMenu.style.display = 'none';

                const canvas = document.getElementById('gameCanvas') || document.querySelector('canvas');
                if (canvas) {
                    canvas.style.display = 'block';
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
                }

                // Inicia o loop do jogo
                if (typeof startGame === 'function') startGame();
                else if (typeof initGame === 'function') initGame();
                else if (typeof init === 'function') init();
                else if (typeof animate === 'function') animate();
            });
        }

    }).catch((error) => {
        console.error("Erro ao escrever no Firebase:", error);
        alert("Falha ao criar sala. Tente novamente.");
    });
}

// -------------------------------------------------------------
// Ligar o botão ao carregar a página
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
