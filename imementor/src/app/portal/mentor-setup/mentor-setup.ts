import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

export interface MentorSetupData {
  // Step 1: Basic Info & Profile Picture
  profilePicture?: string;
  bio: string;
  experience: string;
  
  // Step 2: Skills
  skills: string[];
  
  // Step 3: Expertise & Specialization
  expertiseFields: string[];
  specialization: string;
  yearsOfExperience: number;
  
  // Step 4: Availability & Preferences
  availability: {
    days: string[];
    timeSlots: string[];
  };
  preferredMenteeLevel: string[];
  mentorshipStyle: string;
  
  // Step 5: Verification & Final Review
  certifications: string[];
  portfolio?: string;
  linkedIn?: string;
  isComplete: boolean;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
}

export interface ExpertiseField {
  id: string;
  name: string;
  description: string;
}

@Component({
  selector: 'app-mentor-setup',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './mentor-setup.html',
  styleUrl: './mentor-setup.scss'
})
export class MentorSetup implements OnInit {
  currentStep = 1;
  totalSteps = 5;
  isLoading = false;
  
  setupForm!: FormGroup;
  setupData: MentorSetupData = {
    bio: '',
    experience: '',
    skills: [],
    expertiseFields: [],
    specialization: '',
    yearsOfExperience: 0,
    availability: {
      days: [],
      timeSlots: []
    },
    preferredMenteeLevel: [],
    mentorshipStyle: '',
    certifications: [],
    isComplete: false
  };

  // Available options
  availableSkills: Skill[] = [
    { id: 'js', name: 'JavaScript', category: 'Programming' },
    { id: 'python', name: 'Python', category: 'Programming' },
    { id: 'java', name: 'Java', category: 'Programming' },
    { id: 'react', name: 'React', category: 'Frontend' },
    { id: 'angular', name: 'Angular', category: 'Frontend' },
    { id: 'nodejs', name: 'Node.js', category: 'Backend' },
    { id: 'design', name: 'UI/UX Design', category: 'Design' },
    { id: 'data-analysis', name: 'Data Analysis', category: 'Data Science' },
    { id: 'machine-learning', name: 'Machine Learning', category: 'AI/ML' },
    { id: 'project-management', name: 'Project Management', category: 'Management' },
    { id: 'communication', name: 'Communication', category: 'Soft Skills' },
    { id: 'leadership', name: 'Leadership', category: 'Soft Skills' },
    { id: 'mobile-dev', name: 'Mobile Development', category: 'Programming' },
    { id: 'database', name: 'Database Management', category: 'Backend' },
    { id: 'cloud', name: 'Cloud Computing', category: 'DevOps' }
  ];

  availableExpertiseFields: ExpertiseField[] = [
    { id: 'web-dev', name: 'Web Development', description: 'Frontend at Backend Development' },
    { id: 'mobile-dev', name: 'Mobile Development', description: 'iOS at Android App Development' },
    { id: 'data-science', name: 'Data Science', description: 'Data Analysis, Visualization, at Machine Learning' },
    { id: 'cybersecurity', name: 'Cybersecurity', description: 'Information Security at Ethical Hacking' },
    { id: 'ui-ux', name: 'UI/UX Design', description: 'User Interface at User Experience Design' },
    { id: 'game-dev', name: 'Game Development', description: 'Video Game Programming at Design' },
    { id: 'devops', name: 'DevOps', description: 'Development Operations at Cloud Computing' },
    { id: 'ai-ml', name: 'Artificial Intelligence', description: 'AI Research at Machine Learning' },
    { id: 'business', name: 'Business Development', description: 'Entrepreneurship at Business Strategy' },
    { id: 'marketing', name: 'Digital Marketing', description: 'Social Media at Content Marketing' }
  ];

  availableDays = ['Lunes', 'Martes', 'Miyerkules', 'Huwebes', 'Biyernes', 'Sabado', 'Linggo'];
  
  availableTimeSlots = [
    'Umaga (6:00 AM - 12:00 PM)',
    'Tanghali (12:00 PM - 6:00 PM)', 
    'Gabi (6:00 PM - 10:00 PM)',
    'Late Night (10:00 PM - 12:00 AM)'
  ];

  menteelevels = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];
  
  mentorshipStyles = [
    'Hands-on Guidance',
    'Structured Learning',
    'Project-based Learning',
    'Casual Conversations',
    'Problem-solving Focus'
  ];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.setupForm = this.formBuilder.group({
      // Step 1
      bio: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(500)]],
      experience: ['', [Validators.required, Validators.minLength(100)]],
      
      // Step 2 - Skills will be handled separately
      
      // Step 3
      specialization: ['', [Validators.required, Validators.minLength(20)]],
      yearsOfExperience: [0, [Validators.required, Validators.min(1), Validators.max(50)]],
      
      // Step 4
      mentorshipStyle: ['', [Validators.required]],
      
      // Step 5
      portfolio: [''],
      linkedIn: ['']
    });
  }

  // Step navigation
  nextStep() {
    if (this.isStepValid()) {
      this.saveCurrentStepData();
      if (this.currentStep < this.totalSteps) {
        this.currentStep++;
      }
    } else {
      this.markStepFormGroupTouched();
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToStep(step: number) {
    if (step <= this.currentStep || this.isStepValid()) {
      this.saveCurrentStepData();
      this.currentStep = step;
    }
  }

  isStepValid(): boolean {
    switch (this.currentStep) {
      case 1:
        return !!(this.setupForm.get('bio')?.valid && this.setupForm.get('experience')?.valid);
      case 2:
        return this.setupData.skills.length >= 3;
      case 3:
        return this.setupData.expertiseFields.length >= 1 && 
               !!(this.setupForm.get('specialization')?.valid && 
               this.setupForm.get('yearsOfExperience')?.valid);
      case 4:
        return this.setupData.availability.days.length >= 2 && 
               this.setupData.availability.timeSlots.length >= 1 &&
               this.setupData.preferredMenteeLevel.length >= 1 &&
               !!this.setupForm.get('mentorshipStyle')?.valid;
      case 5:
        return true; // Final review step
      default:
        return false;
    }
  }

  markStepFormGroupTouched() {
    Object.keys(this.setupForm.controls).forEach(key => {
      const control = this.setupForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  saveCurrentStepData() {
    const formValues = this.setupForm.value;
    this.setupData = { ...this.setupData, ...formValues };
  }

  // File upload
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.setupData.profilePicture = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Skills management
  onSkillToggle(skillId: string) {
    const index = this.setupData.skills.indexOf(skillId);
    if (index > -1) {
      this.setupData.skills.splice(index, 1);
    } else {
      this.setupData.skills.push(skillId);
    }
  }

  onExpertiseToggle(fieldId: string) {
    const index = this.setupData.expertiseFields.indexOf(fieldId);
    if (index > -1) {
      this.setupData.expertiseFields.splice(index, 1);
    } else {
      this.setupData.expertiseFields.push(fieldId);
    }
  }

  onDayToggle(day: string) {
    const index = this.setupData.availability.days.indexOf(day);
    if (index > -1) {
      this.setupData.availability.days.splice(index, 1);
    } else {
      this.setupData.availability.days.push(day);
    }
  }

  onTimeSlotToggle(timeSlot: string) {
    const index = this.setupData.availability.timeSlots.indexOf(timeSlot);
    if (index > -1) {
      this.setupData.availability.timeSlots.splice(index, 1);
    } else {
      this.setupData.availability.timeSlots.push(timeSlot);
    }
  }

  onMenteeLevelToggle(level: string) {
    const index = this.setupData.preferredMenteeLevel.indexOf(level);
    if (index > -1) {
      this.setupData.preferredMenteeLevel.splice(index, 1);
    } else {
      this.setupData.preferredMenteeLevel.push(level);
    }
  }

  // Utility methods
  getSkillsByCategory(category: string): Skill[] {
    return this.availableSkills.filter(skill => skill.category === category);
  }

  getSkillCategories(): string[] {
    return [...new Set(this.availableSkills.map(skill => skill.category))];
  }

  getSkillName(skillId: string): string {
    const skill = this.availableSkills.find(s => s.id === skillId);
    return skill ? skill.name : '';
  }

  getExpertiseFieldName(fieldId: string): string {
    const field = this.availableExpertiseFields.find(f => f.id === fieldId);
    return field ? field.name : '';
  }

  // Final submission
  completeSetup() {
    this.isLoading = true;
    this.saveCurrentStepData();
    
    // Simulate API call
    setTimeout(() => {
      this.setupData.isComplete = true;
      console.log('Mentor setup completed:', this.setupData);
      
      this.isLoading = false;
      
      // Show success message and redirect
      alert('Congratulations! Natapos na ang inyong mentor setup. Welcome sa IMementor community!');
      this.router.navigate(['/homepage']);
    }, 2000);
  }

  // Cancel setup
  cancelSetup() {
    if (confirm('Sigurado ka ba na gusto mong i-cancel ang setup? Mawawala ang lahat ng na-input mo.')) {
      this.router.navigate(['/homepage']);
    }
  }

  // Get progress percentage
  getProgressPercentage(): number {
    return (this.currentStep / this.totalSteps) * 100;
  }
}
