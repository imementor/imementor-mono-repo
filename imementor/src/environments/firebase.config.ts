// Firebase configuration
// Replace these values with your actual Firebase project configuration
export const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id",
  measurementId: "your-measurement-id" // Optional, for Google Analytics
};

// Authentication providers configuration
export const authProvidersConfig = {
  google: true,
  facebook: true,
  twitter: false,
  github: false,
  microsoft: false,
  apple: false
};

// Authentication settings
export const authSettings = {
  enablePersistence: true,
  enableMultiFactorAuth: false,
  passwordRequirements: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true
  }
};
