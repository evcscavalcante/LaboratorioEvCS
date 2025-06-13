import '@testing-library/jest-dom';
import { initializeTestEnvironment, RulesTestEnvironment } from '@firebase/rules-unit-testing';

// Mock environment variables for testing
process.env.VITE_FIREBASE_PROJECT_ID = 'test-project-id';
process.env.VITE_FIREBASE_API_KEY = 'test-api-key';
process.env.VITE_FIREBASE_APP_ID = 'test-app-id';

// Global test environment setup
let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'test-project-id',
    firestore: {
      rules: `
        rules_version = '2';
        service cloud.firestore {
          match /databases/{database}/documents {
            match /{document=**} {
              allow read, write: if true;
            }
          }
        }
      `,
    },
    auth: {
      uid: 'test-user',
      email: 'test@example.com',
    },
  });
});

afterAll(async () => {
  if (testEnv) {
    await testEnv.cleanup();
  }
});

// Mock Firebase modules
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => ({
    name: 'test-app',
    options: {},
  })),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({
    currentUser: {
      uid: 'test-user',
      email: 'test@example.com',
      displayName: 'Test User',
    },
  })),
  signInWithRedirect: jest.fn(),
  getRedirectResult: jest.fn(() => Promise.resolve(null)),
  GoogleAuthProvider: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({})),
  collection: jest.fn(),
  doc: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  getDocs: jest.fn(),
  getDoc: jest.fn(),
  onSnapshot: jest.fn(),
}));

// Mock IndexedDB for localStorage tests
const mockIndexedDB = {
  open: jest.fn(),
  deleteDatabase: jest.fn(),
};

Object.defineProperty(window, 'indexedDB', {
  value: mockIndexedDB,
  writable: true,
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));