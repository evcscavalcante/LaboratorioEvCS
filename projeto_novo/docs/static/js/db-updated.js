/**
 * Módulo de banco de dados para o Laboratório Ev.C.S.
 * Implementa operações CRUD para ensaios com suporte a Firebase e modo offline.
 */

// Namespace para calculadora
window.calculadora = window.calculadora || {};

// Módulo de banco de dados
window.calculadora.db = (() => {
    // Coleções
    const COLECAO_ENSAIOS = 'ensaios';
    
    // Verificar se o Firebase está disponível
    const firebaseDisponivel = () => {
        return !!(firebase && firebase.firestore);
    };
    
    // Verificar se estamos no modo offline
    const modoOffline = () => {
        return localStorage.getItem('offline_mode') === 'true';
    };
    
    // Gerar ID único
    const gerarId = () => {
        return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    };
    
    // Salvar ensaio
    const salvarEnsaio = async (tipo, dados) => {
        console.log(`Salvando ensaio do tipo ${tipo}:`, dados);
        
        // Adicionar metadados
        const agora = new Date();
        const metadados = {
            tipo: tipo,
            dataCriacao: agora.toISOString(),
            dataAtualizacao: agora.toISOString()
        };
        
        // Adicionar usuário se autenticado
        if (window.calculadora.auth && window.calculadora.auth.isAuthenticated()) {
            const usuario = window.calculadora.auth.getCurrentUser();
            metadados.usuarioId = usuario.uid;
            metadados.usuarioNome = usuario.displayName || usuario.email;
        }
        
        // Combinar dados e metadados
        const dadosCompletos = { ...dados, ...metadados };
        
        try {
            // Verificar se o Firebase está disponível
            if (firebaseDisponivel()) {
                // Salvar no Firestore
                const db = firebase.firestore();
                
                if (dados.id) {
                    // Atualizar documento existente
                    await db.collection(COLECAO_ENSAIOS).doc(dados.id).update({
                        ...dadosCompletos,
                        dataAtualizacao: agora.toISOString()
                    });
                    console.log(`Ensaio ${dados.id} atualizado com sucesso no Firestore`);
                    return dados.id;
                } else {
                    // Criar novo documento
                    const docRef = await db.collection(COLECAO_ENSAIOS).add(dadosCompletos);
                    console.log(`Novo ensaio criado com ID ${docRef.id} no Firestore`);
                    return docRef.id;
                }
            } else if (modoOffline()) {
                // Salvar no localStorage (modo offline)
                const chave = `ensaios_${tipo}`;
                const ensaiosOffline = JSON.parse(localStorage.getItem(chave) || '[]');
                
                if (dados.id) {
                    // Atualizar ensaio existente
                    const index = ensaiosOffline.findIndex(item => item.id === dados.id);
                    if (index !== -1) {
                        ensaiosOffline[index] = {
                            ...dadosCompletos,
                            dataAtualizacao: agora.toISOString()
                        };
                    } else {
                        console.warn(`Ensaio ${dados.id} não encontrado no armazenamento offline`);
                        return null;
                    }
                } else {
                    // Criar novo ensaio
                    const novoId = gerarId();
                    ensaiosOffline.push({
                        ...dadosCompletos,
                        id: novoId
                    });
                    console.log(`Novo ensaio criado com ID ${novoId} no armazenamento offline`);
                    dados.id = novoId;
                }
                
                // Salvar no localStorage
                localStorage.setItem(chave, JSON.stringify(ensaiosOffline));
                return dados.id;
            } else {
                throw new Error('Não é possível salvar: Firebase indisponível e modo offline não ativado');
            }
        } catch (error) {
            console.error('Erro ao salvar ensaio:', error);
            throw error;
        }
    };
    
    // Buscar ensaio por ID
    const buscarEnsaioPorId = async (id) => {
        console.log(`Buscando ensaio com ID ${id}`);
        
        try {
            // Verificar se o Firebase está disponível
            if (firebaseDisponivel()) {
                // Buscar do Firestore
                const doc = await firebase.firestore().collection(COLECAO_ENSAIOS).doc(id).get();
                
                if (doc.exists) {
                    console.log(`Ensaio ${id} encontrado no Firestore`);
                    return { id: doc.id, ...doc.data() };
                } else {
                    console.warn(`Ensaio ${id} não encontrado no Firestore`);
                    return null;
                }
            } else if (modoOffline()) {
                // Buscar do localStorage (modo offline)
                // Como não sabemos o tipo, precisamos verificar todas as coleções
                const tipos = ['in-situ', 'real', 'max-min'];
                
                for (const tipo of tipos) {
                    const chave = `ensaios_${tipo}`;
                    const ensaiosOffline = JSON.parse(localStorage.getItem(chave) || '[]');
                    const ensaio = ensaiosOffline.find(item => item.id === id);
                    
                    if (ensaio) {
                        console.log(`Ensaio ${id} encontrado no armazenamento offline (tipo: ${tipo})`);
                        return ensaio;
                    }
                }
                
                console.warn(`Ensaio ${id} não encontrado no armazenamento offline`);
                return null;
            } else {
                throw new Error('Não é possível buscar: Firebase indisponível e modo offline não ativado');
            }
        } catch (error) {
            console.error(`Erro ao buscar ensaio ${id}:`, error);
            throw error;
        }
    };
    
    // Buscar ensaios por tipo
    const buscarEnsaiosPorTipo = async (tipo, filtros = {}) => {
        console.log(`Buscando ensaios do tipo ${tipo} com filtros:`, filtros);
        
        try {
            // Verificar se o Firebase está disponível
            if (firebaseDisponivel()) {
                // Buscar do Firestore
                let query = firebase.firestore().collection(COLECAO_ENSAIOS).where('tipo', '==', tipo);
                
                // Aplicar filtros
                Object.entries(filtros).forEach(([campo, valor]) => {
                    if (valor) {
                        query = query.where(campo, '==', valor);
                    }
                });
                
                // Executar consulta
                const snapshot = await query.get();
                const ensaios = [];
                
                snapshot.forEach(doc => {
                    ensaios.push({ id: doc.id, ...doc.data() });
                });
                
                console.log(`${ensaios.length} ensaios encontrados no Firestore`);
                return ensaios;
            } else if (modoOffline()) {
                // Buscar do localStorage (modo offline)
                const chave = `ensaios_${tipo}`;
                const ensaiosOffline = JSON.parse(localStorage.getItem(chave) || '[]');
                
                // Aplicar filtros
                const ensaiosFiltrados = ensaiosOffline.filter(ensaio => {
                    let corresponde = true;
                    
                    Object.entries(filtros).forEach(([campo, valor]) => {
                        if (valor && ensaio[campo] !== valor) {
                            corresponde = false;
                        }
                    });
                    
                    return corresponde;
                });
                
                console.log(`${ensaiosFiltrados.length} ensaios encontrados no armazenamento offline`);
                return ensaiosFiltrados;
            } else {
                throw new Error('Não é possível buscar: Firebase indisponível e modo offline não ativado');
            }
        } catch (error) {
            console.error(`Erro ao buscar ensaios do tipo ${tipo}:`, error);
            throw error;
        }
    };
    
    // Excluir ensaio
    const excluirEnsaio = async (id) => {
        console.log(`Excluindo ensaio com ID ${id}`);
        
        try {
            // Verificar se o Firebase está disponível
            if (firebaseDisponivel()) {
                // Excluir do Firestore
                await firebase.firestore().collection(COLECAO_ENSAIOS).doc(id).delete();
                console.log(`Ensaio ${id} excluído com sucesso do Firestore`);
                return true;
            } else if (modoOffline()) {
                // Excluir do localStorage (modo offline)
                // Como não sabemos o tipo, precisamos verificar todas as coleções
                const tipos = ['in-situ', 'real', 'max-min'];
                let excluido = false;
                
                for (const tipo of tipos) {
                    const chave = `ensaios_${tipo}`;
                    const ensaiosOffline = JSON.parse(localStorage.getItem(chave) || '[]');
                    const index = ensaiosOffline.findIndex(item => item.id === id);
                    
                    if (index !== -1) {
                        ensaiosOffline.splice(index, 1);
                        localStorage.setItem(chave, JSON.stringify(ensaiosOffline));
                        console.log(`Ensaio ${id} excluído com sucesso do armazenamento offline (tipo: ${tipo})`);
                        excluido = true;
                        break;
                    }
                }
                
                if (!excluido) {
                    console.warn(`Ensaio ${id} não encontrado para exclusão no armazenamento offline`);
                }
                
                return excluido;
            } else {
                throw new Error('Não é possível excluir: Firebase indisponível e modo offline não ativado');
            }
        } catch (error) {
            console.error(`Erro ao excluir ensaio ${id}:`, error);
            throw error;
        }
    };
    
    // Sincronizar dados offline com o Firebase
    const sincronizarDadosOffline = async () => {
        if (!firebaseDisponivel()) {
            console.warn('Firebase não disponível para sincronização');
            return { sucesso: false, mensagem: 'Firebase não disponível' };
        }
        
        console.log('Iniciando sincronização de dados offline com o Firebase');
        
        try {
            const tipos = ['in-situ', 'real', 'max-min'];
            let totalSincronizado = 0;
            
            for (const tipo of tipos) {
                const chave = `ensaios_${tipo}`;
                const ensaiosOffline = JSON.parse(localStorage.getItem(chave) || '[]');
                
                if (ensaiosOffline.length === 0) {
                    console.log(`Nenhum ensaio offline do tipo ${tipo} para sincronizar`);
                    continue;
                }
                
                console.log(`Sincronizando ${ensaiosOffline.length} ensaios offline do tipo ${tipo}`);
                
                const db = firebase.firestore();
                const batch = db.batch();
                let batchCount = 0;
                
                for (const ensaio of ensaiosOffline) {
                    // Remover o ID do objeto para não duplicar no Firestore
                    const { id, ...dadosSemId } = ensaio;
                    
                    // Adicionar metadados de sincronização
                    const dadosComSincronizacao = {
                        ...dadosSemId,
                        sincronizadoEm: new Date().toISOString(),
                        origemSincronizacao: 'offline'
                    };
                    
                    // Adicionar ao batch
                    const docRef = id.startsWith('id_')
                        ? db.collection(COLECAO_ENSAIOS).doc() // ID temporário, criar novo
                        : db.collection(COLECAO_ENSAIOS).doc(id); // ID do Firebase, atualizar
                    
                    batch.set(docRef, dadosComSincronizacao, { merge: true });
                    batchCount++;
                    
                    // Firestore tem limite de 500 operações por batch
                    if (batchCount >= 450) {
                        await batch.commit();
                        console.log(`Batch de ${batchCount} ensaios sincronizado`);
                        totalSincronizado += batchCount;
                        batchCount = 0;
                    }
                }
                
                // Commit do batch final
                if (batchCount > 0) {
                    await batch.commit();
                    console.log(`Batch final de ${batchCount} ensaios sincronizado`);
                    totalSincronizado += batchCount;
                }
                
                // Limpar dados offline após sincronização bem-sucedida
                localStorage.removeItem(chave);
                console.log(`Dados offline do tipo ${tipo} limpos após sincronização`);
            }
            
            console.log(`Sincronização concluída: ${totalSincronizado} ensaios sincronizados`);
            return {
                sucesso: true,
                mensagem: `${totalSincronizado} ensaios sincronizados com sucesso`,
                totalSincronizado
            };
        } catch (error) {
            console.error('Erro durante a sincronização:', error);
            return {
                sucesso: false,
                mensagem: `Erro durante a sincronização: ${error.message}`,
                erro: error
            };
        }
    };
    
    // API pública
    return {
        salvarEnsaio,
        buscarEnsaioPorId,
        buscarEnsaiosPorTipo,
        excluirEnsaio,
        sincronizarDadosOffline,
        firebaseDisponivel,
        modoOffline
    };
})();
