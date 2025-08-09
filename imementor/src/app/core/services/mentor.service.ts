import { Injectable, inject } from '@angular/core';
import { 
  Firestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  collection,
  DocumentReference,
  serverTimestamp
} from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Observable, from, throwError } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { Mentor } from '../../shared/models/interfaces/mentor.interface';

@Injectable({
  providedIn: 'root'
})
export class MentorService {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);

  constructor() {}

  /**
   * Create or update a mentor profile in Firestore
   */
  createOrUpdateMentorProfile(mentorData: Partial<Mentor>): Observable<void> {
    return this.authService.user$.pipe(
      switchMap(user => {
        if (!user?.uid) {
          return throwError(() => new Error('User not authenticated'));
        }

        // Prepare data with timestamps
        const dataToSave = {
          ...mentorData,
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          userRole: 'mentor',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };

        // Save to mentors collection
        const mentorDocRef = doc(this.firestore, 'mentors', user.uid);
        return from(setDoc(mentorDocRef, dataToSave, { merge: true }));
      }),
      catchError(error => {
        console.error('Error saving mentor profile:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get mentor profile by user ID
   */
  getMentorProfile(uid: string): Observable<Mentor | null> {
    const mentorDocRef = doc(this.firestore, 'mentors', uid);
    return from(getDoc(mentorDocRef)).pipe(
      map(docSnap => {
        if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() } as unknown as Mentor;
        }
        return null;
      }),
      catchError(error => {
        console.error('Error getting mentor profile:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Update specific fields of mentor profile
   */
  updateMentorProfile(uid: string, updates: Partial<Mentor>): Observable<void> {
    const mentorDocRef = doc(this.firestore, 'mentors', uid);
    const dataToUpdate = {
      ...updates,
      updatedAt: serverTimestamp()
    };

    return from(updateDoc(mentorDocRef, dataToUpdate)).pipe(
      catchError(error => {
        console.error('Error updating mentor profile:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Check if a mentor profile exists for the current user
   */
  checkMentorProfileExists(): Observable<boolean> {
    return this.authService.user$.pipe(
      switchMap(user => {
        if (!user?.uid) {
          return throwError(() => new Error('User not authenticated'));
        }

        const mentorDocRef = doc(this.firestore, 'mentors', user.uid);
        return from(getDoc(mentorDocRef)).pipe(
          map(docSnap => docSnap.exists())
        );
      }),
      catchError(error => {
        console.error('Error checking mentor profile existence:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Update mentor's online status
   */
  updateOnlineStatus(uid: string, status: boolean): Observable<void> {
    return this.updateMentorProfile(uid, { 
      onlineStatus: status
    });
  }

  /**
   * Update mentor's availability
   */
  updateAvailability(uid: string, availability: Mentor['availability']): Observable<void> {
    return this.updateMentorProfile(uid, { 
      availability
    });
  }
}
