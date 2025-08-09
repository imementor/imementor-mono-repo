import { Injectable, inject } from '@angular/core';
import { 
  Auth, 
  authState,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  User,
  UserCredential,
  sendEmailVerification,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from '@angular/fire/auth';
import { 
  Firestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  DocumentReference 
} from '@angular/fire/firestore';
import { Observable, BehaviorSubject, from, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { LoginUser } from '../../shared/models/interfaces/login-user.interface';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  isAnonymous: boolean;
  userRole?: 'mentor' | 'mentee';
  firstTimeLogin?: boolean;
  lastLoginAt?: string;
  metadata: {
    creationTime?: string;
    lastSignInTime?: string;
  };
}

export interface SignUpData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  displayName?: string; // This will be constructed from firstName + lastName
  userRole: 'mentor' | 'mentee';
}

export interface SignInData {
  email: string;
  password: string;
  userRole: 'mentor' | 'mentee';
}

export interface AuthError {
  code: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  // Public observables
  public readonly user$ = this.currentUserSubject.asObservable();
  public readonly loading$ = this.loadingSubject.asObservable();
  public readonly isAuthenticated$ = this.user$.pipe(map(user => !!user));
  public readonly isEmailVerified$ = this.user$.pipe(map(user => user?.emailVerified ?? false));

  constructor() {
    // Listen to auth state changes
    authState(this.auth).subscribe(async (user) => {
      if (user) {
        // Get user data from Firestore
        const userDoc = await getDoc(doc(this.firestore, 'users', user.uid));
        const userData = userDoc.data();
        
        const authUser = this.mapFirebaseUserToAuthUser(user);
        authUser.userRole = userData?.['userRole'] || undefined;
        authUser.firstTimeLogin = userData?.['firstTimeLogin'] || false;
        authUser.lastLoginAt = userData?.['lastLoginAt'] || undefined;
        
        this.currentUserSubject.next(authUser);
      } else {
        this.currentUserSubject.next(null);
      }
      this.loadingSubject.next(false);
    });
  }

  // Get current user
  getCurrentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  // Get user role
  getUserRole(): 'mentor' | 'mentee' | null {
    const currentUser = this.getCurrentUser();
    return currentUser?.userRole || null;
  }

  // Check if user is mentor
  isMentor(): boolean {
    return this.getUserRole() === 'mentor';
  }

  // Check if user is mentee
  isMentee(): boolean {
    return this.getUserRole() === 'mentee';
  }

  // Sign up with email and password
  signUp(data: SignUpData): Observable<UserCredential> {
    this.loadingSubject.next(true);
    
    return from(createUserWithEmailAndPassword(this.auth, data.email, data.password))
      .pipe(
        switchMap(credential => {
          // Construct display name from firstName and lastName if provided
          let displayName = data.displayName;
          if (!displayName && (data.firstName || data.lastName)) {
            displayName = `${data.firstName || ''} ${data.lastName || ''}`.trim();
          }
          
          // Update display name if we have one
          if (displayName && credential.user) {
            return from(updateProfile(credential.user, { displayName }))
              .pipe(map(() => credential));
          }
          return [credential];
        }),
        switchMap(credential => {
          // Save user data to Firestore
          if (credential.user) {
            const userData: LoginUser = {
              uid: credential.user.uid,
              email: credential.user.email || '',
              displayName: credential.user.displayName || '',
              firstName: data.firstName || '',
              lastName: data.lastName || '',
              userRole: data.userRole,
              createdAt: new Date().toISOString(),
              emailVerified: false,
              firstTimeLogin: true, // Mark as first time login for new signups
              lastLoginAt: new Date().toISOString()
            };
            
            return from(setDoc(doc(this.firestore, 'users', credential.user.uid), userData))
              .pipe(map(() => credential));
          }
          return [credential];
        }),
        switchMap(credential => {
          // Send email verification
          if (credential.user) {
            return from(sendEmailVerification(credential.user))
              .pipe(map(() => credential));
          }
          return [credential];
        }),
        catchError(error => {
          this.loadingSubject.next(false);
          const contextualError = {
            code: error.code,
            message: this.getContextualErrorMessage(error, 'signup')
          };
          return throwError(() => contextualError);
        })
      );
  }

  // Sign in with email and password
  signIn(data: SignInData): Observable<UserCredential> {
    this.loadingSubject.next(true);
    
    return from(signInWithEmailAndPassword(this.auth, data.email, data.password))
      .pipe(
        switchMap(async (credential) => {
          // Verify user role after successful authentication
          if (credential.user) {
            const userDocRef = doc(this.firestore, 'users', credential.user.uid);
            const userDoc = await getDoc(userDocRef);
            const userData = userDoc.data();
            const userRole = userData?.['userRole'];
            
            if (!userRole) {
              // User doesn't have a role assigned (social login user)
              // Sign out and throw error asking them to complete registration
              await signOut(this.auth);
              const roleError = {
                code: 'auth/role-not-set',
                message: 'Please complete your profile by selecting your role first. Contact support if you need assistance.'
              };
              throw roleError;
            }
            
            if (userRole !== data.userRole) {
              // Sign out the user since they're trying to login with wrong role
              await signOut(this.auth);
              const roleDisplayName = userRole === 'mentor' ? 'Mentor' : 'Mentee';
              const attemptedRoleDisplayName = data.userRole === 'mentor' ? 'Mentor' : 'Mentee';
              const roleError = {
                code: 'auth/wrong-role',
                message: `You cannot sign in as a ${attemptedRoleDisplayName} because your account is registered as a ${roleDisplayName}. Please select the correct role to continue.`
              };
              throw roleError;
            }

            // Update login tracking
            await this.updateLoginTracking(credential.user.uid);
          }
          return credential;
        }),
        catchError(error => {
          this.loadingSubject.next(false);
          const contextualError = {
            code: error.code,
            message: this.getContextualErrorMessage(error, 'signin')
          };
          return throwError(() => contextualError);
        })
      );
  }

  // Sign in with Google
  signInWithGoogle(userRole?: 'mentor' | 'mentee'): Observable<UserCredential> {
    this.loadingSubject.next(true);
    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    
    return from(signInWithPopup(this.auth, provider))
      .pipe(
        switchMap(async (credential) => {
          // Check if user exists in Firestore, create if not
          if (credential.user) {
            const userDoc = await getDoc(doc(this.firestore, 'users', credential.user.uid));
            
            if (!userDoc.exists()) {
              // Create user document for new social login users
              const userData: LoginUser = {
                uid: credential.user.uid,
                email: credential.user.email || '',
                displayName: credential.user.displayName || '',
                firstName: credential.user.displayName?.split(' ')[0] || '',
                lastName: credential.user.displayName?.split(' ').slice(1).join(' ') || '',
                userRole: userRole || ('mentor' as 'mentor' | 'mentee'), // Will be handled properly later
                createdAt: new Date().toISOString(),
                emailVerified: credential.user.emailVerified,
                firstTimeLogin: true, // Mark as first time login
                lastLoginAt: new Date().toISOString()
              };
              
              await setDoc(doc(this.firestore, 'users', credential.user.uid), userData);
            } else {
              // Update login tracking for existing users
              await this.updateLoginTracking(credential.user.uid);
            }
          }
          return credential;
        }),
        catchError(error => {
          this.loadingSubject.next(false);
          const contextualError = {
            code: error.code,
            message: this.getContextualErrorMessage(error, 'social')
          };
          return throwError(() => contextualError);
        })
      );
  }

  // Sign in with Facebook
  signInWithFacebook(userRole?: 'mentor' | 'mentee'): Observable<UserCredential> {
    this.loadingSubject.next(true);
    const provider = new FacebookAuthProvider();
    provider.addScope('email');
    
    return from(signInWithPopup(this.auth, provider))
      .pipe(
        switchMap(async (credential) => {
          // Check if user exists in Firestore, create if not
          if (credential.user) {
            const userDoc = await getDoc(doc(this.firestore, 'users', credential.user.uid));
            
            if (!userDoc.exists()) {
              // Create user document for new social login users
              const userData: LoginUser = {
                uid: credential.user.uid,
                email: credential.user.email || '',
                displayName: credential.user.displayName || '',
                firstName: credential.user.displayName?.split(' ')[0] || '',
                lastName: credential.user.displayName?.split(' ').slice(1).join(' ') || '',
                userRole: userRole || ('mentor' as 'mentor' | 'mentee'), // Will be handled properly later
                createdAt: new Date().toISOString(),
                emailVerified: credential.user.emailVerified,
                firstTimeLogin: true, // Mark as first time login
                lastLoginAt: new Date().toISOString()
              };
              
              await setDoc(doc(this.firestore, 'users', credential.user.uid), userData);
            } else {
              // Update login tracking for existing users
              await this.updateLoginTracking(credential.user.uid);
            }
          }
          return credential;
        }),
        catchError(error => {
          this.loadingSubject.next(false);
          const contextualError = {
            code: error.code,
            message: this.getContextualErrorMessage(error, 'social')
          };
          return throwError(() => contextualError);
        })
      );
  }

  // Sign out
  signOut(): Observable<void> {
    this.loadingSubject.next(true);
    
    return from(signOut(this.auth))
      .pipe(
        catchError(error => {
          this.loadingSubject.next(false);
          return throwError(() => this.handleAuthError(error));
        })
      );
  }

  // Send password reset email
  sendPasswordResetEmail(email: string): Observable<void> {
    return from(sendPasswordResetEmail(this.auth, email))
      .pipe(
        catchError(error => {
          const contextualError = {
            code: error.code,
            message: this.getContextualErrorMessage(error, 'reset')
          };
          return throwError(() => contextualError);
        })
      );
  }

  // Send email verification
  sendEmailVerification(): Observable<void> {
    const user = this.auth.currentUser;
    if (!user) {
      return throwError(() => ({ code: 'auth/no-user', message: 'No user is currently signed in' }));
    }

    return from(sendEmailVerification(user))
      .pipe(
        catchError(error => throwError(() => this.handleAuthError(error)))
      );
  }

  // Update user profile
  updateUserProfile(profile: { displayName?: string; photoURL?: string }): Observable<void> {
    const user = this.auth.currentUser;
    if (!user) {
      return throwError(() => ({ code: 'auth/no-user', message: 'No user is currently signed in' }));
    }

    return from(updateProfile(user, profile))
      .pipe(
        catchError(error => throwError(() => this.handleAuthError(error)))
      );
  }

  // Update password
  updatePassword(newPassword: string, currentPassword: string): Observable<void> {
    const user = this.auth.currentUser;
    if (!user || !user.email) {
      return throwError(() => ({ code: 'auth/no-user', message: 'No user is currently signed in' }));
    }

    // Re-authenticate user before updating password
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    
    return from(reauthenticateWithCredential(user, credential))
      .pipe(
        switchMap(() => from(updatePassword(user, newPassword))),
        catchError(error => throwError(() => this.handleAuthError(error)))
      );
  }

  // Check if user needs to set their role (for social login users)
  async userNeedsRoleSelection(): Promise<boolean> {
    const currentUser = this.auth.currentUser;
    if (!currentUser) return false;
    
    try {
      const userDoc = await getDoc(doc(this.firestore, 'users', currentUser.uid));
      const userData = userDoc.data();
      return !userData?.['userRole'];
    } catch (error) {
      console.error('Error checking user role status:', error);
      return false;
    }
  }

  // Update user role (for social login users or role changes)
  updateUserRole(role: 'mentor' | 'mentee'): Observable<void> {
    const currentUser = this.auth.currentUser;
    if (!currentUser) {
      return throwError(() => ({ 
        code: 'auth/no-user', 
        message: 'No user is currently signed in' 
      }));
    }

    const userRef = doc(this.firestore, 'users', currentUser.uid);
    return from(setDoc(userRef, { userRole: role }, { merge: true }))
      .pipe(
        switchMap(() => {
          // Update local user state
          const currentAuthUser = this.getCurrentUser();
          if (currentAuthUser) {
            currentAuthUser.userRole = role;
            this.currentUserSubject.next(currentAuthUser);
          }
          return [undefined];
        }),
        catchError(error => {
          console.error('Error updating user role:', error);
          return throwError(() => ({
            code: 'auth/update-role-failed',
            message: 'Failed to update user role. Please try again.'
          }));
        })
      );
  }

  // Get user data from Firestore
  async getUserData(): Promise<LoginUser | null> {
    const currentUser = this.auth.currentUser;
    if (!currentUser) return null;
    
    try {
      const userDoc = await getDoc(doc(this.firestore, 'users', currentUser.uid));
      return userDoc.exists() ? userDoc.data() as LoginUser : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  // Check if this is user's first time login
  async isFirstTimeLogin(): Promise<boolean> {
    const currentUser = this.auth.currentUser;
    if (!currentUser) return false;
    
    try {
      const userDoc = await getDoc(doc(this.firestore, 'users', currentUser.uid));
      const userData = userDoc.data();
      return userData?.['firstTimeLogin'] !== false; // Default to true for existing users without this field
    } catch (error) {
      console.error('Error checking first time login status:', error);
      return false;
    }
  }

  // Get first time login status for current user
  async getFirstTimeLoginStatus(): Promise<boolean> {
    const currentUser = this.auth.currentUser;
    if (!currentUser) return false;
    
    try {
      const userDoc = await getDoc(doc(this.firestore, 'users', currentUser.uid));
      const userData = userDoc.data();
      return userData?.['firstTimeLogin'] === true;
    } catch (error) {
      console.error('Error checking first time login status:', error);
      return false;
    }
  }

  // Mark first time login as complete (useful for onboarding completion)
  async markFirstTimeLoginComplete(): Promise<void> {
    const currentUser = this.auth.currentUser;
    if (!currentUser) throw new Error('No user is currently signed in');
    
    try {
      const userDocRef = doc(this.firestore, 'users', currentUser.uid);
      await setDoc(userDocRef, { firstTimeLogin: false }, { merge: true });
    } catch (error) {
      console.error('Error marking first time login as complete:', error);
      throw error;
    }
  }

  // Update user login tracking
  private async updateLoginTracking(userId: string): Promise<void> {
    try {
      const userDocRef = doc(this.firestore, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const isFirstTimeLogin = userData?.['firstTimeLogin'] !== false;
        
        const updateData: Partial<LoginUser> = {
          lastLoginAt: new Date().toISOString()
        };
        
        if (isFirstTimeLogin) {
          updateData.firstTimeLogin = false;
        }

        await setDoc(userDocRef, updateData, { merge: true });
      }
    } catch (error) {
      console.error('Error updating login tracking:', error);
    }
  }

  // Private helper methods
  private mapFirebaseUserToAuthUser(user: User): AuthUser {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      isAnonymous: user.isAnonymous,
      metadata: {
        creationTime: user.metadata.creationTime,
        lastSignInTime: user.metadata.lastSignInTime
      }
    };
  }

  private handleAuthError(error: any): AuthError {
    console.error('Firebase Auth Error:', error);
    
    // Map Firebase error codes to user-friendly messages
    const errorMessages: { [key: string]: string } = {
      // Sign-in errors
      'auth/user-not-found': 'No account found with this email address. Please check your email or create a new account.',
      'auth/wrong-password': 'Incorrect password. Please try again or reset your password.',
      'auth/invalid-login-credentials': 'Invalid email or password. Please check your credentials and try again.',
      'auth/invalid-credential': 'Invalid login credentials. Please check your email and password.',
      'auth/user-disabled': 'This account has been temporarily disabled. Please contact support.',
      'auth/too-many-requests': 'Too many failed login attempts. Please wait a few minutes before trying again.',
      'auth/wrong-role': 'Role mismatch. Please select the correct role for your account.',
      
      // Sign-up errors
      'auth/email-already-in-use': 'An account with this email address already exists. Please sign in instead.',
      'auth/weak-password': 'Password is too weak. Please use at least 6 characters with a mix of letters and numbers.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/operation-not-allowed': 'Email/password accounts are not enabled. Please contact support.',
      'auth/missing-email': 'Please enter your email address.',
      'auth/missing-password': 'Please enter your password.',
      
      // Network and system errors
      'auth/network-request-failed': 'Network connection error. Please check your internet connection and try again.',
      'auth/timeout': 'The request timed out. Please try again.',
      'auth/internal-error': 'An internal error occurred. Please try again later.',
      
      // Re-authentication errors
      'auth/requires-recent-login': 'For security reasons, please sign in again to complete this action.',
      'auth/credential-already-in-use': 'This credential is already associated with a different account.',
      
      // Social login errors
      'auth/popup-closed-by-user': 'Sign-in was cancelled. Please try again.',
      'auth/cancelled-popup-request': 'Sign-in request was cancelled.',
      'auth/popup-blocked': 'Sign-in popup was blocked. Please allow popups and try again.',
      'auth/account-exists-with-different-credential': 'An account already exists with the same email but different sign-in credentials.',
      
      // Email verification errors
      'auth/invalid-action-code': 'The verification link is invalid or has expired. Please request a new one.',
      'auth/expired-action-code': 'The verification link has expired. Please request a new one.',
      'auth/user-token-expired': 'Your session has expired. Please sign in again.',
      
      // General errors
      'auth/unauthorized-domain': 'This domain is not authorized for OAuth operations.',
      'auth/invalid-api-key': 'Authentication configuration error. Please contact support.',
      'auth/app-deleted': 'Application configuration error. Please contact support.',
      
      // Role-based authentication errors
      'auth/role-not-set': 'Your account role is not configured. Please complete your profile setup.',
      'auth/update-role-failed': 'Failed to update your account role. Please try again.'
    };

    // Get the error message or provide a fallback
    let message = errorMessages[error.code];
    
    if (!message) {
      // If no specific mapping found, try to clean up the Firebase error message
      if (error.message) {
        message = error.message
          .replace(/Firebase:/g, '')
          .replace(/\(auth\/[^)]+\)/g, '')
          .trim();
        
        // Capitalize first letter
        message = message.charAt(0).toUpperCase() + message.slice(1);
        
        // Add period if missing
        if (!message.endsWith('.')) {
          message += '.';
        }
      } else {
        message = 'An unexpected error occurred. Please try again.';
      }
    }

    return {
      code: error.code || 'auth/unknown',
      message: message
    };
  }

  // Helper method to get contextual error messages
  private getContextualErrorMessage(error: any, context: 'signin' | 'signup' | 'reset' | 'verify' | 'social'): string {
    const baseMessage = this.handleAuthError(error).message;
    
    // Add context-specific suggestions
    switch (context) {
      case 'signin':
        if (error.code === 'auth/user-not-found') {
          return 'No account found with this email. Would you like to create a new account?';
        }
        if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
          return 'Incorrect password. Try again or reset your password if you forgot it.';
        }
        if (error.code === 'auth/wrong-role') {
          return error.message; // Use the detailed role-specific message from the auth service
        }
        if (error.code === 'auth/role-not-set') {
          return 'Your account needs to be set up. Please contact support or try social login to complete your profile.';
        }
        break;
        
      case 'signup':
        if (error.code === 'auth/email-already-in-use') {
          return 'An account with this email already exists. Please sign in instead or use a different email.';
        }
        if (error.code === 'auth/weak-password') {
          return 'Please choose a stronger password with at least 6 characters, including letters and numbers.';
        }
        break;
        
      case 'reset':
        if (error.code === 'auth/user-not-found') {
          return 'No account found with this email address. Please check the spelling or create a new account.';
        }
        break;
        
      case 'social':
        if (error.code === 'auth/popup-blocked') {
          return 'Sign-in popup was blocked. Please enable popups for this site and try again.';
        }
        if (error.code === 'auth/popup-closed-by-user') {
          return 'Sign-in was cancelled. Click the button again to continue with social login.';
        }
        if (error.code === 'auth/wrong-role') {
          return error.message; // Use the detailed role-specific message from the auth service
        }
        break;
    }
    
    return baseMessage;
  }
}
