import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, AuthError } from '../../core/services/auth.service';
import { MentorService } from '../../core/services/mentor.service';
import { FileUploadService } from '../../core/services/file-upload.service';
import { Mentor } from '../../shared/models/interfaces/mentor.interface';
import { finalize } from 'rxjs/operators';
import { SearchableDropdownComponent } from '../../shared/components/searchable-dropdown/searchable-dropdown.component';
import { EXPERTISE_OPTIONS, SKILLS_OPTIONS, SPECIALIZATIONS_OPTIONS, LANGUAGES_OPTIONS, MENTORSHIP_STYLE_OPTIONS } from '../../shared/data/mentor-options';

@Component({
  selector: 'app-mentor-setup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SearchableDropdownComponent],
  template: `
    <div class="mentor-setup-container">
      <div class="setup-header">
        <h1>Welcome to IMementor! 🎉</h1>
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
                <label for="profilePicture">Profile Picture</label>
                <div class="file-upload-container">
                  <div class="file-upload-preview" *ngIf="profilePicturePreview">
                    <img [src]="profilePicturePreview" alt="Profile preview" class="preview-image">
                    <button type="button" class="remove-image-btn" (click)="removeProfilePicture()">
                      <span>×</span>
                    </button>
                  </div>
                  <div class="file-upload-area" [class.has-image]="profilePicturePreview" (click)="triggerFileInput()">
                    <input 
                      #fileInput
                      type="file" 
                      id="profilePicture" 
                      accept="image/*"
                      (change)="onFileSelected($event)"
                      class="file-input"
                      hidden>
                    <div class="upload-content" *ngIf="!profilePicturePreview">
                      <div class="upload-icon">📷</div>
                      <p class="upload-text">Click to upload profile picture</p>
                      <p class="upload-hint">JPG, JPEG, PNG, GIF, WebP up to 5MB</p>
                    </div>
                    <div class="change-image-overlay" *ngIf="profilePicturePreview">
                      <span>Change Image</span>
                    </div>
                  </div>
                </div>
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
              <app-searchable-dropdown
                [options]="expertiseOptions"
                placeholder="Search or add expertise areas"
                [allowCustom]="true"
                (optionSelected)="onExpertiseSelected($event)">
              </app-searchable-dropdown>
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
              <app-searchable-dropdown
                [options]="skillsOptions"
                placeholder="Search or add skills"
                [allowCustom]="true"
                (optionSelected)="onSkillSelected($event)">
              </app-searchable-dropdown>
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
              <app-searchable-dropdown
                [options]="specializationsOptions"
                placeholder="Search or add specializations"
                [allowCustom]="true"
                (optionSelected)="onSpecializationSelected($event)">
              </app-searchable-dropdown>
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
          <h2>Achievements & Recognition</h2>
          <p>Share your notable achievements and recognitions</p>
          
          <form [formGroup]="achievementsForm" class="setup-form">
            <div class="section-header">
              <h3>Achievements</h3>
              <button type="button" class="add-btn" (click)="addAchievement()">+ Add Achievement</button>
            </div>
            
            <div formArrayName="achievements" class="form-array">
              <div 
                *ngFor="let achievement of achievementsArray.controls; let i = index" 
                [formGroupName]="i" 
                class="array-item">
                <div class="form-group">
                  <label>Achievement Title</label>
                  <input type="text" formControlName="title" class="form-control" required>
                </div>
                <div class="form-group">
                  <label>Description</label>
                  <textarea formControlName="description" class="form-control" rows="3" required></textarea>
                </div>
                <div class="form-group">
                  <label>Date</label>
                  <input type="date" formControlName="date" class="form-control" required>
                </div>
                <button type="button" class="remove-btn" (click)="removeAchievement(i)">Remove</button>
              </div>
            </div>
          </form>
        </div>

        <div class="step-container" *ngIf="currentStep() === 3">
          <h2>Certifications & Credentials</h2>
          <p>Share your professional certifications and credentials</p>
          
          <form [formGroup]="certificationsForm" class="setup-form">
            <div class="section-header">
              <h3>Certifications</h3>
              <button type="button" class="add-btn" (click)="addCertification()">+ Add Certification</button>
            </div>
            
            <div formArrayName="certifications" class="form-array">
              <div 
                *ngFor="let certification of certificationsArray.controls; let i = index" 
                [formGroupName]="i" 
                class="array-item">
                <div class="form-row">
                  <div class="form-group">
                    <label>Certification Title</label>
                    <input type="text" formControlName="title" class="form-control" required>
                  </div>
                  <div class="form-group">
                    <label>Institution/Organization</label>
                    <input type="text" formControlName="institution" class="form-control" required>
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label>Issued Date</label>
                    <input type="date" formControlName="issuedDate" class="form-control" required>
                  </div>
                  <div class="form-group">
                    <label>Expiration Date</label>
                    <input type="date" formControlName="expirationDate" class="form-control">
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label>Credential ID</label>
                    <input type="text" formControlName="credentialId" class="form-control">
                  </div>
                  <div class="form-group">
                    <label>Verification URL</label>
                    <input type="url" formControlName="verificationUrl" class="form-control" placeholder="https://example.com/verify">
                  </div>
                </div>
                <button type="button" class="remove-btn" (click)="removeCertification(i)">Remove</button>
              </div>
            </div>
          </form>
        </div>

        <div class="step-container" *ngIf="currentStep() === 4">
          <h2>Mentorship Style & Availability</h2>
          <p>Help mentees understand how you work</p>
          
          <form [formGroup]="availabilityForm" class="setup-form">
            <div class="form-group">
              <label for="mentorshipStyle">Mentorship Style</label>
              <app-searchable-dropdown
                [options]="mentorshipStyleOptions"
                placeholder="Search or add mentorship styles"
                [allowCustom]="true"
                (optionSelected)="onMentorshipStyleSelected($event)">
              </app-searchable-dropdown>
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
              <app-searchable-dropdown
                [options]="languagesOptions"
                placeholder="Search or add languages"
                [allowCustom]="true"
                (optionSelected)="onLanguageSelected($event)">
              </app-searchable-dropdown>
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
              <label>Available Days & Hours</label>
              <p class="form-help">Select the days you're available and set your hours for each day</p>
              
              <div class="available-days-container">
                <div 
                  *ngFor="let day of daysOfWeek; let i = index" 
                  class="day-availability">
                  <label class="day-checkbox">
                    <input 
                      type="checkbox" 
                      [value]="day.value"
                      (change)="toggleDayAvailability(day.value, $event)">
                    <span class="day-label">{{ day.label }}</span>
                  </label>
                  
                  <div 
                    class="time-slots" 
                    *ngIf="isDaySelected(day.value)">
                    <div class="time-slot">
                      <label for="start-{{ day.value }}">From:</label>
                      <select 
                        [id]="'start-' + day.value"
                        class="time-select"
                        (change)="updateDayTime(day.value, 'startTime', $event)">
                        <option value="">Select start time</option>
                        <option value="06:00">6:00 AM</option>
                        <option value="07:00">7:00 AM</option>
                        <option value="08:00">8:00 AM</option>
                        <option value="09:00">9:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="13:00">1:00 PM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="15:00">3:00 PM</option>
                        <option value="16:00">4:00 PM</option>
                        <option value="17:00">5:00 PM</option>
                        <option value="18:00">6:00 PM</option>
                        <option value="19:00">7:00 PM</option>
                        <option value="20:00">8:00 PM</option>
                        <option value="21:00">9:00 PM</option>
                        <option value="22:00">10:00 PM</option>
                      </select>
                    </div>
                    
                    <div class="time-slot">
                      <label for="end-{{ day.value }}">To:</label>
                      <select 
                        [id]="'end-' + day.value"
                        class="time-select"
                        (change)="updateDayTime(day.value, 'endTime', $event)">
                        <option value="">Select end time</option>
                        <option value="08:00">8:00 AM</option>
                        <option value="09:00">9:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="13:00">1:00 PM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="15:00">3:00 PM</option>
                        <option value="16:00">4:00 PM</option>
                        <option value="17:00">5:00 PM</option>
                        <option value="18:00">6:00 PM</option>
                        <option value="19:00">7:00 PM</option>
                        <option value="20:00">8:00 PM</option>
                        <option value="21:00">9:00 PM</option>
                        <option value="22:00">10:00 PM</option>
                        <option value="23:00">11:00 PM</option>
                        <option value="23:59">11:59 PM</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
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

        <div class="step-container" *ngIf="currentStep() === 4">
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
                <strong>Achievements:</strong> {{ achievementsArray.length }} achievements
              </div>
              <div class="summary-item">
                <strong>Time Zone:</strong> {{ availabilityForm.get('timeZone')?.value }}
              </div>
              <div class="summary-item">
                <strong>Available Days:</strong> {{ availableDaysArray.length }} days
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
  private fileUploadService = inject(FileUploadService);
  private router = inject(Router);

  // Signals
  currentStep = signal(0);
  isLoading = signal(false);
  errorMessage = signal('');

  // Options for dropdowns
  expertiseOptions = EXPERTISE_OPTIONS;
  skillsOptions = SKILLS_OPTIONS;
  specializationsOptions = SPECIALIZATIONS_OPTIONS;
  languagesOptions = LANGUAGES_OPTIONS;
  mentorshipStyleOptions = MENTORSHIP_STYLE_OPTIONS;

  // Days of the week
  daysOfWeek = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' }
  ];

  // Step configuration
  steps = [
    { title: 'Basic Info', key: 'basic' },
    { title: 'Experience', key: 'experience' },
    { title: 'Achievements', key: 'achievements' },
    { title: 'Certifications', key: 'certifications' },
    { title: 'Availability', key: 'availability' },
    { title: 'Complete', key: 'complete' }
  ];

  // Forms
  basicInfoForm!: FormGroup;
  experienceForm!: FormGroup;
  achievementsForm!: FormGroup;
  certificationsForm!: FormGroup;
  availabilityForm!: FormGroup;

  // Session types
  selectedSessionTypes: string[] = [];

  // File upload properties
  profilePicturePreview: string | null = null;
  selectedFile: File | null = null;

  ngOnInit() {
    this.initializeForms();
  }

  initializeForms() {
    this.basicInfoForm = this.fb.group({
      location: ['', Validators.required],
      about: ['', Validators.required],
      expertise: this.fb.array([]),
      skills: this.fb.array([]),
      specializations: this.fb.array([])
    });

    this.experienceForm = this.fb.group({
      education: this.fb.array([]),
      workExperience: this.fb.array([])
    });

    this.achievementsForm = this.fb.group({
      achievements: this.fb.array([])
    });

    this.certificationsForm = this.fb.group({
      certifications: this.fb.array([])
    });

    this.availabilityForm = this.fb.group({
      timeZone: ['', Validators.required],
      mentorshipStyle: this.fb.array([]),
      languages: this.fb.array([]),
      availableDays: this.fb.array([])
    });

    // Add default entries
    this.addEducation();
    this.addWorkExperience();
    this.addAchievement();
    this.addCertification();
  }

  // Form array getters
  get expertiseArray() { return this.basicInfoForm.get('expertise') as FormArray; }
  get skillsArray() { return this.basicInfoForm.get('skills') as FormArray; }
  get specializationsArray() { return this.basicInfoForm.get('specializations') as FormArray; }
  get educationArray() { return this.experienceForm.get('education') as FormArray; }
  get workExperienceArray() { return this.experienceForm.get('workExperience') as FormArray; }
  get achievementsArray() { return this.achievementsForm.get('achievements') as FormArray; }
  get certificationsArray() { return this.certificationsForm.get('certifications') as FormArray; }
  get mentorshipStyleArray() { return this.availabilityForm.get('mentorshipStyle') as FormArray; }
  get languagesArray() { return this.availabilityForm.get('languages') as FormArray; }
  get availableDaysArray() { return this.availabilityForm.get('availableDays') as FormArray; }

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
        return this.achievementsForm.valid;
      case 3:
        return this.certificationsForm.valid;
      case 4:
        return this.availabilityForm.valid;
      case 5:
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
        inputControlName = '';
        break;
      case 'skills':
        formArray = this.skillsArray;
        inputControlName = '';
        break;
      case 'specializations':
        formArray = this.specializationsArray;
        inputControlName = '';
        break;
      case 'mentorshipStyle':
        formArray = this.mentorshipStyleArray;
        inputControlName = '';
        break;
      case 'languages':
        formArray = this.languagesArray;
        inputControlName = '';
        break;
      default:
        return;
    }

    formArray.push(this.fb.control(value));
    
    // Clear input (no longer needed since all fields use dropdowns)
    // if (inputControlName) {
    //   this.availabilityForm.get(inputControlName)?.setValue('');
    // }
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

  // Achievement management
  addAchievement() {
    const achievementGroup = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required]
    });
    this.achievementsArray.push(achievementGroup);
  }

  removeAchievement(index: number) {
    if (this.achievementsArray.length > 1) {
      this.achievementsArray.removeAt(index);
    }
  }

  // Certification management
  addCertification() {
    const certificationGroup = this.fb.group({
      title: ['', Validators.required],
      institution: ['', Validators.required],
      issuedDate: ['', Validators.required],
      expirationDate: [''],
      credentialId: [''],
      verificationUrl: ['']
    });
    this.certificationsArray.push(certificationGroup);
  }

  removeCertification(index: number) {
    if (this.certificationsArray.length > 1) {
      this.certificationsArray.removeAt(index);
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

  // Event handlers for searchable dropdowns
  onExpertiseSelected(value: string) {
    if (value && !this.expertiseArray.value.includes(value)) {
      this.expertiseArray.push(this.fb.control(value));
    }
  }

  onSkillSelected(value: string) {
    if (value && !this.skillsArray.value.includes(value)) {
      this.skillsArray.push(this.fb.control(value));
    }
  }

  onSpecializationSelected(value: string) {
    if (value && !this.specializationsArray.value.includes(value)) {
      this.specializationsArray.push(this.fb.control(value));
    }
  }

  onMentorshipStyleSelected(value: string) {
    if (value && !this.mentorshipStyleArray.value.includes(value)) {
      this.mentorshipStyleArray.push(this.fb.control(value));
    }
  }

  onLanguageSelected(value: string) {
    if (value && !this.languagesArray.value.includes(value)) {
      this.languagesArray.push(this.fb.control(value));
    }
  }

  // Day availability methods
  toggleDayAvailability(day: string, event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const isChecked = checkbox.checked;
    
    if (isChecked) {
      // Add the day with default time slots
      const daySlot = this.fb.group({
        day: [day],
        startTime: [''],
        endTime: ['']
      });
      this.availableDaysArray.push(daySlot);
    } else {
      // Remove the day
      const index = this.availableDaysArray.controls.findIndex(
        control => control.get('day')?.value === day
      );
      if (index !== -1) {
        this.availableDaysArray.removeAt(index);
      }
    }
  }

  isDaySelected(day: string): boolean {
    return this.availableDaysArray.controls.some(
      control => control.get('day')?.value === day
    );
  }

  updateDayTime(day: string, timeType: 'startTime' | 'endTime', event: Event) {
    const select = event.target as HTMLSelectElement;
    const time = select.value;
    
    const dayControl = this.availableDaysArray.controls.find(
      control => control.get('day')?.value === day
    );
    
    if (dayControl) {
      dayControl.get(timeType)?.setValue(time);
    }
  }

  // File upload methods
  triggerFileInput() {
    const fileInput = document.getElementById('profilePicture') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Validate file using the service
      const validation = this.fileUploadService.validateFile(file);
      if (!validation.valid) {
        alert(validation.error);
        return;
      }

      this.selectedFile = file;

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.profilePicturePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeProfilePicture() {
    this.profilePicturePreview = null;
    this.selectedFile = null;
    const fileInput = document.getElementById('profilePicture') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  // Complete setup
  completeSetup() {
    if (!this.isCurrentStepValid()) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    // Build mentor profile data
    const mentorData: Partial<Mentor> = {
      profilePicture: this.profilePicturePreview || '',
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
        achievements: this.achievementsArray.value
      },
      portfolio: [],
      reviews: [],
      availability: {
        timeZone: this.availabilityForm.get('timeZone')?.value,
        sessionTypes: this.selectedSessionTypes,
        availableTimeSlots: this.availableDaysArray.value
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
