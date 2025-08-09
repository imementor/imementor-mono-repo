import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, AuthError } from '../../core/services/auth.service';
import { MentorService } from '../../core/services/mentor.service';
import { Mentor } from '../../shared/models/interfaces/mentor.interface';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-mentor-setup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="mentor-setup-container">
      <div class="setup-header">
        <h1>Welcome to iMentor! 🎉</h1>
        <p>Let's set up your mentor profile to help mentees find and connect with you</p>
        
        <div class="progress-bar">
          <div class="progress-steps">
            <div 
              *ngFor="let step of steps; let i = index" 
              class="step"
              [class.active]="currentStep() === i"
              [class.completed]="currentStep() > i">
              <div class="step-number">{{ i + 1 }}</div>
              <span class="step-title">{{ step.title }}</span>
            </div>
          </div>
          <div class="progress-line" [style.width.%]="progressPercentage()"></div>
        </div>
      </div>

      <div class="setup-content">
        <div class="step-container" *ngIf="currentStep() === 0">
          <h2>Basic Information</h2>
          <p>Tell us about yourself</p>
          
          <form [formGroup]="basicInfoForm" class="setup-form">
            <div class="form-row">
              <div class="form-group">
                <label for="profilePicture">Profile Picture URL</label>
                <input 
                  type="url" 
                  id="profilePicture" 
                  formControlName="profilePicture"
                  class="form-control"
                  placeholder="https://example.com/your-photo.jpg">
              </div>
              
              <div class="form-group">
                <label for="location">Location</label>
                <input 
                  type="text" 
                  id="location" 
                  formControlName="location"
                  class="form-control"
                  placeholder="City, Country"
                  required>
              </div>
            </div>

            <div class="form-group">
              <label for="about">About You</label>
              <textarea 
                id="about" 
                formControlName="about"
                class="form-control"
                rows="4"
                placeholder="Tell mentees about yourself, your background, and what you're passionate about..."
                required></textarea>
            </div>

            <div class="form-group">
              <label for="expertise">Areas of Expertise</label>
              <input 
                type="text" 
                id="expertise" 
                formControlName="expertiseInput"
                class="form-control"
                placeholder="Add expertise area and press Enter"
                (keydown.enter)="addToArray('expertise', $event)">
              <div class="tags-container">
                <span 
                  *ngFor="let item of expertiseArray.controls; let i = index" 
                  class="tag">
                  {{ item.value }}
                  <button type="button" (click)="removeFromArray('expertise', i)">×</button>
                </span>
              </div>
            </div>

            <div class="form-group">
              <label for="skills">Skills</label>
              <input 
                type="text" 
                id="skills" 
                formControlName="skillsInput"
                class="form-control"
                placeholder="Add skill and press Enter"
                (keydown.enter)="addToArray('skills', $event)">
              <div class="tags-container">
                <span 
                  *ngFor="let item of skillsArray.controls; let i = index" 
                  class="tag">
                  {{ item.value }}
                  <button type="button" (click)="removeFromArray('skills', i)">×</button>
                </span>
              </div>
            </div>

            <div class="form-group">
              <label for="specializations">Specializations</label>
              <input 
                type="text" 
                id="specializations" 
                formControlName="specializationsInput"
                class="form-control"
                placeholder="Add specialization and press Enter"
                (keydown.enter)="addToArray('specializations', $event)">
              <div class="tags-container">
                <span 
                  *ngFor="let item of specializationsArray.controls; let i = index" 
                  class="tag">
                  {{ item.value }}
                  <button type="button" (click)="removeFromArray('specializations', i)">×</button>
                </span>
              </div>
            </div>
          </form>
        </div>

        <div class="step-container" *ngIf="currentStep() === 1">
          <h2>Professional Experience</h2>
          <p>Share your educational and work background</p>
          
          <form [formGroup]="experienceForm" class="setup-form">
            <div class="section-header">
              <h3>Education</h3>
              <button type="button" class="add-btn" (click)="addEducation()">+ Add Education</button>
            </div>
            
            <div formArrayName="education" class="form-array">
              <div 
                *ngFor="let edu of educationArray.controls; let i = index" 
                [formGroupName]="i" 
                class="array-item">
                <div class="form-row">
                  <div class="form-group">
                    <label>Degree</label>
                    <input type="text" formControlName="degree" class="form-control" required>
                  </div>
                  <div class="form-group">
                    <label>Institution</label>
                    <input type="text" formControlName="institution" class="form-control" required>
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label>Start Date</label>
                    <input type="month" formControlName="startDate" class="form-control">
                  </div>
                  <div class="form-group">
                    <label>End Date</label>
                    <input type="month" formControlName="endDate" class="form-control">
                  </div>
                </div>
                <div class="form-group">
                  <label>Description</label>
                  <textarea formControlName="description" class="form-control" rows="2"></textarea>
                </div>
                <button type="button" class="remove-btn" (click)="removeEducation(i)">Remove</button>
              </div>
            </div>

            <div class="section-header">
              <h3>Work Experience</h3>
              <button type="button" class="add-btn" (click)="addWorkExperience()">+ Add Experience</button>
            </div>
            
            <div formArrayName="workExperience" class="form-array">
              <div 
                *ngFor="let work of workExperienceArray.controls; let i = index" 
                [formGroupName]="i" 
                class="array-item">
                <div class="form-row">
                  <div class="form-group">
                    <label>Job Title</label>
                    <input type="text" formControlName="jobTitle" class="form-control" required>
                  </div>
                  <div class="form-group">
                    <label>Company</label>
                    <input type="text" formControlName="company" class="form-control" required>
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label>Start Date</label>
                    <input type="month" formControlName="startDate" class="form-control">
                  </div>
                  <div class="form-group">
                    <label>End Date</label>
                    <input type="month" formControlName="endDate" class="form-control">
                  </div>
                </div>
                <div class="form-group">
                  <label>Description</label>
                  <textarea formControlName="description" class="form-control" rows="2"></textarea>
                </div>
                <button type="button" class="remove-btn" (click)="removeWorkExperience(i)">Remove</button>
              </div>
            </div>
          </form>
        </div>

        <div class="step-container" *ngIf="currentStep() === 2">
          <h2>Mentorship Style & Availability</h2>
          <p>Help mentees understand how you work</p>
          
          <form [formGroup]="availabilityForm" class="setup-form">
            <div class="form-group">
              <label for="mentorshipStyle">Mentorship Style</label>
              <input 
                type="text" 
                id="mentorshipStyle" 
                formControlName="mentorshipStyleInput"
                class="form-control"
                placeholder="Add mentorship style and press Enter"
                (keydown.enter)="addToArray('mentorshipStyle', $event)">
              <div class="tags-container">
                <span 
                  *ngFor="let item of mentorshipStyleArray.controls; let i = index" 
                  class="tag">
                  {{ item.value }}
                  <button type="button" (click)="removeFromArray('mentorshipStyle', i)">×</button>
                </span>
              </div>
            </div>

            <div class="form-group">
              <label for="languages">Languages</label>
              <input 
                type="text" 
                id="languages" 
                formControlName="languagesInput"
                class="form-control"
                placeholder="Add language and press Enter"
                (keydown.enter)="addToArray('languages', $event)">
              <div class="tags-container">
                <span 
                  *ngFor="let item of languagesArray.controls; let i = index" 
                  class="tag">
                  {{ item.value }}
                  <button type="button" (click)="removeFromArray('languages', i)">×</button>
                </span>
              </div>
            </div>

            <div class="form-group">
              <label for="timeZone">Time Zone</label>
              <select id="timeZone" formControlName="timeZone" class="form-control" required>
                <option value="">Select your time zone</option>
                <option value="UTC-12:00">UTC-12:00 Baker Island Time</option>
                <option value="UTC-11:00">UTC-11:00 Hawaii-Aleutian Standard Time</option>
                <option value="UTC-10:00">UTC-10:00 Hawaii-Aleutian Standard Time</option>
                <option value="UTC-09:00">UTC-09:00 Alaska Standard Time</option>
                <option value="UTC-08:00">UTC-08:00 Pacific Standard Time</option>
                <option value="UTC-07:00">UTC-07:00 Mountain Standard Time</option>
                <option value="UTC-06:00">UTC-06:00 Central Standard Time</option>
                <option value="UTC-05:00">UTC-05:00 Eastern Standard Time</option>
                <option value="UTC-04:00">UTC-04:00 Atlantic Standard Time</option>
                <option value="UTC-03:00">UTC-03:00 Argentina Time</option>
                <option value="UTC-02:00">UTC-02:00 South Georgia Time</option>
                <option value="UTC-01:00">UTC-01:00 Azores Time</option>
                <option value="UTC+00:00">UTC+00:00 Greenwich Mean Time</option>
                <option value="UTC+01:00">UTC+01:00 Central European Time</option>
                <option value="UTC+02:00">UTC+02:00 Eastern European Time</option>
                <option value="UTC+03:00">UTC+03:00 Moscow Time</option>
                <option value="UTC+04:00">UTC+04:00 Gulf Standard Time</option>
                <option value="UTC+05:00">UTC+05:00 Pakistan Standard Time</option>
                <option value="UTC+05:30">UTC+05:30 India Standard Time</option>
                <option value="UTC+06:00">UTC+06:00 Bangladesh Standard Time</option>
                <option value="UTC+07:00">UTC+07:00 Indochina Time</option>
                <option value="UTC+08:00">UTC+08:00 China Standard Time</option>
                <option value="UTC+09:00">UTC+09:00 Japan Standard Time</option>
                <option value="UTC+10:00">UTC+10:00 Australian Eastern Standard Time</option>
                <option value="UTC+11:00">UTC+11:00 Solomon Islands Time</option>
                <option value="UTC+12:00">UTC+12:00 Fiji Time</option>
              </select>
            </div>

            <div class="form-group">
              <label>Session Types</label>
              <div class="checkbox-group">
                <label class="checkbox-label">
                  <input type="checkbox" value="1-on-1 Sessions" (change)="updateSessionTypes($event)">
                  <span>1-on-1 Sessions</span>
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" value="Group Sessions" (change)="updateSessionTypes($event)">
                  <span>Group Sessions</span>
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" value="Workshops" (change)="updateSessionTypes($event)">
                  <span>Workshops</span>
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" value="Code Review" (change)="updateSessionTypes($event)">
                  <span>Code Review</span>
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" value="Career Guidance" (change)="updateSessionTypes($event)">
                  <span>Career Guidance</span>
                </label>
              </div>
            </div>
          </form>
        </div>

        <div class="step-container" *ngIf="currentStep() === 3">
          <div class="completion-step">
            <div class="completion-icon">🎉</div>
            <h2>Profile Setup Complete!</h2>
            <p>Your mentor profile is ready. You can always update your information later from your dashboard.</p>
            
            <div class="setup-summary">
              <h3>Profile Summary</h3>
              <div class="summary-item">
                <strong>Location:</strong> {{ basicInfoForm.get('location')?.value }}
              </div>
              <div class="summary-item">
                <strong>Expertise Areas:</strong> {{ expertiseArray.length }} areas
              </div>
              <div class="summary-item">
                <strong>Skills:</strong> {{ skillsArray.length }} skills
              </div>
              <div class="summary-item">
                <strong>Education:</strong> {{ educationArray.length }} entries
              </div>
              <div class="summary-item">
                <strong>Work Experience:</strong> {{ workExperienceArray.length }} entries
              </div>
              <div class="summary-item">
                <strong>Time Zone:</strong> {{ availabilityForm.get('timeZone')?.value }}
              </div>
              <div class="summary-item">
                <strong>Session Types:</strong> {{ selectedSessionTypes.length }} types
              </div>
            </div>
          </div>
        </div>

        <div class="error-message" *ngIf="errorMessage()">
          {{ errorMessage() }}
        </div>

        <div class="setup-actions">
          <button 
            type="button" 
            class="btn btn-secondary"
            *ngIf="currentStep() > 0"
            (click)="previousStep()"
            [disabled]="isLoading()">
            Previous
          </button>
          
          <button 
            type="button" 
            class="btn btn-primary"
            *ngIf="currentStep() < steps.length - 2"
            (click)="nextStep()"
            [disabled]="!isCurrentStepValid() || isLoading()">
            Next
          </button>
          
          <button 
            type="button" 
            class="btn btn-primary"
            *ngIf="currentStep() === steps.length - 2"
            (click)="nextStep()"
            [disabled]="!isCurrentStepValid() || isLoading()">
            Review & Complete
          </button>
          
          <button 
            type="button" 
            class="btn btn-success"
            *ngIf="currentStep() === steps.length - 1"
            (click)="completeSetup()"
            [disabled]="isLoading()">
            <span *ngIf="isLoading()" class="loading-spinner">⏳</span>
            {{ isLoading() ? 'Completing...' : 'Complete Setup' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrl: './mentor-setup.component.scss'
})
export class MentorSetupComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private mentorService = inject(MentorService);
  private router = inject(Router);

  // Signals
  currentStep = signal(0);
  isLoading = signal(false);
  errorMessage = signal('');

  // Step configuration
  steps = [
    { title: 'Basic Info', key: 'basic' },
    { title: 'Experience', key: 'experience' },
    { title: 'Availability', key: 'availability' },
    { title: 'Complete', key: 'complete' }
  ];

  // Forms
  basicInfoForm!: FormGroup;
  experienceForm!: FormGroup;
  availabilityForm!: FormGroup;

  // Session types
  selectedSessionTypes: string[] = [];

  ngOnInit() {
    this.initializeForms();
  }

  initializeForms() {
    this.basicInfoForm = this.fb.group({
      profilePicture: [''],
      location: ['', Validators.required],
      about: ['', Validators.required],
      expertise: this.fb.array([]),
      expertiseInput: [''],
      skills: this.fb.array([]),
      skillsInput: [''],
      specializations: this.fb.array([]),
      specializationsInput: ['']
    });

    this.experienceForm = this.fb.group({
      education: this.fb.array([]),
      workExperience: this.fb.array([])
    });

    this.availabilityForm = this.fb.group({
      timeZone: ['', Validators.required],
      mentorshipStyle: this.fb.array([]),
      mentorshipStyleInput: [''],
      languages: this.fb.array([]),
      languagesInput: ['']
    });

    // Add default entries
    this.addEducation();
    this.addWorkExperience();
  }

  // Form array getters
  get expertiseArray() { return this.basicInfoForm.get('expertise') as FormArray; }
  get skillsArray() { return this.basicInfoForm.get('skills') as FormArray; }
  get specializationsArray() { return this.basicInfoForm.get('specializations') as FormArray; }
  get educationArray() { return this.experienceForm.get('education') as FormArray; }
  get workExperienceArray() { return this.experienceForm.get('workExperience') as FormArray; }
  get mentorshipStyleArray() { return this.availabilityForm.get('mentorshipStyle') as FormArray; }
  get languagesArray() { return this.availabilityForm.get('languages') as FormArray; }

  // Progress calculation
  progressPercentage(): number {
    return ((this.currentStep() + 1) / this.steps.length) * 100;
  }

  // Navigation
  nextStep() {
    if (this.isCurrentStepValid() && this.currentStep() < this.steps.length - 1) {
      this.currentStep.set(this.currentStep() + 1);
    }
  }

  previousStep() {
    if (this.currentStep() > 0) {
      this.currentStep.set(this.currentStep() - 1);
    }
  }

  isCurrentStepValid(): boolean {
    switch (this.currentStep()) {
      case 0:
        return this.basicInfoForm.valid;
      case 1:
        return this.experienceForm.valid;
      case 2:
        return this.availabilityForm.valid;
      case 3:
        return true; // Completion step is always valid
      default:
        return false;
    }
  }

  // Array management
  addToArray(arrayName: string, event: Event) {
    event.preventDefault();
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();
    
    if (!value) return;

    let formArray: FormArray;
    let inputControlName: string;

    switch (arrayName) {
      case 'expertise':
        formArray = this.expertiseArray;
        inputControlName = 'expertiseInput';
        break;
      case 'skills':
        formArray = this.skillsArray;
        inputControlName = 'skillsInput';
        break;
      case 'specializations':
        formArray = this.specializationsArray;
        inputControlName = 'specializationsInput';
        break;
      case 'mentorshipStyle':
        formArray = this.mentorshipStyleArray;
        inputControlName = 'mentorshipStyleInput';
        break;
      case 'languages':
        formArray = this.languagesArray;
        inputControlName = 'languagesInput';
        break;
      default:
        return;
    }

    formArray.push(this.fb.control(value));
    
    // Clear input
    if (arrayName === 'expertise' || arrayName === 'skills' || arrayName === 'specializations') {
      this.basicInfoForm.get(inputControlName)?.setValue('');
    } else {
      this.availabilityForm.get(inputControlName)?.setValue('');
    }
  }

  removeFromArray(arrayName: string, index: number) {
    let formArray: FormArray;

    switch (arrayName) {
      case 'expertise':
        formArray = this.expertiseArray;
        break;
      case 'skills':
        formArray = this.skillsArray;
        break;
      case 'specializations':
        formArray = this.specializationsArray;
        break;
      case 'mentorshipStyle':
        formArray = this.mentorshipStyleArray;
        break;
      case 'languages':
        formArray = this.languagesArray;
        break;
      default:
        return;
    }

    formArray.removeAt(index);
  }

  // Education management
  addEducation() {
    const educationGroup = this.fb.group({
      degree: ['', Validators.required],
      institution: ['', Validators.required],
      startDate: [''],
      endDate: [''],
      description: ['']
    });
    this.educationArray.push(educationGroup);
  }

  removeEducation(index: number) {
    if (this.educationArray.length > 1) {
      this.educationArray.removeAt(index);
    }
  }

  // Work experience management
  addWorkExperience() {
    const workGroup = this.fb.group({
      jobTitle: ['', Validators.required],
      company: ['', Validators.required],
      startDate: [''],
      endDate: [''],
      description: ['']
    });
    this.workExperienceArray.push(workGroup);
  }

  removeWorkExperience(index: number) {
    if (this.workExperienceArray.length > 1) {
      this.workExperienceArray.removeAt(index);
    }
  }

  // Session types management
  updateSessionTypes(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const value = checkbox.value;

    if (checkbox.checked) {
      this.selectedSessionTypes.push(value);
    } else {
      const index = this.selectedSessionTypes.indexOf(value);
      if (index > -1) {
        this.selectedSessionTypes.splice(index, 1);
      }
    }
  }

  // Complete setup
  completeSetup() {
    if (!this.isCurrentStepValid()) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    // Build mentor profile data
    const mentorData: Partial<Mentor> = {
      profilePicture: this.basicInfoForm.get('profilePicture')?.value || '',
      location: this.basicInfoForm.get('location')?.value,
      onlineStatus: false,
      overallRating: 0,
      numberOfSessions: 0,
      numberOfMentees: 0,
      numberOfReviews: 0,
      completionRate: 0,
      topRated: false,
      overview: {
        about: this.basicInfoForm.get('about')?.value,
        expertise: this.expertiseArray.value,
        skills: this.skillsArray.value,
        specializations: this.specializationsArray.value,
        mentorshipStyle: this.mentorshipStyleArray.value,
        languages: this.languagesArray.value,
        connect: []
      },
      experience: {
        education: this.educationArray.value,
        workExperience: this.workExperienceArray.value,
        certifications: [],
        achievements: []
      },
      portfolio: [],
      reviews: [],
      availability: {
        timeZone: this.availabilityForm.get('timeZone')?.value,
        sessionTypes: this.selectedSessionTypes,
        availableTimeSlots: []
      }
    };

    console.log('Starting mentor profile setup...', mentorData);

    // Save mentor profile to Firestore using MentorService
    this.mentorService.createOrUpdateMentorProfile(mentorData)
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        })
      )
      .subscribe({
        next: () => {
          console.log('Mentor profile saved successfully');
          // Mark first time login as complete
          this.authService.markFirstTimeLoginComplete()
            .then(() => {
              console.log('First time login marked complete');
              // Navigate to mentor dashboard 
              this.router.navigateByUrl('/portal/homepage').then(success => {
                if (success) {
                  console.log('Navigation successful');
                } else {
                  console.error('Navigation failed');
                  this.errorMessage.set('Navigation failed. Redirecting...');
                  // Fallback navigation
                  window.location.href = '/portal/homepage';
                }
              });
            })
            .catch(error => {
              console.error('Error marking first time login complete:', error);
              this.errorMessage.set('Profile saved but failed to complete setup. Please refresh the page.');
            });
        },
        error: (error) => {
          console.error('Error saving mentor profile:', error);
          this.errorMessage.set('Failed to complete setup. Please try again.');
        }
      });
  }
}
