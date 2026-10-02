// Referência à base de dados inicializada no HTML
const db = window.database;

// Função para criar a sala no Firebase
function createRoom() {
    if (!window.database || !window.dbRef || !window.dbSet) {
        console.error("Firebase não está carregado no window!");
        alert("Falha ao criar sala. Tente novamente.");
        return;
    }

    // Gera um código de sala aleatório de 6 dígitos
    const roomCode = Math.floor(100000 + Math.random() * 900000).toString();
    const nicknameInput = document.getElementById('nicknameInput') || document.querySelector('input[type="text"]');
    const playerName = nicknameInput ? nicknameInput.value : 'CyberPilot';

    // Aponta para 'rooms/CODIGO' na base de dados
    const roomRef = window.dbRef(window.database, 'rooms/' + roomCode);

    window.dbSet(roomRef, {
        host: playerName,
        status: 'waiting',
        createdAt: Date.now()
    }).then(() => {
        console.log("Sala criada com sucesso! Código:", roomCode);
        
        // Atualiza a interface com o código da sala
        const activeRoomElement = document.getElementById('activeRoomCode');
        if (activeRoomElement) {
            activeRoomElement.innerText = roomCode;
        }
        
        // Aqui entra a lógica do teu jogo para mudar de ecrã/abrir o lobby
    }).catch((error) => {
        console.error("Erro no Firebase ao criar sala:", error);
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
