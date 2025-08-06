import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

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
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  @Input() user: any; // Will receive user data from parent
  @Output() userUpdated = new EventEmitter<any>();

  isEditing = false;
  isLoading = false;
  profileForm!: FormGroup;
  selectedSkills: string[] = [];
  selectedExpertiseFields: string[] = [];
  selectedInterests: string[] = [];
  selectedHobbies: string[] = [];

  // Available options for mentors
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
    { id: 'leadership', name: 'Leadership', category: 'Soft Skills' }
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

  // Available options for both
  availableInterests: string[] = [
    'Web Development', 'Mobile Development', 'Data Science', 'AI/ML', 'Cybersecurity',
    'UI/UX Design', 'Game Development', 'Digital Marketing', 'Business', 'Entrepreneurship',
    'Research', 'Teaching', 'Writing', 'Photography', 'Music', 'Art'
  ];

  availableHobbies: string[] = [
    'Coding', 'Reading', 'Gaming', 'Sports', 'Music', 'Art', 'Photography', 'Travel',
    'Cooking', 'Gardening', 'Movies', 'Anime', 'Fitness', 'Dancing', 'Writing', 'Blogging'
  ];

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.initializeForm();
    this.loadUserData();
  }

  initializeForm() {
    this.profileForm = this.formBuilder.group({
      firstName: [this.user.firstName, [Validators.required, Validators.minLength(2)]],
      lastName: [this.user.lastName, [Validators.required, Validators.minLength(2)]],
      email: [this.user.email, [Validators.required, Validators.email]],
      school: [this.user.school],
      position: [this.user.position],
      bio: [this.user.bio, [Validators.maxLength(500)]],
      phone: [this.user.phone],
      linkedIn: [this.user.linkedIn],
      facebook: [this.user.facebook],
      experience: [this.user.experience]
    });
  }

  loadUserData() {
    // Initialize selected arrays based on user data
    this.selectedInterests = this.user.interests || [];
    this.selectedHobbies = this.user.hobbies || [];
    if (this.user.userType === 'mentor') {
      this.selectedSkills = this.user.skills || [];
      this.selectedExpertiseFields = this.user.expertiseFields || [];
    }
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      // Reset form if canceling
      this.initializeForm();
      this.loadUserData();
    }
  }

  onSaveProfile() {
    if (this.profileForm.valid) {
      this.isLoading = true;
      
      // Simulate API call
      setTimeout(() => {
        const formData = this.profileForm.value;
        
        // Update user data
        const updatedUser = {
          ...this.user,
          ...formData,
          interests: this.selectedInterests,
          hobbies: this.selectedHobbies,
          ...(this.user.userType === 'mentor' && {
            skills: this.selectedSkills,
            expertiseFields: this.selectedExpertiseFields
          })
        };

        console.log('Profile updated:', updatedUser);
        this.isLoading = false;
        this.isEditing = false;
        
        // Emit the updated user data to parent
        this.userUpdated.emit(updatedUser);
        
        // Show success message
        alert('Profile na-update na successfully!');
      }, 1500);
    } else {
      console.log('Form is invalid');
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched() {
    Object.keys(this.profileForm.controls).forEach(key => {
      const control = this.profileForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  onSkillToggle(skillId: string) {
    const index = this.selectedSkills.indexOf(skillId);
    if (index > -1) {
      this.selectedSkills.splice(index, 1);
    } else {
      this.selectedSkills.push(skillId);
    }
  }

  onExpertiseToggle(fieldId: string) {
    const index = this.selectedExpertiseFields.indexOf(fieldId);
    if (index > -1) {
      this.selectedExpertiseFields.splice(index, 1);
    } else {
      this.selectedExpertiseFields.push(fieldId);
    }
  }

  onInterestToggle(interest: string) {
    const index = this.selectedInterests.indexOf(interest);
    if (index > -1) {
      this.selectedInterests.splice(index, 1);
    } else {
      this.selectedInterests.push(interest);
    }
  }

  onHobbyToggle(hobby: string) {
    const index = this.selectedHobbies.indexOf(hobby);
    if (index > -1) {
      this.selectedHobbies.splice(index, 1);
    } else {
      this.selectedHobbies.push(hobby);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // In a real app, you would upload this to a server
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.user.avatar = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  getSkillsByCategory(category: string): Skill[] {
    return this.availableSkills.filter(skill => skill.category === category);
  }

  getSkillCategories(): string[] {
    return [...new Set(this.availableSkills.map(skill => skill.category))];
  }

  getUserInitials(): string {
    return `${this.user.firstName.charAt(0)}${this.user.lastName.charAt(0)}`.toUpperCase();
  }

  getSkillName(skillId: string): string {
    const skill = this.availableSkills.find(s => s.id === skillId);
    return skill ? skill.name : '';
  }

  getExpertiseFieldName(fieldId: string): string {
    const field = this.availableExpertiseFields.find(f => f.id === fieldId);
    return field ? field.name : '';
  }

  getExpertiseFieldDescription(fieldId: string): string {
    const field = this.availableExpertiseFields.find(f => f.id === fieldId);
    return field ? field.description : '';
  }
}
