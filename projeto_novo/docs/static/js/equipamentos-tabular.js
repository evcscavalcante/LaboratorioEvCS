// Módulo de cadastro tabular de equipamentos para o Laboratório Ev.C.S
// Implementa interface tabular para cadastro, visualização e exportação de equipamentos

document.addEventListener('DOMContentLoaded', () => {
    // Namespace para calculadora
    window.calculadora = window.calculadora || {};
    
    // Módulo de cadastro de equipamentos
    window.calculadora.equipamentos = (() => {
        // Constantes para armazenamento
        const STORE_PREFIX = 'equipamentos_';
        const TIPOS_EQUIPAMENTOS = {
            CAPSULAS: 'capsulas',
            CILINDROS: 'cilindros',
            CILINDROS_BISELADOS: 'cilindros_biselados',
            CILINDROS_PROCTOR: 'cilindros_proctor',
            CILINDROS_CBR: 'cilindros_cbr',
            CAPSULAS_LIMITES: 'capsulas_limites',
            PICNOMETROS: 'picnometros'
        };
        
        // Estrutura de dados para cada tipo de equipamento
        const ESTRUTURA_DADOS = {
            [TIPOS_EQUIPAMENTOS.CAPSULAS]: {
                titulo: 'Cápsulas',
                campos: [
                    { id: 'numero', nome: 'Nº', tipo: 'text' },
                    { id: 'peso', nome: 'Peso (g)', tipo: 'number' }
                ]
            },
            [TIPOS_EQUIPAMENTOS.CILINDROS]: {
                titulo: 'Cilindros',
                campos: [
                    { id: 'numero', nome: 'Nº', tipo: 'text' },
                    { id: 'peso', nome: 'Peso (g)', tipo: 'number' },
                    { id: 'volume', nome: 'Volume (cm³)', tipo: 'number' }
                ]
            },
            [TIPOS_EQUIPAMENTOS.CILINDROS_BISELADOS]: {
                titulo: 'Cilindros Biselados',
                campos: [
                    { id: 'numero', nome: 'Nº', tipo: 'text' },
                    { id: 'peso', nome: 'Peso (g)', tipo: 'number' },
                    { id: 'volume', nome: 'Volume (cm³)', tipo: 'number' }
                ]
            },
            [TIPOS_EQUIPAMENTOS.CILINDROS_PROCTOR]: {
                titulo: 'Cilindros de Proctor',
                campos: [
                    { id: 'numero', nome: 'Nº', tipo: 'text' },
                    { id: 'peso', nome: 'Peso (g)', tipo: 'number' },
                    { id: 'volume', nome: 'Volume (cm³)', tipo: 'number' }
                ]
            },
            [TIPOS_EQUIPAMENTOS.CILINDROS_CBR]: {
                titulo: 'Cilindros de CBR',
                campos: [
                    { id: 'numero', nome: 'Nº', tipo: 'text' },
                    { id: 'peso', nome: 'Peso (g)', tipo: 'number' },
                    { id: 'volume', nome: 'Volume (cm³)', tipo: 'number' },
                    { id: 'altura', nome: 'Altura (mm)', tipo: 'number' }
                ]
            },
            [TIPOS_EQUIPAMENTOS.CAPSULAS_LIMITES]: {
                titulo: 'Cápsulas para Limites',
                campos: [
                    { id: 'numero', nome: 'Nº', tipo: 'text' },
                    { id: 'peso', nome: 'Peso (g)', tipo: 'number' }
                ]
            },
            [TIPOS_EQUIPAMENTOS.PICNOMETROS]: {
                titulo: 'Picnômetros',
                campos: [
                    { id: 'numero', nome: 'Nº', tipo: 'text' },
                    { id: 'pesoSemAgua', nome: 'Peso sem água (g)', tipo: 'number' },
                    { id: 'pesoComAgua', nome: 'Peso com água (g)', tipo: 'number' }
                ]
            }
        };
        
        // Variáveis de estado
        let tipoAtual = null;
        let modalAberto = false;
        
        // Inicializar módulo
        function init() {
            // Adicionar botão de configuração ao menu principal
            adicionarBotaoConfiguracao();
            
            // Configurar listeners para preenchimento automático
            configurarPreenchimentoAutomatico();
            
            console.log('Módulo de cadastro de equipamentos inicializado');
        }
        
        // Adicionar botão de configuração ao menu principal
        function adicionarBotaoConfiguracao() {
            const menuPrincipal = document.querySelector('.menu-principal .menu-opcoes');
            if (!menuPrincipal) return;
            
            // Verificar se o botão já existe
            if (menuPrincipal.querySelector('#btn-configurar-equipamentos')) return;
            
            // Criar botão
            const btnConfigurar = document.createElement('button');
            btnConfigurar.id = 'btn-configurar-equipamentos';
            btnConfigurar.className = 'btn-menu';
            btnConfigurar.innerHTML = '<i class="fas fa-tools"></i> Configurar Equipamentos';
            btnConfigurar.addEventListener('click', abrirModalCadastro);
            
            // Adicionar ao menu
            menuPrincipal.appendChild(btnConfigurar);
        }
        
        // Abrir modal de cadastro de equipamentos
        function abrirModalCadastro() {
            if (modalAberto) return;
            
            // Criar overlay
            const overlay = document.createElement('div');
            overlay.className = 'modal-overlay';
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) fecharModalCadastro();
            });
            
            // Criar modal
            const modal = document.createElement('div');
            modal.className = 'modal-equipamentos';
            modal.innerHTML = `
                <div class="modal-header">
                    <h2>Cadastro de Equipamentos</h2>
                    <button class="btn-fechar"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-tabs">
                    ${Object.values(TIPOS_EQUIPAMENTOS).map(tipo => 
                        `<button class="tab-btn" data-tipo="${tipo}">${ESTRUTURA_DADOS[tipo].titulo}</button>`
                    ).join('')}
                </div>
                <div class="modal-content">
                    <!-- Conteúdo será carregado dinamicamente -->
                </div>
                <div class="modal-footer">
                    <button class="btn-exportar"><i class="fas fa-file-export"></i> Exportar Dados</button>
                    <button class="btn-importar"><i class="fas fa-file-import"></i> Importar Dados</button>
                </div>
            `;
            
            // Adicionar ao DOM
            overlay.appendChild(modal);
            document.body.appendChild(overlay);
            
            // Configurar eventos
            modal.querySelector('.btn-fechar').addEventListener('click', fecharModalCadastro);
            modal.querySelector('.btn-exportar').addEventListener('click', exportarDados);
            modal.querySelector('.btn-importar').addEventListener('click', importarDados);
            
            // Configurar tabs
            const tabs = modal.querySelectorAll('.tab-btn');
            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    tabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    carregarConteudoTab(tab.dataset.tipo);
                });
            });
            
            // Ativar primeira tab
            tabs[0].click();
            
            // Marcar como aberto
            modalAberto = true;
            
            // Adicionar estilos CSS
            adicionarEstilosCSS();
        }
        
        // Fechar modal de cadastro
        function fecharModalCadastro() {
            const overlay = document.querySelector('.modal-overlay');
            if (overlay) {
                document.body.removeChild(overlay);
                modalAberto = false;
            }
        }
        
        // Carregar conteúdo da tab selecionada
        function carregarConteudoTab(tipo) {
            tipoAtual = tipo;
            const modalContent = document.querySelector('.modal-content');
            if (!modalContent) return;
            
            const estrutura = ESTRUTURA_DADOS[tipo];
            if (!estrutura) return;
            
            // Carregar equipamentos existentes
            const equipamentos = carregarEquipamentos(tipo);
            
            // Criar formulário de cadastro
            const formHTML = `
                <div class="form-cadastro">
                    <h3>Cadastrar ${estrutura.titulo}</h3>
                    <div class="form-row">
                        ${estrutura.campos.map(campo => `
                            <div class="form-group">
                                <label for="${campo.id}">${campo.nome}:</label>
                                <input type="${campo.tipo}" id="${campo.id}" placeholder="Digite o ${campo.nome.toLowerCase()}">
                            </div>
                        `).join('')}
                        <div class="form-group">
                            <button class="btn-salvar"><i class="fas fa-save"></i> Salvar</button>
                        </div>
                    </div>
                </div>
                <div class="tabela-container">
                    <h3>Lista de ${estrutura.titulo}</h3>
                    <table class="tabela-equipamentos">
                        <thead>
                            <tr>
                                ${estrutura.campos.map(campo => `<th>${campo.nome}</th>`).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            ${equipamentos.map(equip => `
                                <tr>
                                    ${estrutura.campos.map(campo => `<td>${equip[campo.id] || ''}</td>`).join('')}
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
            
            modalContent.innerHTML = formHTML;
            
            // Configurar evento de salvar
            modalContent.querySelector('.btn-salvar').addEventListener('click', salvarEquipamento);
        }
        
        // Salvar equipamento
        function salvarEquipamento() {
            const estrutura = ESTRUTURA_DADOS[tipoAtual];
            if (!estrutura) return;
            
            // Obter valores do formulário
            const equipamento = {};
            let valido = true;
            
            estrutura.campos.forEach(campo => {
                const input = document.getElementById(campo.id);
                if (!input) return;
                
                const valor = input.value.trim();
                
                // Validar campo obrigatório
                if (campo.id === 'numero' && !valor) {
                    window.calculadora.exibirNotificacao('O número do equipamento é obrigatório', 'error');
                    valido = false;
                    return;
                }
                
                // Converter para número se necessário
                if (campo.tipo === 'number' && valor) {
                    equipamento[campo.id] = parseFloat(valor);
                } else {
                    equipamento[campo.id] = valor;
                }
            });
            
            if (!valido) return;
            
            // Carregar equipamentos existentes
            const equipamentos = carregarEquipamentos(tipoAtual);
            
            // Verificar se já existe equipamento com o mesmo número
            const numeroEquipamento = equipamento.numero;
            const indiceExistente = equipamentos.findIndex(e => e.numero === numeroEquipamento);
            
            if (indiceExistente >= 0) {
                // Substituir equipamento existente
                equipamentos[indiceExistente] = equipamento;
                window.calculadora.exibirNotificacao(`Equipamento ${numeroEquipamento} atualizado com sucesso`, 'success');
            } else {
                // Adicionar novo equipamento
                equipamentos.push(equipamento);
                window.calculadora.exibirNotificacao(`Equipamento ${numeroEquipamento} cadastrado com sucesso`, 'success');
            }
            
            // Salvar no localStorage
            salvarEquipamentos(tipoAtual, equipamentos);
            
            // Recarregar conteúdo da tab
            carregarConteudoTab(tipoAtual);
            
            // Limpar formulário
            limparFormulario();
        }
        
        // Limpar formulário de cadastro
        function limparFormulario() {
            const estrutura = ESTRUTURA_DADOS[tipoAtual];
            if (!estrutura) return;
            
            estrutura.campos.forEach(campo => {
                const input = document.getElementById(campo.id);
                if (input) input.value = '';
            });
            
            // Focar no campo de número
            document.getElementById('numero')?.focus();
        }
        
        // Carregar equipamentos do localStorage
        function carregarEquipamentos(tipo) {
            const chave = STORE_PREFIX + tipo;
            const dados = localStorage.getItem(chave);
            
            if (!dados) return [];
            
            try {
                return JSON.parse(dados);
            } catch (e) {
                console.error(`Erro ao carregar equipamentos do tipo ${tipo}:`, e);
                return [];
            }
        }
        
        // Salvar equipamentos no localStorage
        function salvarEquipamentos(tipo, equipamentos) {
            const chave = STORE_PREFIX + tipo;
            
            try {
                localStorage.setItem(chave, JSON.stringify(equipamentos));
                return true;
            } catch (e) {
                console.error(`Erro ao salvar equipamentos do tipo ${tipo}:`, e);
                return false;
            }
        }
        
        // Buscar equipamento pelo número
        function buscarEquipamento(tipo, numero) {
            const equipamentos = carregarEquipamentos(tipo);
            return equipamentos.find(e => e.numero === numero) || null;
        }
        
        // Exportar dados de todos os equipamentos
        function exportarDados() {
            const dados = {};
            
            // Coletar dados de todos os tipos de equipamentos
            Object.values(TIPOS_EQUIPAMENTOS).forEach(tipo => {
                dados[tipo] = carregarEquipamentos(tipo);
            });
            
            // Adicionar metadados
            dados.dataExportacao = new Date().toISOString();
            dados.versao = '1.0';
            
            // Converter para JSON
            const jsonString = JSON.stringify(dados, null, 2);
            
            // Criar blob e link para download
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `equipamentos_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            
            // Limpar
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 0);
            
            window.calculadora.exibirNotificacao('Dados exportados com sucesso', 'success');
        }
        
        // Importar dados de equipamentos
        function importarDados() {
            // Criar input de arquivo
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'application/json';
            
            input.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;
                
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const dados = JSON.parse(event.target.result);
                        
                        // Validar estrutura básica
                        if (!dados || typeof dados !== 'object') {
                            throw new Error('Formato de arquivo inválido');
                        }
                        
                        // Importar cada tipo de equipamento
                        let totalImportado = 0;
                        
                        Object.values(TIPOS_EQUIPAMENTOS).forEach(tipo => {
                            if (Array.isArray(dados[tipo])) {
                                salvarEquipamentos(tipo, dados[tipo]);
                                totalImportado += dados[tipo].length;
                            }
                        });
                        
                        // Recarregar conteúdo da tab atual
                        if (tipoAtual) {
                            carregarConteudoTab(tipoAtual);
                        }
                        
                        window.calculadora.exibirNotificacao(`Importação concluída: ${totalImportado} equipamentos importados`, 'success');
                    } catch (error) {
                        console.error('Erro ao importar dados:', error);
                        window.calculadora.exibirNotificacao(`Erro ao importar dados: ${error.message}`, 'error');
                    }
                };
                
                reader.readAsText(file);
            });
            
            input.click();
        }
        
        // Configurar preenchimento automático nos formulários
        function configurarPreenchimentoAutomatico() {
            // Aguardar carregamento do DOM
            document.addEventListener('formLoaded', (event) => {
                const { form, tipo } = event.detail;
                if (!form) return;
                
                // Configurar preenchimento para cilindros
                configurarPreenchimentoCilindros(form);
                
                // Configurar preenchimento para cápsulas
                configurarPreenchimentoCapsulas(form);
                
                // Configurar preenchimento para picnômetros
                if (tipo === 'real') {
                    configurarPreenchimentoPicnometros(form);
                }
            });
        }
        
        // Configurar preenchimento automático para cilindros
        function configurarPreenchimentoCilindros(form) {
            // Cilindros padrão
            const inputsCilindro = form.querySelectorAll('input[id^="numero-cilindro"]');
            inputsCilindro.forEach(input => {
                input.addEventListener('blur', () => {
                    const numero = input.value.trim();
                    if (!numero) return;
                    
                    // Obter índice do cilindro
                    const match = input.id.match(/numero-cilindro-(\d+)/);
                    const indice = match ? match[1] : '1';
                    
                    // Buscar cilindro
                    const cilindro = buscarEquipamento(TIPOS_EQUIPAMENTOS.CILINDROS, numero);
                    
                    if (cilindro) {
                        // Preencher campos
                        const inputPeso = form.querySelector(`#molde-${indice}`);
                        const inputVolume = form.querySelector(`#volume-${indice}`);
                        
                        if (inputPeso) inputPeso.value = cilindro.peso;
                        if (inputVolume) inputVolume.value = cilindro.volume;
                        
                        // Disparar evento de change para recalcular
                        [inputPeso, inputVolume].forEach(input => {
                            if (input) {
                                input.dispatchEvent(new Event('change', { bubbles: true }));
                                input.dispatchEvent(new Event('input', { bubbles: true }));
                            }
                        });
                    }
                });
            });
            
            // Cilindros biselados
            const inputsCilindroBiselado = form.querySelectorAll('input[id^="cilindro-biselado"]');
            inputsCilindroBiselado.forEach(input => {
                input.addEventListener('blur', () => {
                    const numero = input.value.trim();
                    if (!numero) return;
                    
                    // Obter índice do cilindro
                    const match = input.id.match(/cilindro-biselado-(\d+)/);
                    const indice = match ? match[1] : '1';
                    
                    // Buscar cilindro biselado
                    const cilindro = buscarEquipamento(TIPOS_EQUIPAMENTOS.CILINDROS_BISELADOS, numero);
                    
                    if (cilindro) {
                        // Preencher campos
                        const inputPeso = form.querySelector(`#peso-cilindro-biselado-${indice}`);
                        const inputVolume = form.querySelector(`#volume-cilindro-biselado-${indice}`);
                        
                        if (inputPeso) inputPeso.value = cilindro.peso;
                        if (inputVolume) inputVolume.value = cilindro.volume;
                        
                        // Disparar evento de change para recalcular
                        [inputPeso, inputVolume].forEach(input => {
                            if (input) {
                                input.dispatchEvent(new Event('change', { bubbles: true }));
                                input.dispatchEvent(new Event('input', { bubbles: true }));
                            }
                        });
                    }
                });
            });
            
            // Cilindros de Proctor
            const inputsCilindroProctor = form.querySelectorAll('input[id^="cilindro-proctor"]');
            inputsCilindroProctor.forEach(input => {
                input.addEventListener('blur', () => {
                    const numero = input.value.trim();
                    if (!numero) return;
                    
                    // Obter índice do cilindro
                    const match = input.id.match(/cilindro-proctor-(\d+)/);
                    const indice = match ? match[1] : '1';
                    
                    // Buscar cilindro de Proctor
                    const cilindro = buscarEquipamento(TIPOS_EQUIPAMENTOS.CILINDROS_PROCTOR, numero);
                    
                    if (cilindro) {
                        // Preencher campos
                        const inputPeso = form.querySelector(`#peso-cilindro-proctor-${indice}`);
                        const inputVolume = form.querySelector(`#volume-cilindro-proctor-${indice}`);
                        
                        if (inputPeso) inputPeso.value = cilindro.peso;
                        if (inputVolume) inputVolume.value = cilindro.volume;
                        
                        // Disparar evento de change para recalcular
                        [inputPeso, inputVolume].forEach(input => {
                            if (input) {
                                input.dispatchEvent(new Event('change', { bubbles: true }));
                                input.dispatchEvent(new Event('input', { bubbles: true }));
                            }
                        });
                    }
                });
            });
            
            // Cilindros de CBR
            const inputsCilindroCBR = form.querySelectorAll('input[id^="cilindro-cbr"]');
            inputsCilindroCBR.forEach(input => {
                input.addEventListener('blur', () => {
                    const numero = input.value.trim();
                    if (!numero) return;
                    
                    // Obter índice do cilindro
                    const match = input.id.match(/cilindro-cbr-(\d+)/);
                    const indice = match ? match[1] : '1';
                    
                    // Buscar cilindro de CBR
                    const cilindro = buscarEquipamento(TIPOS_EQUIPAMENTOS.CILINDROS_CBR, numero);
                    
                    if (cilindro) {
                        // Preencher campos
                        const inputPeso = form.querySelector(`#peso-cilindro-cbr-${indice}`);
                        const inputVolume = form.querySelector(`#volume-cilindro-cbr-${indice}`);
                        const inputAltura = form.querySelector(`#altura-cilindro-cbr-${indice}`);
                        
                        if (inputPeso) inputPeso.value = cilindro.peso;
                        if (inputVolume) inputVolume.value = cilindro.volume;
                        if (inputAltura) inputAltura.value = cilindro.altura;
                        
                        // Disparar evento de change para recalcular
                        [inputPeso, inputVolume, inputAltura].forEach(input => {
                            if (input) {
                                input.dispatchEvent(new Event('change', { bubbles: true }));
                                input.dispatchEvent(new Event('input', { bubbles: true }));
                            }
                        });
                    }
                });
            });
        }
        
        // Configurar preenchimento automático para cápsulas
        function configurarPreenchimentoCapsulas(form) {
            // Cápsulas padrão
            const inputsCapsula = form.querySelectorAll('input[id^="capsula-topo"], input[id^="capsula-base"]');
            inputsCapsula.forEach(input => {
                input.addEventListener('blur', () => {
                    const numero = input.value.trim();
                    if (!numero) return;
                    
                    // Determinar tipo (topo ou base)
                    const tipo = input.id.includes('topo') ? 'topo' : 'base';
                    
                    // Obter índice da cápsula
                    const match = input.id.match(/capsula-(?:topo|base)-(\d+)/);
                    const indice = match ? match[1] : '1';
                    
                    // Buscar cápsula
                    const capsula = buscarEquipamento(TIPOS_EQUIPAMENTOS.CAPSULAS, numero);
                    
                    if (capsula) {
                        // Preencher campo de tara
                        const inputTara = form.querySelector(`#tara-${tipo}-${indice}`);
                        
                        if (inputTara) {
                            inputTara.value = capsula.peso;
                            
                            // Disparar evento de change para recalcular
                            inputTara.dispatchEvent(new Event('change', { bubbles: true }));
                            inputTara.dispatchEvent(new Event('input', { bubbles: true }));
                        }
                    }
                });
            });
            
            // Cápsulas para limites
            const inputsCapsulaLimites = form.querySelectorAll('input[id^="capsula-limites"]');
            inputsCapsulaLimites.forEach(input => {
                input.addEventListener('blur', () => {
                    const numero = input.value.trim();
                    if (!numero) return;
                    
                    // Obter índice da cápsula
                    const match = input.id.match(/capsula-limites-(\d+)/);
                    const indice = match ? match[1] : '1';
                    
                    // Buscar cápsula para limites
                    const capsula = buscarEquipamento(TIPOS_EQUIPAMENTOS.CAPSULAS_LIMITES, numero);
                    
                    if (capsula) {
                        // Preencher campo de peso
                        const inputPeso = form.querySelector(`#peso-capsula-limites-${indice}`);
                        
                        if (inputPeso) {
                            inputPeso.value = capsula.peso;
                            
                            // Disparar evento de change para recalcular
                            inputPeso.dispatchEvent(new Event('change', { bubbles: true }));
                            inputPeso.dispatchEvent(new Event('input', { bubbles: true }));
                        }
                    }
                });
            });
        }
        
        // Configurar preenchimento automático para picnômetros
        function configurarPreenchimentoPicnometros(form) {
            const inputsPicnometro = form.querySelectorAll('input[id^="picnometro"]');
            inputsPicnometro.forEach(input => {
                input.addEventListener('blur', () => {
                    const numero = input.value.trim();
                    if (!numero) return;
                    
                    // Obter índice do picnômetro
                    const match = input.id.match(/picnometro-(\d+)/);
                    const indice = match ? match[1] : '1';
                    
                    // Buscar picnômetro
                    const picnometro = buscarEquipamento(TIPOS_EQUIPAMENTOS.PICNOMETROS, numero);
                    
                    if (picnometro) {
                        // Preencher campos
                        const inputSemAgua = form.querySelector(`#peso-picnometro-sem-agua-${indice}`);
                        const inputComAgua = form.querySelector(`#peso-picnometro-com-agua-${indice}`);
                        
                        if (inputSemAgua) inputSemAgua.value = picnometro.pesoSemAgua;
                        if (inputComAgua) inputComAgua.value = picnometro.pesoComAgua;
                        
                        // Disparar evento de change para recalcular
                        [inputSemAgua, inputComAgua].forEach(input => {
                            if (input) {
                                input.dispatchEvent(new Event('change', { bubbles: true }));
                                input.dispatchEvent(new Event('input', { bubbles: true }));
                            }
                        });
                    }
                });
            });
        }
        
        // Adicionar estilos CSS para o modal
        function adicionarEstilosCSS() {
            // Verificar se os estilos já foram adicionados
            if (document.getElementById('equipamentos-tabular-styles')) return;
            
            const style = document.createElement('style');
            style.id = 'equipamentos-tabular-styles';
            style.textContent = `
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }
                
                .modal-equipamentos {
                    background-color: white;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    width: 90%;
                    max-width: 1000px;
                    max-height: 90vh;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }
                
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 15px 20px;
                    background-color: #3f51b5;
                    color: white;
                }
                
                .modal-header h2 {
                    margin: 0;
                    font-size: 20px;
                }
                
                .btn-fechar {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 20px;
                    cursor: pointer;
                }
                
                .modal-tabs {
                    display: flex;
                    overflow-x: auto;
                    background-color: #f5f5f5;
                    border-bottom: 1px solid #ddd;
                }
                
                .tab-btn {
                    padding: 12px 15px;
                    background: none;
                    border: none;
                    border-bottom: 3px solid transparent;
                    cursor: pointer;
                    white-space: nowrap;
                    font-size: 14px;
                    color: #555;
                }
                
                .tab-btn.active {
                    border-bottom-color: #3f51b5;
                    color: #3f51b5;
                    font-weight: 500;
                }
                
                .modal-content {
                    padding: 20px;
                    overflow-y: auto;
                    max-height: calc(90vh - 180px);
                }
                
                .modal-footer {
                    display: flex;
                    justify-content: flex-end;
                    padding: 15px 20px;
                    background-color: #f5f5f5;
                    border-top: 1px solid #ddd;
                }
                
                .modal-footer button {
                    margin-left: 10px;
                }
                
                .form-cadastro {
                    margin-bottom: 30px;
                    padding: 20px;
                    background-color: #f9f9f9;
                    border-radius: 8px;
                    border: 1px solid #eee;
                }
                
                .form-cadastro h3 {
                    margin-top: 0;
                    margin-bottom: 15px;
                    color: #333;
                }
                
                .form-row {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 15px;
                    align-items: flex-end;
                }
                
                .form-group {
                    flex: 1;
                    min-width: 150px;
                    margin-bottom: 15px;
                }
                
                .form-group label {
                    display: block;
                    margin-bottom: 5px;
                    font-weight: 500;
                    color: #555;
                }
                
                .form-group input {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 14px;
                }
                
                .btn-salvar {
                    background-color: #4caf50;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    padding: 10px 15px;
                    cursor: pointer;
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .btn-salvar:hover {
                    background-color: #45a049;
                }
                
                .btn-exportar, .btn-importar {
                    background-color: #3f51b5;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    padding: 10px 15px;
                    cursor: pointer;
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .btn-exportar:hover, .btn-importar:hover {
                    background-color: #303f9f;
                }
                
                .tabela-container {
                    overflow-x: auto;
                }
                
                .tabela-container h3 {
                    margin-top: 0;
                    margin-bottom: 15px;
                    color: #333;
                }
                
                .tabela-equipamentos {
                    width: 100%;
                    border-collapse: collapse;
                    text-align: center;
                }
                
                .tabela-equipamentos th {
                    background-color: #3f51b5;
                    color: white;
                    padding: 10px;
                    border: 1px solid #ddd;
                }
                
                .tabela-equipamentos td {
                    padding: 10px;
                    border: 1px solid #ddd;
                }
                
                .tabela-equipamentos tbody tr:nth-child(even) {
                    background-color: #f9f9f9;
                }
                
                .tabela-equipamentos tbody tr:hover {
                    background-color: #f1f1f1;
                }
                
                @media (max-width: 768px) {
                    .form-row {
                        flex-direction: column;
                    }
                    
                    .form-group {
                        width: 100%;
                    }
                }
            `;
            
            document.head.appendChild(style);
        }
        
        // API pública
        return {
            init,
            abrirModalCadastro,
            buscarEquipamento,
            exportarDados,
            importarDados
        };
    })();
    
    // Inicializar módulo de cadastro de equipamentos
    window.calculadora.equipamentos.init();
});
