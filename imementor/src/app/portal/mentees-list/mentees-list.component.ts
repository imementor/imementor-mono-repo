import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Mentee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  school: string;
  program: string;
  yearLevel: string;
  interests: string[];
  dateJoined: Date;
  lastActive: Date;
  sessionsCompleted: number;
  status: 'active' | 'inactive' | 'pending';
}

@Component({
  selector: 'app-mentees-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mentees-list.component.html',
  styleUrl: './mentees-list.component.scss'
})
export class MenteesListComponent {
  searchQuery = '';
  selectedFilter = 'all';
  sortBy = 'name';

  mentees: Mentee[] = [
    {
      id: '1',
      firstName: 'Maria',
      lastName: 'Santos',
      email: 'maria.santos@email.com',
      school: 'University of the Philippines',
      program: 'Computer Science',
      yearLevel: '3rd Year',
      interests: ['Web Development', 'Mobile Apps'],
      dateJoined: new Date('2024-01-15'),
      lastActive: new Date('2024-08-04'),
      sessionsCompleted: 12,
      status: 'active'
    },
    {
      id: '2',
      firstName: 'Jose',
      lastName: 'Rodriguez',
      email: 'jose.rodriguez@email.com',
      school: 'Ateneo de Manila University',
      program: 'Information Technology',
      yearLevel: '2nd Year',
      interests: ['Data Science', 'AI/ML'],
      dateJoined: new Date('2024-02-20'),
      lastActive: new Date('2024-08-03'),
      sessionsCompleted: 8,
      status: 'active'
    },
    {
      id: '3',
      firstName: 'Ana',
      lastName: 'Garcia',
      email: 'ana.garcia@email.com',
      school: 'De La Salle University',
      program: 'Software Engineering',
      yearLevel: '4th Year',
      interests: ['Full Stack Development', 'DevOps'],
      dateJoined: new Date('2024-03-10'),
      lastActive: new Date('2024-07-30'),
      sessionsCompleted: 15,
      status: 'inactive'
    },
    {
      id: '4',
      firstName: 'Carlos',
      lastName: 'Mendoza',
      email: 'carlos.mendoza@email.com',
      school: 'University of Santo Tomas',
      program: 'Computer Engineering',
      yearLevel: '1st Year',
      interests: ['Web Development', 'Game Development'],
      dateJoined: new Date('2024-07-15'),
      lastActive: new Date('2024-08-05'),
      sessionsCompleted: 3,
      status: 'pending'
    }
  ];

  get filteredMentees(): Mentee[] {
    let filtered = this.mentees;

    // Apply search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(mentee => 
        mentee.firstName.toLowerCase().includes(query) ||
        mentee.lastName.toLowerCase().includes(query) ||
        mentee.email.toLowerCase().includes(query) ||
        mentee.school.toLowerCase().includes(query) ||
        mentee.program.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (this.selectedFilter !== 'all') {
      filtered = filtered.filter(mentee => mentee.status === this.selectedFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (this.sortBy) {
        case 'name':
          return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        case 'school':
          return a.school.localeCompare(b.school);
        case 'dateJoined':
          return b.dateJoined.getTime() - a.dateJoined.getTime();
        case 'lastActive':
          return b.lastActive.getTime() - a.lastActive.getTime();
        case 'sessions':
          return b.sessionsCompleted - a.sessionsCompleted;
        default:
          return 0;
      }
    });

    return filtered;
  }

  onSearchChange(event: any) {
    this.searchQuery = event.target.value;
  }

  onFilterChange(event: any) {
    this.selectedFilter = event.target.value;
  }

  onSortChange(event: any) {
    this.sortBy = event.target.value;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'active':
        return 'status-active';
      case 'inactive':
        return 'status-inactive';
      case 'pending':
        return 'status-pending';
      default:
        return '';
    }
  }

  getInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }

  onMenteeClick(mentee: Mentee) {
    console.log('Selected mentee:', mentee);
    // Here you can implement navigation to mentee detail view or start a session
  }

  onStartSession(mentee: Mentee, event: Event) {
    event.stopPropagation();
    console.log('Starting session with:', mentee);
    // Implement session start logic
  }

  onSendMessage(mentee: Mentee, event: Event) {
    event.stopPropagation();
    console.log('Sending message to:', mentee);
    // Implement message sending logic
  }
}
