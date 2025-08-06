import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

export interface LoginData {
  email: string;
  password: string;
  userType: 'mentor' | 'mentee';
}

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  userType: 'mentor' | 'mentee' = 'mentee';
  showPassword = false;
  rememberMe = false;

  constructor(private router: Router) {}
  isLoading = false;

  loginData: LoginData = {
    email: '',
    password: '',
    userType: 'mentee'
  };

  selectUserType(type: 'mentor' | 'mentee') {
    this.userType = type;
    this.loginData.userType = type;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onLogin() {
    if (this.isLoading) return;

    this.isLoading = true;
    
    // Simulate API call
    setTimeout(() => {
      console.log('Login attempt:', {
        ...this.loginData,
        rememberMe: this.rememberMe
      });
      
      // Here you would typically call your authentication service
      this.isLoading = false;
      
      // Navigate to homepage after successful login
      this.router.navigate(['/homepage']);
    }, 1500);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToHome() {
    this.router.navigate(['/']);
  }
}
