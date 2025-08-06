import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  userType: 'mentor' | 'mentee';
  avatar?: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() user!: User;
  @Input() isSidePanelOpen = true;
  @Output() toggleSidePanel = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();
  @Output() navigateToProfile = new EventEmitter<void>();

  showUserMenu = false;

  get fullName(): string {
    return `${this.user.firstName} ${this.user.lastName}`;
  }

  get userInitials(): string {
    return `${this.user.firstName.charAt(0)}${this.user.lastName.charAt(0)}`.toUpperCase();
  }

  onToggleSidePanel() {
    this.toggleSidePanel.emit();
  }

  onToggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  onViewProfile() {
    this.showUserMenu = false;
    this.navigateToProfile.emit();
  }

  onLogout() {
    this.showUserMenu = false;
    this.logout.emit();
  }
}
