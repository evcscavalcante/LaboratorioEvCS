/**
 * Módulo de autenticação com Firebase para o Laboratório Ev.C.S.
 * Implementa login, registro, recuperação de senha e controle de acesso.
 */

// Namespace para calculadora
window.calculadora = window.calculadora || {};

// Módulo de autenticação
window.calculadora.auth = (() => {
    // Configuração do Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyCmzJ4uB_b85aIz8WUNbwApB0ibhU78uEY",
        authDomain: "laboratorio-evcs.firebaseapp.com",
        projectId: "laboratorio-evcs",
        storageBucket: "laboratorio-evcs.firebasestorage.app",
        messagingSenderId: "53045134219",
        appId: "1:53045134219:web:e80d49f77f58870ac8e58e",
        measurementId: "G-R8M9D9H8XB"
    };
    
    // Estado de autenticação
    let currentUser = null;
    let userRole = null;
    
    // Evento de mudança de estado de autenticação
    const authStateListeners = [];
    
    // Inicializar Firebase
    const initializeFirebase = (config) => {
        try {
            // Usar configuração padrão se não fornecida
            const configToUse = config || firebaseConfig;
            
            // Inicializar Firebase se ainda não estiver inicializado
            if (!firebase.apps.length) {
                firebase.initializeApp(configToUse);
            }
            
            // Configurar listener de estado de autenticação
            firebase.auth().onAuthStateChanged(handleAuthStateChange);
            
            console.log('Firebase Authentication inicializado com sucesso');
            return true;
        } catch (error) {
            console.error('Erro ao inicializar Firebase Authentication:', error);
            return false;
        }
    };
    
    // Manipular mudança de estado de autenticação
    const handleAuthStateChange = async (user) => {
        if (user) {
            // Usuário autenticado
            try {
                // Obter token ID
                const idToken = await user.getIdToken();
                
                // Obter claims personalizadas
                const idTokenResult = await user.getIdTokenResult();
                userRole = idTokenResult.claims.role || 'visualizador';
                
                // Salvar usuário atual
                currentUser = {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName || 'Usuário',
                    role: userRole
                };
                
                // Salvar token no localStorage
                localStorage.setItem('auth_token', idToken);
                
                // Configurar token para API
                if (window.calculadora.api) {
                    window.calculadora.api.setAuthToken(idToken);
                }
                
                console.log('Usuário autenticado:', currentUser);
            } catch (error) {
                console.error('Erro ao processar autenticação:', error);
                currentUser = null;
                userRole = null;
            }
        } else {
            // Usuário não autenticado
            currentUser = null;
            userRole = null;
            localStorage.removeItem('auth_token');
            
            // Limpar token da API
            if (window.calculadora.api) {
                window.calculadora.api.setAuthToken(null);
            }
            
            console.log('Usuário desconectado');
        }
        
        // Notificar listeners
        notifyAuthStateListeners();
    };
    
    // Notificar listeners de mudança de estado
    const notifyAuthStateListeners = () => {
        authStateListeners.forEach(listener => {
            try {
                listener(currentUser);
            } catch (error) {
                console.error('Erro em listener de autenticação:', error);
            }
        });
    };
    
    // Adicionar listener de estado de autenticação
    const addAuthStateListener = (listener) => {
        if (typeof listener === 'function') {
            authStateListeners.push(listener);
            
            // Notificar imediatamente com o estado atual
            try {
                listener(currentUser);
            } catch (error) {
                console.error('Erro em listener de autenticação:', error);
            }
        }
    };
    
    // Remover listener de estado de autenticação
    const removeAuthStateListener = (listener) => {
        const index = authStateListeners.indexOf(listener);
        if (index !== -1) {
            authStateListeners.splice(index, 1);
        }
    };
    
    // Login com email e senha
    const loginWithEmailAndPassword = async (email, senha) => {
        if (!firebase.apps.length) {
            throw new Error('Firebase não inicializado');
        }
        
        try {
            const result = await firebase.auth().signInWithEmailAndPassword(email, senha);
            return result.user;
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            
            // Traduzir mensagens de erro do Firebase
            let errorMessage = 'Erro ao fazer login';
            switch (error.code) {
                case 'auth/invalid-email':
                    errorMessage = 'Email inválido';
                    break;
                case 'auth/user-disabled':
                    errorMessage = 'Usuário desativado';
                    break;
                case 'auth/user-not-found':
                    errorMessage = 'Usuário não encontrado';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Senha incorreta';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Muitas tentativas de login. Tente novamente mais tarde';
                    break;
            }
            
            throw new Error(errorMessage);
        }
    };
    
    // Registrar novo usuário
    const registerWithEmailAndPassword = async (nome, email, senha) => {
        if (!firebase.apps.length) {
            throw new Error('Firebase não inicializado');
        }
        
        try {
            // Criar usuário no Firebase
            const result = await firebase.auth().createUserWithEmailAndPassword(email, senha);
            
            // Atualizar perfil com nome
            await result.user.updateProfile({
                displayName: nome
            });
            
            // Registrar no backend
            if (window.calculadora.api) {
                try {
                    // Obter token ID
                    const idToken = await result.user.getIdToken();
                    
                    // Configurar token para API
                    window.calculadora.api.setAuthToken(idToken);
                    
                    // Registrar no backend
                    await fetch('/api/users', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-auth-token': idToken
                        },
                        body: JSON.stringify({
                            nome,
                            email,
                            tipo: 'visualizador' // Tipo padrão para novos usuários
                        })
                    });
                } catch (backendError) {
                    console.error('Erro ao registrar no backend:', backendError);
                    // Continuar mesmo com erro no backend
                }
            }
            
            return result.user;
        } catch (error) {
            console.error('Erro ao registrar usuário:', error);
            
            // Traduzir mensagens de erro do Firebase
            let errorMessage = 'Erro ao registrar usuário';
            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'Email já está em uso';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Email inválido';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'Senha muito fraca';
                    break;
                case 'auth/operation-not-allowed':
                    errorMessage = 'Operação não permitida';
                    break;
            }
            
            throw new Error(errorMessage);
        }
    };
    
    // Logout
    const logout = async () => {
        if (!firebase.apps.length) {
            throw new Error('Firebase não inicializado');
        }
        
        try {
            await firebase.auth().signOut();
            return true;
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            throw error;
        }
    };
    
    // Recuperar senha
    const resetPassword = async (email) => {
        if (!firebase.apps.length) {
            throw new Error('Firebase não inicializado');
        }
        
        try {
            await firebase.auth().sendPasswordResetEmail(email);
            return true;
        } catch (error) {
            console.error('Erro ao enviar email de recuperação de senha:', error);
            
            // Traduzir mensagens de erro do Firebase
            let errorMessage = 'Erro ao enviar email de recuperação de senha';
            switch (error.code) {
                case 'auth/invalid-email':
                    errorMessage = 'Email inválido';
                    break;
                case 'auth/user-not-found':
                    errorMessage = 'Usuário não encontrado';
                    break;
            }
            
            throw new Error(errorMessage);
        }
    };
    
    // Verificar se está autenticado
    const isAuthenticated = () => {
        return !!currentUser;
    };
    
    // Obter usuário atual
    const getCurrentUser = () => {
        return currentUser;
    };
    
    // Verificar se o usuário tem determinado papel
    const hasRole = (role) => {
        if (!currentUser) return false;
        
        if (Array.isArray(role)) {
            return role.includes(userRole);
        }
        
        return userRole === role;
    };
    
    // Verificar se o usuário é administrador
    const isAdmin = () => {
        return hasRole('admin');
    };
    
    // Verificar se o usuário é técnico
    const isTecnico = () => {
        return hasRole('tecnico') || hasRole('admin');
    };
    
    // Inicializar automaticamente
    (() => {
        // Tentar inicializar Firebase
        initializeFirebase();
        
        // Tentar restaurar sessão do localStorage
        const token = localStorage.getItem('auth_token');
        if (token) {
            // Token encontrado, verificar com Firebase
            firebase.auth().onAuthStateChanged((user) => {
                if (!user) {
                    // Token inválido ou expirado, limpar
                    localStorage.removeItem('auth_token');
                }
            });
        }
    })();
    
    // API pública
    return {
        initializeFirebase,
        loginWithEmailAndPassword,
        registerWithEmailAndPassword,
        logout,
        resetPassword,
        isAuthenticated,
        getCurrentUser,
        hasRole,
        isAdmin,
        isTecnico,
        addAuthStateListener,
        removeAuthStateListener
    };
})();
