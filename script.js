// Handlers das salas online. Firebase e NetworkManager são inicializados pelo index.html.
(function () {
    function initializeRoomControls() {
        if (window.__roomControlsInitialized) return;
        window.__roomControlsInitialized = true;

        const game = window.gameInstance;
        const status = document.getElementById('connectionStatus');
        const setStatus = (message, color = '') => {
            if (!status) return;
            status.textContent = message;
            if (color) status.style.color = color;
        };

        if (!game || !game.netManager) {
            console.error('A engine do jogo não foi inicializada.');
            setStatus('Erro: o jogo não foi inicializado. Recarregue a página.');
            return;
        }

        const createButton = document.getElementById('btnCreateRoom');
        const joinButton = document.getElementById('btnJoinRoom');
        const confirmButton = document.getElementById('btnConfirmJoin');
        const inputContainer = document.getElementById('roomInputContainer');
        const codeInput = document.getElementById('roomCodeInput');

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
            try {
                if (window.audio?.init) window.audio.init();
                if (!window.FirebaseServices) {
                    throw new Error('Firebase não carregou. Verifique sua conexão e recarregue a página.');
                }
                await game.netManager.createRoom(async (code) => {
                    const { name, color } = getPlayerDetails('HostPilot');
                    setStatus(`Sala criada! Código: ${code}`, '#34d399');
                    try {
                        await game.startOnlineGame(name, color, true, code);
                    } catch (error) {
                        console.error('Falha ao iniciar a partida:', error);
                        setStatus(`Sala criada, mas não foi possível iniciar a partida: ${error.message || error}`);
                    }
                }, (message) => setStatus(message), (message) => setStatus(message));
            } catch (error) {
                console.error('Erro ao criar sala:', error);
                setStatus(`Não foi possível criar a sala: ${error.message || error}`);
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
            try {
                if (window.audio?.init) window.audio.init();
                if (!window.FirebaseServices) throw new Error('Firebase não carregou. Recarregue a página.');
                setStatus('Procurando sala...');
                await game.netManager.joinRoom(code, async () => {
                    const { name, color } = getPlayerDetails('GuestPilot');
                    setStatus('Conectado à sala!', '#34d399');
                    try {
                        await game.startOnlineGame(name, color, false, code);
                    } catch (error) {
                        console.error('Falha ao iniciar a partida:', error);
                        setStatus(`Conectou à sala, mas não foi possível iniciar a partida: ${error.message || error}`);
                    }
                }, (message) => setStatus(message));
            } catch (error) {
                console.error('Erro ao entrar na sala:', error);
                setStatus(`Não foi possível entrar na sala: ${error.message || error}`);
            } finally {
                confirmButton.disabled = false;
            }
        };

        confirmButton?.addEventListener('click', joinRoom);
        codeInput?.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') joinRoom();
        });
    }

    // O HTML cria gameInstance no evento load. Também cobre a execução após load.
    if (document.readyState === 'complete') {
        initializeRoomControls();
    } else {
        window.addEventListener('load', initializeRoomControls, { once: true });
    }
})();
