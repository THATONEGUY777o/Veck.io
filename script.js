// Controles multiplayer do VECK.IO.
// Depende do gameInstance e do FirebaseServices inicializados pelo index HTML.
(function () {
    const STARTUP_TIMEOUT_MS = 15000;
    const ROOM_TIMEOUT_MS = 20000;

    function withTimeout(promise, ms, message) {
        let timer;
        return Promise.race([
            promise,
            new Promise((_, reject) => {
                timer = window.setTimeout(() => reject(new Error(message)), ms);
            })
        ]).finally(() => window.clearTimeout(timer));
    }

    function setStatus(message, color = '') {
        const el = document.getElementById('connectionStatus');
        if (!el) return;
        el.textContent = message;
        if (color) el.style.color = color;
    }

    function bindRoomControls() {
        // Não marque como inicializado até que o jogo e os elementos existam.
        if (window.__roomControlsInitialized) return true;

        const game = window.gameInstance;
        const createButton = document.getElementById('btnCreateRoom');
        const joinButton = document.getElementById('btnJoinRoom');
        const confirmButton = document.getElementById('btnConfirmJoin');
        const inputContainer = document.getElementById('roomInputContainer');
        const codeInput = document.getElementById('roomCodeInput');

        if (!game?.netManager || !createButton || !joinButton || !confirmButton) {
            return false;
        }

        window.__roomControlsInitialized = true;

        function playerDetails(fallbackName) {
            const nameInput = document.getElementById('playerNameInput');
            const selectedColor = document.querySelector('.color-btn.ring-2');
            return {
                name: nameInput?.value.trim() || fallbackName,
                color: selectedColor?.getAttribute('data-color') || '#00f3ff'
            };
        }

        createButton.addEventListener('click', async () => {
            if (createButton.disabled) return;
            createButton.disabled = true;

            try {
                window.audio?.init?.();
                if (!window.FirebaseServices) {
                    throw new Error('Firebase SDK não carregou. Confira a conexão e recarregue a página.');
                }

                setStatus('Autenticando no Firebase...');
                const createPromise = game.netManager.createRoom(
                    async (code) => {
                        const { name, color } = playerDetails('HostPilot');
                        setStatus(`Sala criada! Código: ${code}`, '#34d399');
                        try {
                            await game.startOnlineGame(name, color, true, code);
                        } catch (error) {
                            console.error('Falha ao iniciar a partida:', error);
                            setStatus(`A sala foi criada, mas o jogo não iniciou: ${error.message || error}`);
                        }
                    },
                    (message) => setStatus(message),
                    (message) => setStatus(message)
                );

                await withTimeout(
                    createPromise,
                    ROOM_TIMEOUT_MS,
                    'Tempo esgotado criando sala. Verifique Firebase Authentication, conexão, Firestore e regras de segurança.'
                );
            } catch (error) {
                console.error('Erro no botão Criar Sala:', error);
                setStatus(`Falha ao criar sala: ${error.code || error.message || error}`);
            } finally {
                createButton.disabled = false;
            }
        });

        joinButton.addEventListener('click', () => {
            inputContainer?.classList.toggle('hidden');
            if (!inputContainer?.classList.contains('hidden')) codeInput?.focus();
        });

        async function joinRoom() {
            if (confirmButton.disabled) return;
            const code = (codeInput?.value || '').trim().toUpperCase();
            if (code.length < 3) {
                setStatus('Digite um código de sala válido.');
                codeInput?.focus();
                return;
            }

            confirmButton.disabled = true;
            try {
                window.audio?.init?.();
                if (!window.FirebaseServices) {
                    throw new Error('Firebase SDK não carregou. Confira a conexão e recarregue a página.');
                }

                setStatus('Autenticando e procurando sala...');
                await withTimeout(
                    game.netManager.joinRoom(
                        code,
                        async () => {
                            const { name, color } = playerDetails('GuestPilot');
                            setStatus('Conectado à sala!', '#34d399');
                            try {
                                await game.startOnlineGame(name, color, false, code);
                            } catch (error) {
                                console.error('Falha ao iniciar a partida:', error);
                                setStatus(`Entrou na sala, mas o jogo não iniciou: ${error.message || error}`);
                            }
                        },
                        (message) => setStatus(message)
                    ),
                    ROOM_TIMEOUT_MS,
                    'Tempo esgotado procurando a sala. Verifique conexão e Firestore.'
                );
            } catch (error) {
                console.error('Erro ao entrar na sala:', error);
                setStatus(`Falha ao entrar na sala: ${error.code || error.message || error}`);
            } finally {
                confirmButton.disabled = false;
            }
        }

        confirmButton.addEventListener('click', joinRoom);
        codeInput?.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') joinRoom();
        });

        console.info('Controles de sala inicializados.');
        return true;
    }

    function startBinding() {
        if (bindRoomControls()) return;

        // O gameInstance é criado num listener window.load do próprio HTML.
        // Tentamos nesse evento e fazemos polling curto como fallback.
        window.addEventListener('load', bindRoomControls, { once: true });
        const startedAt = Date.now();
        const poll = window.setInterval(() => {
            if (bindRoomControls()) {
                window.clearInterval(poll);
            } else if (Date.now() - startedAt >= STARTUP_TIMEOUT_MS) {
                window.clearInterval(poll);
                setStatus('O jogo não inicializou. Confira se o HTML e o script.js correspondem e recarregue.');
                console.error('Timeout aguardando gameInstance e controles da sala.');
            }
        }, 100);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startBinding, { once: true });
    } else {
        startBinding();
    }
})();
