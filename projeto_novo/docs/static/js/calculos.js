// Módulo de cálculos automáticos para o sistema de ensaios
window.calculadora = (function() {
    // Funções auxiliares
    function arredondar(valor, casas = 3) {
        if (isNaN(valor) || valor === null || valor === undefined) return 0;
        const multiplicador = Math.pow(10, casas);
        return Math.round(valor * multiplicador) / multiplicador;
    }

    function calcularDensidadeAgua(temperatura) {
        // Fórmula para densidade da água em função da temperatura
        if (isNaN(temperatura) || temperatura === null || temperatura === undefined) return 0.9982;
        return arredondar(1.0 - (Math.abs(temperatura - 4.0) * 0.0000175), 4);
    }

    // Cálculos para Densidade In Situ
    function calcularDensidadeInSitu() {
        console.log('Calculando densidade in situ...');
        
        // Cálculos para determinação 1
        const moldeSolo1 = parseFloat(document.getElementById('molde-solo-1').value) || 0;
        const molde1 = parseFloat(document.getElementById('molde-1').value) || 0;
        const volume1 = parseFloat(document.getElementById('volume-1').value) || 0;
        
        const solo1 = moldeSolo1 - molde1;
        document.getElementById('solo-1').value = arredondar(solo1, 2);
        
        const gamaNatUm1 = volume1 > 0 ? solo1 / volume1 : 0;
        document.getElementById('gama-nat-um-1').value = arredondar(gamaNatUm1, 3);
        
        // Cálculos para determinação 2
        const moldeSolo2 = parseFloat(document.getElementById('molde-solo-2').value) || 0;
        const molde2 = parseFloat(document.getElementById('molde-2').value) || 0;
        const volume2 = parseFloat(document.getElementById('volume-2').value) || 0;
        
        const solo2 = moldeSolo2 - molde2;
        document.getElementById('solo-2').value = arredondar(solo2, 2);
        
        const gamaNatUm2 = volume2 > 0 ? solo2 / volume2 : 0;
        document.getElementById('gama-nat-um-2').value = arredondar(gamaNatUm2, 3);
        
        // Cálculos para umidade topo
        calcularUmidade('topo');
        
        // Cálculos para umidade base
        calcularUmidade('base');
        
        // Cálculo da densidade seca
        const umidadeMediaTopo = parseFloat(document.getElementById('umidade-media-topo').value) || 0;
        const umidadeMediaBase = parseFloat(document.getElementById('umidade-media-base').value) || 0;
        const umidadeMedia = (umidadeMediaTopo + umidadeMediaBase) / 2;
        
        const gamaNat1 = gamaNatUm1 / (1 + (umidadeMedia / 100));
        document.getElementById('gama-nat-1').value = arredondar(gamaNat1, 3);
        
        const gamaNat2 = gamaNatUm2 / (1 + (umidadeMedia / 100));
        document.getElementById('gama-nat-2').value = arredondar(gamaNat2, 3);
        
        // Média das densidades
        const gamaNatM = (gamaNat1 + gamaNat2) / 2;
        document.getElementById('gama-nat-m').value = arredondar(gamaNatM, 3);
    }
    
    function calcularUmidade(tipo) {
        for (let i = 1; i <= 3; i++) {
            const soloUmidoTara = parseFloat(document.getElementById(`solo-umido-tara-${tipo}-${i}`).value) || 0;
            const soloSecoTara = parseFloat(document.getElementById(`solo-seco-tara-${tipo}-${i}`).value) || 0;
            const tara = parseFloat(document.getElementById(`tara-${tipo}-${i}`).value) || 0;
            
            const soloSeco = soloSecoTara - tara;
            document.getElementById(`solo-seco-${tipo}-${i}`).value = arredondar(soloSeco, 2);
            
            const agua = soloUmidoTara - soloSecoTara;
            document.getElementById(`agua-${tipo}-${i}`).value = arredondar(agua, 2);
            
            const umidade = soloSeco > 0 ? (agua / soloSeco) * 100 : 0;
            document.getElementById(`umidade-${tipo}-${i}`).value = arredondar(umidade, 1);
        }
        
        // Média das umidades
        const umidade1 = parseFloat(document.getElementById(`umidade-${tipo}-1`).value) || 0;
        const umidade2 = parseFloat(document.getElementById(`umidade-${tipo}-2`).value) || 0;
        const umidade3 = parseFloat(document.getElementById(`umidade-${tipo}-3`).value) || 0;
        
        const umidadeMedia = (umidade1 + umidade2 + umidade3) / 3;
        document.getElementById(`umidade-media-${tipo}`).value = arredondar(umidadeMedia, 1);
    }
    
    // Cálculos para Densidade Real
    function calcularDensidadeReal() {
        console.log('Calculando densidade real...');
        
        // Cálculos para umidade
        for (let i = 1; i <= 3; i++) {
            const soloUmidoTara = parseFloat(document.getElementById(`solo-umido-tara-${i}`).value) || 0;
            const soloSecoTara = parseFloat(document.getElementById(`solo-seco-tara-${i}`).value) || 0;
            const tara = parseFloat(document.getElementById(`tara-${i}`).value) || 0;
            
            const soloSeco = soloSecoTara - tara;
            document.getElementById(`solo-seco-${i}`).value = arredondar(soloSeco, 2);
            
            const agua = soloUmidoTara - soloSecoTara;
            document.getElementById(`agua-${i}`).value = arredondar(agua, 2);
            
            const umidade = soloSeco > 0 ? (agua / soloSeco) * 100 : 0;
            document.getElementById(`umidade-${i}`).value = arredondar(umidade, 1);
        }
        
        // Média das umidades
        const umidade1 = parseFloat(document.getElementById('umidade-1').value) || 0;
        const umidade2 = parseFloat(document.getElementById('umidade-2').value) || 0;
        const umidade3 = parseFloat(document.getElementById('umidade-3').value) || 0;
        
        const umidadeMedia = (umidade1 + umidade2 + umidade3) / 3;
        document.getElementById('umidade-media').value = arredondar(umidadeMedia, 1);
        
        // Cálculos para picnômetro 1
        const temperatura1 = parseFloat(document.getElementById('temperatura-1').value) || 20;
        const densidadeAgua1 = calcularDensidadeAgua(temperatura1);
        document.getElementById('densidade-agua-1').value = arredondar(densidadeAgua1, 4);
        
        const massaSoloUmido1 = parseFloat(document.getElementById('massa-solo-umido-1').value) || 0;
        const massaSoloSeco1 = massaSoloUmido1 / (1 + (umidadeMedia / 100));
        document.getElementById('massa-solo-seco-1').value = arredondar(massaSoloSeco1, 2);
        
        const massaPicAgua1 = parseFloat(document.getElementById('massa-pic-agua-1').value) || 0;
        const massaPicAmostraAgua1 = parseFloat(document.getElementById('massa-pic-amostra-agua-1').value) || 0;
        
        // Densidade real = (massa solo seco * densidade água) / (massa pic+água + massa solo seco - massa pic+amostra+água)
        const densidadeReal1 = (massaSoloSeco1 * densidadeAgua1) / 
                              (massaPicAgua1 + massaSoloSeco1 - massaPicAmostraAgua1);
        document.getElementById('densidade-real-1').value = arredondar(densidadeReal1, 3);
        
        // Cálculos para picnômetro 2
        const temperatura2 = parseFloat(document.getElementById('temperatura-2').value) || 20;
        const densidadeAgua2 = calcularDensidadeAgua(temperatura2);
        document.getElementById('densidade-agua-2').value = arredondar(densidadeAgua2, 4);
        
        const massaSoloUmido2 = parseFloat(document.getElementById('massa-solo-umido-2').value) || 0;
        const massaSoloSeco2 = massaSoloUmido2 / (1 + (umidadeMedia / 100));
        document.getElementById('massa-solo-seco-2').value = arredondar(massaSoloSeco2, 2);
        
        const massaPicAgua2 = parseFloat(document.getElementById('massa-pic-agua-2').value) || 0;
        const massaPicAmostraAgua2 = parseFloat(document.getElementById('massa-pic-amostra-agua-2').value) || 0;
        
        const densidadeReal2 = (massaSoloSeco2 * densidadeAgua2) / 
                              (massaPicAgua2 + massaSoloSeco2 - massaPicAmostraAgua2);
        document.getElementById('densidade-real-2').value = arredondar(densidadeReal2, 3);
        
        // Média das densidades reais
        const densidadeRealMedia = (densidadeReal1 + densidadeReal2) / 2;
        document.getElementById('densidade-real-media').value = arredondar(densidadeRealMedia, 3);
        
        // Diferença percentual
        const diferenca = Math.abs(densidadeReal1 - densidadeReal2) / densidadeRealMedia * 100;
        document.getElementById('diferenca').value = arredondar(diferenca, 2);
    }
    
    // Cálculos para Densidade Máxima e Mínima
    function calcularDensidadeMaxMin() {
        console.log('Calculando densidade máxima e mínima...');
        
        // Cálculos para densidade máxima
        for (let i = 1; i <= 2; i++) {
            const massaCilindro = parseFloat(document.getElementById(`massa-cilindro-max-${i}`).value) || 0;
            const volumeCilindro = parseFloat(document.getElementById(`volume-cilindro-max-${i}`).value) || 0;
            const massaCilindroSolo = parseFloat(document.getElementById(`massa-cilindro-solo-max-${i}`).value) || 0;
            
            const massaSolo = massaCilindroSolo - massaCilindro;
            document.getElementById(`massa-solo-max-${i}`).value = arredondar(massaSolo, 2);
            
            const densidadeMax = volumeCilindro > 0 ? massaSolo / volumeCilindro : 0;
            document.getElementById(`densidade-max-${i}`).value = arredondar(densidadeMax, 3);
        }
        
        // Média das densidades máximas
        const densidadeMax1 = parseFloat(document.getElementById('densidade-max-1').value) || 0;
        const densidadeMax2 = parseFloat(document.getElementById('densidade-max-2').value) || 0;
        
        const densidadeMaxMedia = (densidadeMax1 + densidadeMax2) / 2;
        document.getElementById('densidade-max-media').value = arredondar(densidadeMaxMedia, 3);
        
        // Cálculos para densidade mínima
        for (let i = 1; i <= 2; i++) {
            const massaCilindro = parseFloat(document.getElementById(`massa-cilindro-min-${i}`).value) || 0;
            const volumeCilindro = parseFloat(document.getElementById(`volume-cilindro-min-${i}`).value) || 0;
            const massaCilindroSolo = parseFloat(document.getElementById(`massa-cilindro-solo-min-${i}`).value) || 0;
            
            const massaSolo = massaCilindroSolo - massaCilindro;
            document.getElementById(`massa-solo-min-${i}`).value = arredondar(massaSolo, 2);
            
            const densidadeMin = volumeCilindro > 0 ? massaSolo / volumeCilindro : 0;
            document.getElementById(`densidade-min-${i}`).value = arredondar(densidadeMin, 3);
        }
        
        // Média das densidades mínimas
        const densidadeMin1 = parseFloat(document.getElementById('densidade-min-1').value) || 0;
        const densidadeMin2 = parseFloat(document.getElementById('densidade-min-2').value) || 0;
        
        const densidadeMinMedia = (densidadeMin1 + densidadeMin2) / 2;
        document.getElementById('densidade-min-media').value = arredondar(densidadeMinMedia, 3);
        
        // Resultados finais
        document.getElementById('densidade-max-final').value = arredondar(densidadeMaxMedia, 3);
        document.getElementById('densidade-min-final').value = arredondar(densidadeMinMedia, 3);
        
        // Compacidade relativa (não calculada neste momento, depende da densidade in situ)
        document.getElementById('compacidade-relativa').value = '';
    }
    
    // Função para salvar dados
    function salvarDados(tipoEnsaio) {
        console.log(`Salvando dados do ensaio ${tipoEnsaio}...`);
        
        // Obter dados comuns
        const dados = {
            registro: document.getElementById('registro').value,
            data: document.getElementById('data').value,
            operador: document.getElementById('operador').value,
            material: document.getElementById('material').value,
            origem: document.getElementById('origem').value,
            resultados: {
                status: 'CALCULADO'
            }
        };
        
        // Obter dados específicos por tipo de ensaio
        switch (tipoEnsaio) {
            case 'in-situ':
                dados.responsavel = document.getElementById('responsavel').value;
                dados.verificador = document.getElementById('verificador').value;
                dados.norte = document.getElementById('norte').value;
                dados.este = document.getElementById('este').value;
                dados.cota = document.getElementById('cota').value;
                dados.quadrante = document.getElementById('quadrante').value;
                dados.camada = document.getElementById('camada').value;
                dados.hora = document.getElementById('hora').value;
                dados.balanca = document.getElementById('balanca').value;
                dados.estufa = document.getElementById('estufa').value;
                
                // Determinações in situ
                dados.determinacoesInSitu = [
                    {
                        numeroCilindro: document.getElementById('numero-cilindro-1').value,
                        moldeSolo: parseFloat(document.getElementById('molde-solo-1').value) || 0,
                        molde: parseFloat(document.getElementById('molde-1').value) || 0,
                        solo: parseFloat(document.getElementById('solo-1').value) || 0,
                        volume: parseFloat(document.getElementById('volume-1').value) || 0,
                        gamaNatUm: parseFloat(document.getElementById('gama-nat-um-1').value) || 0,
                        gamaNat: parseFloat(document.getElementById('gama-nat-1').value) || 0
                    },
                    {
                        numeroCilindro: document.getElementById('numero-cilindro-2').value,
                        moldeSolo: parseFloat(document.getElementById('molde-solo-2').value) || 0,
                        molde: parseFloat(document.getElementById('molde-2').value) || 0,
                        solo: parseFloat(document.getElementById('solo-2').value) || 0,
                        volume: parseFloat(document.getElementById('volume-2').value) || 0,
                        gamaNatUm: parseFloat(document.getElementById('gama-nat-um-2').value) || 0,
                        gamaNat: parseFloat(document.getElementById('gama-nat-2').value) || 0
                    }
                ];
                
                // Determinações umidade topo
                dados.determinacoesUmidadeTopo = [];
                for (let i = 1; i <= 3; i++) {
                    dados.determinacoesUmidadeTopo.push({
                        capsula: document.getElementById(`capsula-topo-${i}`).value,
                        soloUmidoTara: parseFloat(document.getElementById(`solo-umido-tara-topo-${i}`).value) || 0,
                        soloSecoTara: parseFloat(document.getElementById(`solo-seco-tara-topo-${i}`).value) || 0,
                        tara: parseFloat(document.getElementById(`tara-topo-${i}`).value) || 0,
                        soloSeco: parseFloat(document.getElementById(`solo-seco-topo-${i}`).value) || 0,
                        agua: parseFloat(document.getElementById(`agua-topo-${i}`).value) || 0,
                        umidade: parseFloat(document.getElementById(`umidade-topo-${i}`).value) || 0
                    });
                }
                
                // Determinações umidade base
                dados.determinacoesUmidadeBase = [];
                for (let i = 1; i <= 3; i++) {
                    dados.determinacoesUmidadeBase.push({
                        capsula: document.getElementById(`capsula-base-${i}`).value,
                        soloUmidoTara: parseFloat(document.getElementById(`solo-umido-tara-base-${i}`).value) || 0,
                        soloSecoTara: parseFloat(document.getElementById(`solo-seco-tara-base-${i}`).value) || 0,
                        tara: parseFloat(document.getElementById(`tara-base-${i}`).value) || 0,
                        soloSeco: parseFloat(document.getElementById(`solo-seco-base-${i}`).value) || 0,
                        agua: parseFloat(document.getElementById(`agua-base-${i}`).value) || 0,
                        umidade: parseFloat(document.getElementById(`umidade-base-${i}`).value) || 0
                    });
                }
                
                // Resultados
                dados.resultados.gamaNatM = parseFloat(document.getElementById('gama-nat-m').value) || 0;
                dados.resultados.umidadeMediaTopo = parseFloat(document.getElementById('umidade-media-topo').value) || 0;
                dados.resultados.umidadeMediaBase = parseFloat(document.getElementById('umidade-media-base').value) || 0;
                break;
                
            case 'real':
                // Determinações umidade
                dados.determinacoesUmidadeReal = [];
                for (let i = 1; i <= 3; i++) {
                    dados.determinacoesUmidadeReal.push({
                        capsula: document.getElementById(`capsula-umidade-${i}`).value,
                        soloUmidoTara: parseFloat(document.getElementById(`solo-umido-tara-${i}`).value) || 0,
                        soloSecoTara: parseFloat(document.getElementById(`solo-seco-tara-${i}`).value) || 0,
                        tara: parseFloat(document.getElementById(`tara-${i}`).value) || 0,
                        soloSeco: parseFloat(document.getElementById(`solo-seco-${i}`).value) || 0,
                        agua: parseFloat(document.getElementById(`agua-${i}`).value) || 0,
                        umidade: parseFloat(document.getElementById(`umidade-${i}`).value) || 0
                    });
                }
                
                // Determinações picnômetro
                dados.determinacoesPicnometro = [
                    {
                        numeroPicnometro: document.getElementById('numero-picnometro-1').value,
                        temperatura: parseFloat(document.getElementById('temperatura-1').value) || 0,
                        densidadeAgua: parseFloat(document.getElementById('densidade-agua-1').value) || 0,
                        massaSoloUmido: parseFloat(document.getElementById('massa-solo-umido-1').value) || 0,
                        massaSoloSeco: parseFloat(document.getElementById('massa-solo-seco-1').value) || 0,
                        massaPicAgua: parseFloat(document.getElementById('massa-pic-agua-1').value) || 0,
                        massaPicAmostraAgua: parseFloat(document.getElementById('massa-pic-amostra-agua-1').value) || 0,
                        densidadeReal: parseFloat(document.getElementById('densidade-real-1').value) || 0
                    },
                    {
                        numeroPicnometro: document.getElementById('numero-picnometro-2').value,
                        temperatura: parseFloat(document.getElementById('temperatura-2').value) || 0,
                        densidadeAgua: parseFloat(document.getElementById('densidade-agua-2').value) || 0,
                        massaSoloUmido: parseFloat(document.getElementById('massa-solo-umido-2').value) || 0,
                        massaSoloSeco: parseFloat(document.getElementById('massa-solo-seco-2').value) || 0,
                        massaPicAgua: parseFloat(document.getElementById('massa-pic-agua-2').value) || 0,
                        massaPicAmostraAgua: parseFloat(document.getElementById('massa-pic-amostra-agua-2').value) || 0,
                        densidadeReal: parseFloat(document.getElementById('densidade-real-2').value) || 0
                    }
                ];
                
                // Resultados
                dados.resultados.umidadeMedia = parseFloat(document.getElementById('umidade-media').value) || 0;
                dados.resultados.densidadeRealMedia = parseFloat(document.getElementById('densidade-real-media').value) || 0;
                dados.resultados.diferenca = parseFloat(document.getElementById('diferenca').value) || 0;
                break;
                
            case 'max-min':
                // Determinações densidade máxima
                dados.determinacoesDensidadeMax = [
                    {
                        numeroCilindro: document.getElementById('numero-cilindro-max-1').value,
                        massaCilindro: parseFloat(document.getElementById('massa-cilindro-max-1').value) || 0,
                        volumeCilindro: parseFloat(document.getElementById('volume-cilindro-max-1').value) || 0,
                        massaCilindroSolo: parseFloat(document.getElementById('massa-cilindro-solo-max-1').value) || 0,
                        massaSolo: parseFloat(document.getElementById('massa-solo-max-1').value) || 0,
                        densidadeMax: parseFloat(document.getElementById('densidade-max-1').value) || 0
                    },
                    {
                        numeroCilindro: document.getElementById('numero-cilindro-max-2').value,
                        massaCilindro: parseFloat(document.getElementById('massa-cilindro-max-2').value) || 0,
                        volumeCilindro: parseFloat(document.getElementById('volume-cilindro-max-2').value) || 0,
                        massaCilindroSolo: parseFloat(document.getElementById('massa-cilindro-solo-max-2').value) || 0,
                        massaSolo: parseFloat(document.getElementById('massa-solo-max-2').value) || 0,
                        densidadeMax: parseFloat(document.getElementById('densidade-max-2').value) || 0
                    }
                ];
                
                // Determinações densidade mínima
                dados.determinacoesDensidadeMin = [
                    {
                        numeroCilindro: document.getElementById('numero-cilindro-min-1').value,
                        massaCilindro: parseFloat(document.getElementById('massa-cilindro-min-1').value) || 0,
                        volumeCilindro: parseFloat(document.getElementById('volume-cilindro-min-1').value) || 0,
                        massaCilindroSolo: parseFloat(document.getElementById('massa-cilindro-solo-min-1').value) || 0,
                        massaSolo: parseFloat(document.getElementById('massa-solo-min-1').value) || 0,
                        densidadeMin: parseFloat(document.getElementById('densidade-min-1').value) || 0
                    },
                    {
                        numeroCilindro: document.getElementById('numero-cilindro-min-2').value,
                        massaCilindro: parseFloat(document.getElementById('massa-cilindro-min-2').value) || 0,
                        volumeCilindro: parseFloat(document.getElementById('volume-cilindro-min-2').value) || 0,
                        massaCilindroSolo: parseFloat(document.getElementById('massa-cilindro-solo-min-2').value) || 0,
                        massaSolo: parseFloat(document.getElementById('massa-solo-min-2').value) || 0,
                        densidadeMin: parseFloat(document.getElementById('densidade-min-2').value) || 0
                    }
                ];
                
                // Resultados
                dados.resultados.densidadeMaxMedia = parseFloat(document.getElementById('densidade-max-media').value) || 0;
                dados.resultados.densidadeMinMedia = parseFloat(document.getElementById('densidade-min-media').value) || 0;
                dados.resultados.densidadeMaxFinal = parseFloat(document.getElementById('densidade-max-final').value) || 0;
                dados.resultados.densidadeMinFinal = parseFloat(document.getElementById('densidade-min-final').value) || 0;
                dados.resultados.compacidadeRelativa = parseFloat(document.getElementById('compacidade-relativa').value) || 0;
                break;
        }
        
        // Verificar se é edição ou novo registro
        const chave = `ensaios_${tipoEnsaio}`;
        const ensaios = JSON.parse(localStorage.getItem(chave) || '[]');
        const index = ensaios.findIndex(e => e.registro === dados.registro);
        
        if (index >= 0) {
            // Atualizar registro existente
            ensaios[index] = dados;
        } else {
            // Adicionar novo registro
            ensaios.push(dados);
        }
        
        // Salvar no localStorage
        localStorage.setItem(chave, JSON.stringify(ensaios));
        
        // Limpar dados de edição
        localStorage.removeItem('ensaio_edicao');
        
        alert(`Ensaio ${dados.registro} salvo com sucesso!`);
        
        // Voltar para a lista
        if (typeof window.loadContent === 'function') {
            window.loadContent('/templates/lista_ensaios.html', tipoEnsaio);
        }
    }
    
    // Função para gerar PDF
    function gerarPDF(tipoEnsaio) {
        console.log(`Gerando PDF do ensaio ${tipoEnsaio}...`);
        alert('Funcionalidade de geração de PDF simulada com sucesso!');
    }
    
    // Função para limpar formulário
    function limparFormulario() {
        console.log('Limpando formulário...');
        
        // Limpar dados de edição
        localStorage.removeItem('ensaio_edicao');
        
        // Recarregar página
        location.reload();
    }
    
    // Configurar eventos dos botões
    function configurarEventos(tipoEnsaio) {
        console.log(`Configurando eventos para ${tipoEnsaio}...`);
        
        // Botão Calcular
        const btnCalcular = document.querySelector('.btn-calcular');
        if (btnCalcular) {
            btnCalcular.addEventListener('click', function() {
                calcularAutomaticamente(tipoEnsaio);
            });
        }
        
        // Botão Salvar
        const btnSalvar = document.querySelector('.btn-salvar');
        if (btnSalvar) {
            btnSalvar.addEventListener('click', function() {
                salvarDados(tipoEnsaio);
            });
        }
        
        // Botão Gerar PDF
        const btnGerarPDF = document.querySelector('.btn-gerar-pdf');
        if (btnGerarPDF) {
            btnGerarPDF.addEventListener('click', function() {
                gerarPDF(tipoEnsaio);
            });
        }
        
        // Botão Limpar
        const btnLimpar = document.querySelector('.btn-limpar');
        if (btnLimpar) {
            btnLimpar.addEventListener('click', function() {
                if (confirm('Tem certeza que deseja limpar todos os dados do formulário?')) {
                    limparFormulario();
                }
            });
        }
        
        // Configurar eventos de cálculo automático para campos de entrada
        configurarCalculoAutomatico(tipoEnsaio);
    }
    
    // Configurar cálculo automático para campos de entrada
    function configurarCalculoAutomatico(tipoEnsaio) {
        const campos = document.querySelectorAll('input[type="number"]:not([readonly])');
        campos.forEach(campo => {
            campo.addEventListener('input', function() {
                calcularAutomaticamente(tipoEnsaio);
            });
        });
    }
    
    // Função principal para cálculo automático
    function calcularAutomaticamente(tipoEnsaio) {
        console.log(`Calculando automaticamente para ${tipoEnsaio}...`);
        
        switch (tipoEnsaio) {
            case 'in-situ':
                calcularDensidadeInSitu();
                break;
            case 'real':
                calcularDensidadeReal();
                break;
            case 'max-min':
                calcularDensidadeMaxMin();
                break;
        }
    }
    
    // Inicializar módulo
    function inicializar() {
        console.log('Inicializando módulo de cálculos...');
        
        // Detectar tipo de ensaio atual
        const pathname = window.location.pathname;
        let tipoEnsaio = '';
        
        if (pathname.includes('densidade_in_situ')) {
            tipoEnsaio = 'in-situ';
        } else if (pathname.includes('densidade_real')) {
            tipoEnsaio = 'real';
        } else if (pathname.includes('densidade_max_min')) {
            tipoEnsaio = 'max-min';
        }
        
        if (tipoEnsaio) {
            configurarEventos(tipoEnsaio);
            calcularAutomaticamente(tipoEnsaio);
        }
    }
    
    // Executar inicialização quando o DOM estiver pronto
    document.addEventListener('DOMContentLoaded', inicializar);
    
    // API pública
    return {
        calcularAutomaticamente: calcularAutomaticamente,
        salvarDados: salvarDados,
        gerarPDF: gerarPDF,
        limparFormulario: limparFormulario
    };
})();
