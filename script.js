// Aceder à base de dados que foi inicializada no HTML
const db = window.database;

// Exemplo: Função para criar/entrar numa sala do Veck.io
function enterRoom(roomId, playerData) {
    if (!db) {
        console.error("Firebase ainda não está conectado!");
        return;
    }

    // Código para enviar os dados do jogador para a nuvem
    console.log("A conectar à sala: " + roomId);
    
    // Se o teu jogo usa o SDK do Firebase direto no JS,
    // podes usar as funções globais ou passar os dados normalmente.
}

// Lógica de cópia de código do botão (que já tínhamos ajustado)
const btnCopy = document.getElementById('btnCopyActiveCode');
if (btnCopy) {
    btnCopy.addEventListener('click', () => {
        const codeElement = document.getElementById('activeRoomCode');
        if (!codeElement) return;

        navigator.clipboard.writeText(codeElement.innerText).then(() => {
            btnCopy.innerHTML = '<i class="fa-solid fa-check text-emerald-400"></i>';
            setTimeout(() => {
                btnCopy.innerHTML = '<i class="fa-regular fa-copy"></i>';
            }, 1500);
        });
    });
}
