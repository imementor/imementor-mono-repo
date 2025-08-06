import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  userType: 'mentor' | 'mentee';
  // Mentor-specific fields
  expertise?: string;
  experience?: string;
  bio?: string;
  // Mentee-specific fields
  interests?: string;
  goals?: string;
}

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  userType: 'mentor' | 'mentee' = 'mentee';
  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  acceptTerms = false;

  constructor(private router: Router) {}

  registerData: RegisterData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'mentee',
    expertise: '',
    experience: '',
    bio: '',
    interests: '',
    goals: ''
  };

  get passwordMismatch(): boolean {
    return this.registerData.password !== this.registerData.confirmPassword && 
           this.registerData.confirmPassword.length > 0;
  }

  selectUserType(type: 'mentor' | 'mentee') {
    this.userType = type;
    this.registerData.userType = type;
    
    // Clear type-specific fields when switching
    if (type === 'mentor') {
      this.registerData.interests = '';
      this.registerData.goals = '';
    } else {
      this.registerData.expertise = '';
      this.registerData.experience = '';
      this.registerData.bio = '';
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onRegister() {
    if (this.isLoading || this.passwordMismatch) return;

    this.isLoading = true;
    
    // Simulate API call
    setTimeout(() => {
      console.log('Registration attempt:', {
        ...this.registerData,
        password: '[REDACTED]',
        confirmPassword: '[REDACTED]'
      });
      
      // Here you would typically call your registration service
      this.isLoading = false;
      
      // Show success message and redirect
      if (this.userType === 'mentor') {
        alert(`Matagumpay na narehistro bilang ${this.userType}! Simulan natin ang mentor setup.`);
        // Navigate to mentor setup for new mentors
        this.router.navigate(['/mentor-setup']);
      } else {
        alert(`Matagumpay na narehistro bilang ${this.userType}! Maligayang pagdating sa IMementor!`);
        // Navigate directly to homepage for mentees
        this.router.navigate(['/homepage']);
      }
    }, 2000);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToHome() {
    this.router.navigate(['/']);
  }
}
