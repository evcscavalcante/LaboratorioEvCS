document.addEventListener('DOMContentLoaded', function() {
    const menuButtons = document.querySelectorAll('.btn-menu');
    const contentDiv = document.getElementById('content');
    let currentEnsaioType = null;
    let currentListaUrl = null;

    // Mapeia os tipos de ensaio para nomes mais amigáveis
    const tiposEnsaioNomes = {
        'in-situ': 'Densidade In Situ',
        'real': 'Densidade Real',
        'max-min': 'Densidade Máxima e Mínima'
    };

    // Função para carregar conteúdo dinamicamente
    async function loadContent(url, ensaioType = null, data = null) {
        console.log(`Tentando carregar ${url} para o tipo: ${ensaioType} com dados:`, data);
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Erro ao carregar ${url}: ${response.statusText}`);
            }
            const html = await response.text();
            contentDiv.innerHTML = html;
            console.log(`Conteúdo de ${url} carregado.`);

            // Passa o tipo de ensaio para o script carregado, se houver
            window.currentEnsaioType = ensaioType;
            window.currentListaUrl = currentListaUrl; // Passa a URL da lista atual
            window.ensaioData = data; // Passa os dados para edição

            // Executa scripts inline após carregar o HTML
            executeInlineScripts(contentDiv);

            // Adiciona botão "Voltar para Lista" se estiver na calculadora
            if (url.includes('densidade_')) {
                addVoltarButton(contentDiv);
            }

        } catch (error) {
            console.error('Erro ao carregar conteúdo:', error);
            contentDiv.innerHTML = `<p style="color: red;">Erro ao carregar conteúdo: ${error.message}</p>`;
        }
    }

    // Função para executar scripts inline
    function executeInlineScripts(container) {
        const scripts = container.querySelectorAll("script");
        scripts.forEach(script => {
            const newScript = document.createElement("script");
            if (script.src) {
                // Se for script externo, apenas clona (pode não funcionar como esperado para todos os casos)
                newScript.src = script.src;
            } else {
                // Se for script inline, copia o conteúdo
                newScript.textContent = script.textContent;
            }
            // Remove o script original e adiciona o novo para forçar a execução
            script.parentNode.removeChild(script);
            document.body.appendChild(newScript).parentNode.removeChild(newScript); // Executa no escopo global
        });
    }

    // Função para adicionar botão "Voltar para Lista"
    function addVoltarButton(container) {
        const form = container.querySelector('form.calculadora-container');
        if (form) {
            const voltarBtn = document.createElement('button');
            voltarBtn.type = 'button'; // Evita submit do form
            voltarBtn.className = 'btn-voltar-lista';
            voltarBtn.innerHTML = '<i class="fas fa-arrow-left"></i> Voltar para Lista';
            voltarBtn.style.cssText = 'padding: 10px 15px; background-color: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 20px;';
            
            // Adiciona o botão antes dos botões de ação existentes ou no final do form
            const actionButtons = form.querySelector('.form-actions'); // Supondo que exista uma div para botões
            if (actionButtons) {
                actionButtons.insertBefore(voltarBtn, actionButtons.firstChild);
            } else {
                form.appendChild(voltarBtn);
            }
        }
    }

    // Adiciona listeners aos botões do menu
    menuButtons.forEach(button => {
        button.addEventListener('click', () => {
            const ensaioType = button.getAttribute('data-ensaio');
            const listaUrl = button.getAttribute('data-lista');
            const calculadoraUrl = button.getAttribute('data-calculadora');

            if (listaUrl) {
                currentEnsaioType = ensaioType;
                currentListaUrl = listaUrl; // Guarda a URL da lista para o botão Voltar
                window.currentCalculadoraUrl = calculadoraUrl; // Guarda a URL da calculadora para o botão Novo/Editar
                loadContent(listaUrl, ensaioType);
            }
        });
    });

    // Delegação de eventos para botões carregados dinamicamente
    contentDiv.addEventListener('click', async (event) => {
        const target = event.target;

        // Botão Novo Ensaio (na lista)
        if (target.classList.contains('btn-novo-ensaio')) {
            console.log('Botão Novo Ensaio clicado');
            if (window.currentCalculadoraUrl && window.currentEnsaioType) {
                loadContent(window.currentCalculadoraUrl, window.currentEnsaioType, null); // Passa null como dados
            } else {
                alert('Erro: Não foi possível determinar a calculadora para este tipo de ensaio.');
            }
        }

        // Botão Editar (na lista)
        if (target.classList.contains('btn-editar')) {
            const registroId = target.getAttribute('data-id');
            console.log(`Botão Editar clicado para registro: ${registroId}`);
            // Simulação: Carrega a calculadora vazia por enquanto
            // Em um cenário real, buscaria os dados do registroId e passaria para loadContent
            if (window.currentCalculadoraUrl && window.currentEnsaioType) {
                // const dadosDoRegistro = await buscarDadosRegistro(registroId); // Função a ser implementada
                const dadosSimulados = { id: registroId, registro: `REG-${registroId}`, data: '2025-05-31', material: 'Simulado' }; // Dados simulados
                loadContent(window.currentCalculadoraUrl, window.currentEnsaioType, dadosSimulados);
            } else {
                alert('Erro: Não foi possível determinar a calculadora para este tipo de ensaio.');
            }
        }

        // Botão Voltar para Lista (na calculadora)
        if (target.classList.contains('btn-voltar-lista')) {
            console.log('Botão Voltar para Lista clicado');
            if (window.currentListaUrl && window.currentEnsaioType) {
                loadContent(window.currentListaUrl, window.currentEnsaioType);
            } else {
                alert('Erro: Não foi possível determinar a lista de ensaios para retornar.');
                // Como fallback, recarrega a tela inicial
                contentDiv.innerHTML = '<div class="welcome-screen"><h2>Bem-vindo à Calculadora de Compacidade</h2><p>Selecione uma opção no menu para começar.</p></div>';
            }
        }
        
        // Botão Excluir (na lista) - Adicionar lógica se necessário
        if (target.classList.contains('btn-excluir')) {
            const registroId = target.getAttribute('data-id');
             if (confirm(`Tem certeza que deseja excluir o registro ${registroId}?`)) {
                console.log(`Excluir registro ${registroId}`);
                // Adicionar lógica de exclusão aqui (e.g., chamar API, atualizar UI)
                // Recarregar a lista após excluir
                if (window.currentListaUrl && window.currentEnsaioType) {
                    loadContent(window.currentListaUrl, window.currentEnsaioType);
                }
            }
        }

        // Botão Filtrar (na lista) - Adicionar lógica se necessário
        if (target.classList.contains('btn-filtro')) {
             console.log('Aplicando filtros...');
             // Adicionar lógica de filtro aqui (e.g., chamar API com filtros, atualizar UI)
             // Recarregar a lista após aplicar filtros
             if (window.currentListaUrl && window.currentEnsaioType) {
                 loadContent(window.currentListaUrl, window.currentEnsaioType);
             }
        }

    });

    // Disponibiliza a função loadContent globalmente para ser chamada por scripts carregados
    window.loadContent = loadContent;

    console.log('Dashboard inicializado.');
});

