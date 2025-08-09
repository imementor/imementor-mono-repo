export interface LoginUser {
    uid: string;
    email: string;
    displayName?: string;
    firstName?: string;
    lastName?: string;
    userRole: 'mentor' | 'mentee' | 'admin';
    createdAt: string; // ISO date string
    emailVerified: boolean;
    firstTimeLogin?: boolean; // Tracks if this is the user's first login
    lastLoginAt?: string; // ISO date string of last login

}