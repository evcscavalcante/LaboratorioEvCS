import {
    handleLogin,
    handleRegistration,
    handlePasswordRecovery,
    handleOfflineLinkClick,
    handleAuthStateChange,
    showLoginForm,
    showRegisterForm,
    showPasswordRecoveryForm,
    setupFormSwitching
} from '../docs/js/login'; // Adjust path as needed

// Mock Firebase Auth
const mockFirebaseAuth = {
    createUserWithEmailAndPassword: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
    signOut: jest.fn(),
    onAuthStateChanged: jest.fn(),
    currentUser: null, // Initial state, can be changed in tests
};

// Mock the global firebase object to provide the mocked auth
global.firebase = {
    auth: () => mockFirebaseAuth,
};

// Mock the DOM elements
document.body.innerHTML = `
    <div id="login-container">
        <form id="login-form">
            <input type="email" id="login-email" value="test@example.com">
            <input type="password" id="login-password" value="password">
            <button type="submit">Login</button>
            <a href="#" id="forgot-password-link">Forgot Password?</a>
        </form>
        <form id="register-form" style="display: none;">
            <input type="email" id="register-email" value="test@example.com">
            <input type="password" id="register-password" value="password">
            <button type="submit">Register</button>
            <a href="#" id="back-to-login-from-register">Back to Login</a>
        </form>
        <form id="password-recovery-form" style="display: none;">
            <input type="email" id="recovery-email" value="test@example.com">
            <button type="submit">Recover Password</button>
            <a href="#" id="back-to-login-from-recovery">Back to Login</a>
        </form>
        <div id="login-status"></div>
        <a href="#" id="offline-link">Offline</a>
        <div id="login-tabs">
            <button id="login-tab" class="active">Login</button>
            <button id="register-tab">Register</button>
        </div>
    </div>
`;

describe('Login module tests', () => {
    let loginForm, registerForm, passwordRecoveryForm, loginStatus, loginEmail, loginPassword, registerEmail, registerPassword, recoveryEmail, forgotPasswordLink, backToLoginFromRegister, backToLoginFromRecovery, offlineLink, loginTab, registerTab;

    beforeEach(() => {
        // Reset mocks and clear form values before each test
        jest.clearAllMocks();
        loginForm = document.getElementById('login-form');
        registerForm = document.getElementById('register-form');
        passwordRecoveryForm = document.getElementById('password-recovery-form');
        loginStatus = document.getElementById('login-status');
        loginEmail = document.getElementById('login-email');
        loginPassword = document.getElementById('login-password');
        registerEmail = document.getElementById('register-email');
        registerPassword = document.getElementById('register-password');
        recoveryEmail = document.getElementById('recovery-email');
        forgotPasswordLink = document.getElementById('forgot-password-link');
        backToLoginFromRegister = document.getElementById('back-to-login-from-register');
        backToLoginFromRecovery = document.getElementById('back-to-login-from-recovery');
        offlineLink = document.getElementById('offline-link');
        loginTab = document.getElementById('login-tab');
        registerTab = document.getElementById('register-tab');


        // Set default form values
        loginEmail.value = 'test@example.com';
        loginPassword.value = 'password';
        registerEmail.value = 'test@example.com';
        registerPassword.value = 'password';
        recoveryEmail.value = 'test@example.com';

        // Reset display styles
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        passwordRecoveryForm.style.display = 'none';
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
    });

    describe('handleLogin', () => {
        test('should successfully log in a user', async () => {
            mockFirebaseAuth.signInWithEmailAndPassword.mockResolvedValue({
                user: {
                    uid: '123'
                }
            });

            await handleLogin(new Event('submit'));

            expect(mockFirebaseAuth.signInWithEmailAndPassword).toHaveBeenCalledWith('test@example.com', 'password');
            expect(loginStatus.textContent).toBe(''); // Assuming success clears status
        });

        test('should handle incorrect login credentials', async () => {
            const error = new Error('Incorrect password');
            mockFirebaseAuth.signInWithEmailAndPassword.mockRejectedValue(error);

            await handleLogin(new Event('submit'));

            expect(mockFirebaseAuth.signInWithEmailAndPassword).toHaveBeenCalledWith('test@example.com', 'password');
            expect(loginStatus.textContent).toBe('Login failed: Incorrect password');
        });

        test('should handle other login errors', async () => {
            const error = new Error('User not found');
            mockFirebaseAuth.signInWithEmailAndPassword.mockRejectedValue(error);

            await handleLogin(new Event('submit'));

            expect(mockFirebaseAuth.signInWithEmailAndPassword).toHaveBeenCalledWith('test@example.com', 'password');
            expect(loginStatus.textContent).toBe('Login failed: User not found');
        });
    });

    describe('handleRegistration', () => {
        test('should successfully register a new user', async () => {
            mockFirebaseAuth.createUserWithEmailAndPassword.mockResolvedValue({
                user: {
                    uid: '456'
                }
            });

            await handleRegistration(new Event('submit'));

            expect(mockFirebaseAuth.createUserWithEmailAndPassword).toHaveBeenCalledWith('test@example.com', 'password');
            expect(loginStatus.textContent).toBe(''); // Assuming success clears status
        });

        test('should handle registration errors', async () => {
            const error = new Error('Email already in use');
            mockFirebaseAuth.createUserWithEmailAndPassword.mockRejectedValue(error);

            await handleRegistration(new Event('submit'));

            expect(mockFirebaseAuth.createUserWithEmailAndPassword).toHaveBeenCalledWith('test@example.com', 'password');
            expect(loginStatus.textContent).toBe('Registration failed: Email already in use');
        });
    });

    describe('handlePasswordRecovery', () => {
        test('should successfully send a password reset email', async () => {
            mockFirebaseAuth.sendPasswordResetEmail.mockResolvedValue();

            await handlePasswordRecovery(new Event('submit'));

            expect(mockFirebaseAuth.sendPasswordResetEmail).toHaveBeenCalledWith('test@example.com');
            expect(loginStatus.textContent).toBe('Password reset email sent.');
        });

        test('should handle password recovery errors', async () => {
            const error = new Error('User not found');
            mockFirebaseAuth.sendPasswordResetEmail.mockRejectedValue(error);

            await handlePasswordRecovery(new Event('submit'));

            expect(mockFirebaseAuth.sendPasswordResetEmail).toHaveBeenCalledWith('test@example.com');
            expect(loginStatus.textContent).toBe('Password recovery failed: User not found');
        });
    });

    describe('Form Switching', () => {
        beforeEach(() => {
            setupFormSwitching(); // Setup event listeners
        });

        test('should switch to register form when register tab is clicked', () => {
            registerTab.click();

            expect(loginForm.style.display).toBe('none');
            expect(registerForm.style.display).toBe('block');
            expect(passwordRecoveryForm.style.display).toBe('none');
            expect(loginTab.classList.contains('active')).toBe(false);
            expect(registerTab.classList.contains('active')).toBe(true);
        });

        test('should switch to password recovery form when forgot password link is clicked', () => {
            forgotPasswordLink.click();

            expect(loginForm.style.display).toBe('none');
            expect(registerForm.style.display).toBe('none');
            expect(passwordRecoveryForm.style.display).toBe('block');
        });

        test('should switch back to login form from register form', () => {
            // First switch to register form
            registerTab.click();
            // Then click back to login link
            backToLoginFromRegister.click();

            expect(loginForm.style.display).toBe('block');
            expect(registerForm.style.display).toBe('none');
            expect(passwordRecoveryForm.style.display).toBe('none');
            expect(loginTab.classList.contains('active')).toBe(true);
            expect(registerTab.classList.contains('active')).toBe(false);
        });

        test('should switch back to login form from password recovery form', () => {
            // First switch to password recovery form
            forgotPasswordLink.click();
            // Then click back to login link
            backToLoginFromRecovery.click();

            expect(loginForm.style.display).toBe('block');
            expect(registerForm.style.display).toBe('none');
            expect(passwordRecoveryForm.style.display).toBe('none');
            expect(loginTab.classList.contains('active')).toBe(true);
            expect(registerTab.classList.contains('active')).toBe(false);
        });
    });

    describe('handleOfflineLinkClick', () => {
        test('should change window location to offline page', () => {
            delete window.location;
            window.location = {
                href: ''
            };

            handleOfflineLinkClick(new Event('click'));

            expect(window.location.href).toBe('./offline.html'); // Assuming offline.html is the target
        });
    });

    describe('handleAuthStateChange', () => {
        test('should redirect to dashboard when user is authenticated', () => {
            delete window.location;
            window.location = {
                href: ''
            };
            const user = {
                uid: '123'
            };

            handleAuthStateChange(user);

            expect(window.location.href).toBe('./dashboard.html'); // Assuming dashboard.html is the target
        });

        test('should not redirect when user is not authenticated', () => {
            delete window.location;
            window.location = {
                href: ''
            };
            const user = null;

            handleAuthStateChange(user);

            expect(window.location.href).toBe('');
        });
    });

    describe('showLoginForm', () => {
        test('should display login form and hide others', () => {
            // Ensure initial state is different for testing
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
            passwordRecoveryForm.style.display = 'block';

            showLoginForm();

            expect(loginForm.style.display).toBe('block');
            expect(registerForm.style.display).toBe('none');
            expect(passwordRecoveryForm.style.display).toBe('none');
        });
    });

    describe('showRegisterForm', () => {
        test('should display register form and hide others', () => {
            showRegisterForm();

            expect(loginForm.style.display).toBe('none');
            expect(registerForm.style.display).toBe('block');
            expect(passwordRecoveryForm.style.display).toBe('none');
        });
    });

    describe('showPasswordRecoveryForm', () => {
        test('should display password recovery form and hide others', () => {
            showPasswordRecoveryForm();

            expect(loginForm.style.display).toBe('none');
            expect(registerForm.style.display).toBe('none');
            expect(passwordRecoveryForm.style.display).toBe('block');
        });
    });
});