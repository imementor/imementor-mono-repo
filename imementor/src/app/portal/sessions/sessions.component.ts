import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent, PageAction } from '../../shared/components/layout/page-header/page-header.component';

export interface Mentor {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  expertise: string[];
  rating: number;
  isOnline: boolean;
}

export interface Session {
  id: string;
  title: string;
  topic: string;
  description: string;
  mentor: Mentor;
  date: Date;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  sessionType: 'video-call' | 'chat' | 'in-person';
  meetingLink?: string;
  location?: string;
  notes?: string;
  materials?: string[];
}

@Component({
  selector: 'app-sessions',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent],
  templateUrl: './sessions.component.html',
  styleUrl: './sessions.component.scss'
})
export class SessionsComponent implements OnInit {
  // Header configuration
  headerActions: PageAction[] = [];
  
  // Filter and search
  searchTerm = '';
  selectedFilter = 'all';
  selectedDateFilter = 'all';
  
  // Sessions data
  sessions: Session[] = [];
  filteredSessions: Session[] = [];
  
  // Filter options
  statusFilters = [
    { value: 'all', label: 'Lahat ng Sessions' },
    { value: 'upcoming', label: 'Mga Darating' },
    { value: 'ongoing', label: 'Kasalukuyang Nagaganap' },
    { value: 'completed', label: 'Natapos na' },
    { value: 'cancelled', label: 'Na-cancel' }
  ];
  
  dateFilters = [
    { value: 'all', label: 'Lahat ng Petsa' },
    { value: 'today', label: 'Ngayong Araw' },
    { value: 'tomorrow', label: 'Bukas' },
    { value: 'this-week', label: 'Ngayong Linggo' },
    { value: 'next-week', label: 'Susunod na Linggo' },
    { value: 'this-month', label: 'Ngayong Buwan' }
  ];

  ngOnInit() {
    this.loadSessions();
    this.setupHeaderActions();
    this.filterSessions();
  }

  setupHeaderActions() {
    this.headerActions = [
      {
        label: 'Book Session',
        icon: '➕',
        action: () => this.bookNewSession(),
        class: ''
      },
      {
        label: 'Refresh',
        icon: '🔄',
        action: () => this.loadSessions(),
        class: 'secondary'
      }
    ];
  }

  loadSessions() {
    // Mock sessions data
    this.sessions = [
      {
        id: '1',
        title: 'Web Development Fundamentals',
        topic: 'HTML, CSS, JavaScript Basics',
        description: 'Introduction to web development concepts and building your first webpage',
        mentor: {
          id: 'm1',
          firstName: 'Maria',
          lastName: 'Santos',
          expertise: ['Web Development', 'JavaScript', 'React'],
          rating: 4.9,
          isOnline: true
        },
        date: new Date('2025-08-06'),
        startTime: '10:00 AM',
        endTime: '11:30 AM',
        duration: 90,
        status: 'upcoming',
        sessionType: 'video-call',
        meetingLink: 'https://meet.google.com/abc-defg-hij',
        materials: ['HTML Basics Guide', 'CSS Cheat Sheet']
      },
      {
        id: '2',
        title: 'Data Science with Python',
        topic: 'Pandas and Data Analysis',
        description: 'Learn how to manipulate and analyze data using Python pandas library',
        mentor: {
          id: 'm2',
          firstName: 'John',
          lastName: 'Dela Cruz',
          expertise: ['Data Science', 'Python', 'Machine Learning'],
          rating: 4.8,
          isOnline: false
        },
        date: new Date('2025-08-05'),
        startTime: '2:00 PM',
        endTime: '3:00 PM',
        duration: 60,
        status: 'ongoing',
        sessionType: 'video-call',
        meetingLink: 'https://zoom.us/j/123456789'
      },
      {
        id: '3',
        title: 'Mobile App Development',
        topic: 'React Native Introduction',
        description: 'Getting started with React Native for cross-platform mobile development',
        mentor: {
          id: 'm3',
          firstName: 'Ana',
          lastName: 'Rodriguez',
          expertise: ['Mobile Development', 'React Native', 'Flutter'],
          rating: 4.7,
          isOnline: true
        },
        date: new Date('2025-08-07'),
        startTime: '3:30 PM',
        endTime: '5:00 PM',
        duration: 90,
        status: 'upcoming',
        sessionType: 'chat',
        notes: 'Mag-prepare ng development environment'
      },
      {
        id: '4',
        title: 'UI/UX Design Principles',
        topic: 'Design Thinking Process',
        description: 'Understanding user-centered design and creating better user experiences',
        mentor: {
          id: 'm4',
          firstName: 'Miguel',
          lastName: 'Garcia',
          expertise: ['UI/UX Design', 'Figma', 'User Research'],
          rating: 4.9,
          isOnline: true
        },
        date: new Date('2025-08-03'),
        startTime: '1:00 PM',
        endTime: '2:30 PM',
        duration: 90,
        status: 'completed',
        sessionType: 'video-call',
        notes: 'Great session! Learned a lot about user personas.'
      },
      {
        id: '5',
        title: 'Database Design',
        topic: 'SQL and Relational Databases',
        description: 'Learn database design principles and SQL query optimization',
        mentor: {
          id: 'm5',
          firstName: 'Sofia',
          lastName: 'Reyes',
          expertise: ['Database Design', 'SQL', 'MongoDB'],
          rating: 4.6,
          isOnline: false
        },
        date: new Date('2025-08-08'),
        startTime: '9:00 AM',
        endTime: '10:30 AM',
        duration: 90,
        status: 'upcoming',
        sessionType: 'video-call',
        meetingLink: 'https://teams.microsoft.com/l/meetup-join/...'
      }
    ];
    
    this.filterSessions();
  }

  filterSessions() {
    this.filteredSessions = this.sessions.filter(session => {
      // Search filter
      const matchesSearch = !this.searchTerm || 
        session.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        session.topic.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        `${session.mentor.firstName} ${session.mentor.lastName}`.toLowerCase().includes(this.searchTerm.toLowerCase());

      // Status filter
      const matchesStatus = this.selectedFilter === 'all' || session.status === this.selectedFilter;

      // Date filter
      const matchesDate = this.matchesDateFilter(session.date);

      return matchesSearch && matchesStatus && matchesDate;
    }).sort((a, b) => {
      // Sort by date and time
      const dateA = new Date(`${a.date.toDateString()} ${a.startTime}`);
      const dateB = new Date(`${b.date.toDateString()} ${b.startTime}`);
      return dateA.getTime() - dateB.getTime();
    });
  }

  matchesDateFilter(sessionDate: Date): boolean {
    if (this.selectedDateFilter === 'all') return true;

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    switch (this.selectedDateFilter) {
      case 'today':
        return this.isSameDay(sessionDate, today);
      case 'tomorrow':
        return this.isSameDay(sessionDate, tomorrow);
      case 'this-week':
        return this.isThisWeek(sessionDate);
      case 'next-week':
        return this.isNextWeek(sessionDate);
      case 'this-month':
        return this.isThisMonth(sessionDate);
      default:
        return true;
    }
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  }

  isThisWeek(date: Date): boolean {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    return date >= startOfWeek && date <= endOfWeek;
  }

  isNextWeek(date: Date): boolean {
    const today = new Date();
    const startOfNextWeek = new Date(today);
    startOfNextWeek.setDate(today.getDate() - today.getDay() + 7);
    const endOfNextWeek = new Date(startOfNextWeek);
    endOfNextWeek.setDate(startOfNextWeek.getDate() + 6);
    
    return date >= startOfNextWeek && date <= endOfNextWeek;
  }

  isThisMonth(date: Date): boolean {
    const today = new Date();
    return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  }

  onSearchChange() {
    this.filterSessions();
  }

  onFilterChange() {
    this.filterSessions();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'upcoming': return 'status-upcoming';
      case 'ongoing': return 'status-ongoing';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'upcoming': return 'Darating';
      case 'ongoing': return 'Kasalukuyan';
      case 'completed': return 'Natapos';
      case 'cancelled': return 'Na-cancel';
      default: return status;
    }
  }

  getSessionTypeIcon(type: string): string {
    switch (type) {
      case 'video-call': return '📹';
      case 'chat': return '💬';
      case 'in-person': return '🏢';
      default: return '📝';
    }
  }

  formatDate(date: Date): string {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (this.isSameDay(date, today)) {
      return 'Ngayong Araw';
    } else if (this.isSameDay(date, tomorrow)) {
      return 'Bukas';
    } else {
      return date.toLocaleDateString('tl-PH', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  }

  getMentorInitials(mentor: Mentor): string {
    return `${mentor.firstName.charAt(0)}${mentor.lastName.charAt(0)}`.toUpperCase();
  }

  joinSession(session: Session) {
    if (session.sessionType === 'video-call' && session.meetingLink) {
      window.open(session.meetingLink, '_blank');
    } else {
      console.log('Joining session:', session.title);
      // Navigate to chat or other session type
    }
  }

  rescheduleSession(session: Session) {
    console.log('Reschedule session:', session.title);
    // Implement reschedule functionality
  }

  cancelSession(session: Session) {
    if (confirm(`Sigurado ba kayong gusto ninyong i-cancel ang session na "${session.title}"?`)) {
      session.status = 'cancelled';
      this.filterSessions();
      console.log('Session cancelled:', session.title);
    }
  }

  viewSessionDetails(session: Session) {
    console.log('View session details:', session);
    // Implement session details view
  }

  bookNewSession() {
    console.log('Book new session');
    // Navigate to session booking page
  }

  getUpcomingSessionsCount(): number {
    return this.sessions.filter(s => s.status === 'upcoming').length;
  }

  getOngoingSessionsCount(): number {
    return this.sessions.filter(s => s.status === 'ongoing').length;
  }

  getCompletedSessionsCount(): number {
    return this.sessions.filter(s => s.status === 'completed').length;
  }
}
