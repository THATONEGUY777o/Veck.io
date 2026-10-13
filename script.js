// Handlers das salas online. O Firebase e a lógica de rede são fornecidos pelo index.html.
window.addEventListener('load', () => {
    const game = window.gameInstance;
    if (!game || !game.netManager) {
        console.error('A engine do jogo não foi inicializada.');
        return;
    }

    const status = document.getElementById('connectionStatus');
    const createButton = document.getElementById('btnCreateRoom');
    const joinButton = document.getElementById('btnJoinRoom');
    const confirmButton = document.getElementById('btnConfirmJoin');
    const inputContainer = document.getElementById('roomInputContainer');
    const codeInput = document.getElementById('roomCodeInput');

    const setStatus = (message, color = '') => {
        if (!status) return;
        status.textContent = message;
        if (color) status.style.color = color;
    };

    const getPlayerDetails = (fallback) => {
        const nameInput = document.getElementById('playerNameInput');
        const name = nameInput?.value.trim() || fallback;
        const selectedColorButton = document.querySelector('.color-btn.ring-2');
        const color = selectedColorButton?.getAttribute('data-color') || '#00f3ff';
        return { name, color };
    };

    createButton?.addEventListener('click', async () => {
        if (createButton.disabled) return;
        createButton.disabled = true;
        if (window.audio?.init) window.audio.init();
        setStatus('Conectando ao servidor e criando sala...');

        try {
            await game.netManager.createRoom(async (code) => {
                const { name, color } = getPlayerDetails('HostPilot');
                setStatus(`Sala criada! Código: ${code}`, '#34d399');
                try {
                    await game.startOnlineGame(name, color, true, code);
                } catch (error) {
                    console.error('Falha ao iniciar a partida:', error);
                    setStatus('Sala criada, mas não foi possível iniciar a partida.');
                }
            }, (message) => setStatus(message));
        } catch (error) {
            console.error('Erro ao criar sala:', error);
            setStatus('Falha ao criar sala. Confira a configuração do Firebase.');
        } finally {
            createButton.disabled = false;
        }
    });

    joinButton?.addEventListener('click', () => {
        inputContainer?.classList.toggle('hidden');
        if (!inputContainer?.classList.contains('hidden')) codeInput?.focus();
    });

    const joinRoom = async () => {
        if (!confirmButton || confirmButton.disabled) return;
        const code = (codeInput?.value || '').trim().toUpperCase();
        if (code.length < 3) {
            setStatus('Digite um código de sala válido.');
            codeInput?.focus();
            return;
        }

        confirmButton.disabled = true;
        if (window.audio?.init) window.audio.init();
        setStatus('Procurando sala...');
        try {
            await game.netManager.joinRoom(code, async () => {
                const { name, color } = getPlayerDetails('GuestPilot');
                setStatus('Conectado à sala!', '#34d399');
                try {
                    await game.startOnlineGame(name, color, false, code);
                } catch (error) {
                    console.error('Falha ao iniciar a partida:', error);
                    setStatus('Conectou à sala, mas não foi possível iniciar a partida.');
                }
            }, (message) => setStatus(message));
        } catch (error) {
            console.error('Erro ao entrar na sala:', error);
            setStatus('Falha ao entrar na sala. Confira o código e o Firebase.');
        } finally {
            confirmButton.disabled = false;
        }
    };

    confirmButton?.addEventListener('click', joinRoom);
    codeInput?.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') joinRoom();
    });
});
