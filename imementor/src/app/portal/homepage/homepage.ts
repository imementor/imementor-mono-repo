import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { HeaderComponent } from '../../shared/components/layout/header/header.component';
import { SidePanelComponent } from '../../shared/components/layout/side-panel/side-panel.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ProfileComponent } from '../profile/profile.component';
import { MessagesComponent } from '../messages/messages.component';
import { SessionsComponent } from '../sessions/sessions.component';
import { MentorsSearchComponent } from '../mentors-search/mentors-search.component';
import { BadgesComponent } from '../badges/badges.component';
import { LearningPortalComponent } from '../learning-portal/learning-portal.component';
import { CalendarComponent } from '../calendar/calendar.component';
import { MenteesListComponent } from '../mentees-list/mentees-list.component';
import { CourseManagementComponent } from '../course-management/course-management.component';
import { LiveClassesComponent } from '../live-classes/live-classes.component';
import { LiveClassManagementComponent } from '../live-class-management/live-class-management.component';

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  userType: 'mentor' | 'mentee';
  avatar?: string;
  school?: string;
  position?: string;
  interests?: string[];
  hobbies?: string[];
  bio?: string;
  // Mentor specific fields
  skills?: string[];
  expertiseFields?: string[];
  experience?: string;
  achievements?: string[];
  // Contact info
  phone?: string;
  linkedIn?: string;
  facebook?: string;
}

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, HeaderComponent, SidePanelComponent, DashboardComponent, ProfileComponent, MessagesComponent, SessionsComponent, MentorsSearchComponent, CalendarComponent, BadgesComponent, LearningPortalComponent, MenteesListComponent, CourseManagementComponent, LiveClassesComponent, LiveClassManagementComponent],
  templateUrl: './homepage.html',
  styleUrl: './homepage.scss'
})
export class Homepage {
  private authService = inject(AuthService);
  
  currentUser: User = {
    firstName: 'Dr. Maria',
    lastName: 'Santos',
    email: 'maria.santos@email.com',
    userType: 'mentee',
    school: 'University of the Philippines',
    position: 'Senior Software Engineer & Professor',
    bio: 'Experienced software engineer and mentor with 10+ years in the industry.',
    interests: ['Web Development', 'Data Science', 'AI/ML'],
    hobbies: ['Teaching', 'Research', 'Traveling'],
    phone: '+63 912 345 6789',
    linkedIn: 'maria-santos',
    facebook: 'maria.santos',
    skills: ['JavaScript', 'Python', 'React', 'Node.js'],
    expertiseFields: ['Web Development', 'Data Science'],
    experience: '10+ years in software development',
    achievements: ['Published researcher', 'Tech conference speaker']
  };

  isSidePanelOpen = true;
  currentPage = 'dashboard';
  showUserMenu = false;

  constructor(private router: Router) {}

  onNavigate(page: string) {
    // Handle all pages within the homepage (no external navigation)
    this.currentPage = page;
  }

  onNavigateToProfile() {
    // Navigate to profile page from header dropdown
    this.currentPage = 'profile';
  }

  onToggleSidePanel() {
    this.isSidePanelOpen = !this.isSidePanelOpen;
  }

  onLogout() {
    console.log('Logging out...');
    this.authService.signOutAndRedirect();
  }
}
