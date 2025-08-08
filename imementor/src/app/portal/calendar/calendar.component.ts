import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent, PageAction } from '../../shared/components/layout/page-header/page-header.component';

export interface CalendarSession {
  id: string;
  title: string;
  topic: string;
  description: string;
  mentor: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    expertise: string[];
    rating: number;
  };
  date: Date;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  sessionType: 'video-call' | 'chat' | 'in-person';
  meetingLink?: string;
  location?: string;
  color: string; // for calendar display
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  sessions: CalendarSession[];
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit {
  // Header configuration
  headerActions: PageAction[] = [];
  
  // Calendar data
  currentDate = new Date();
  currentMonth = new Date();
  calendarDays: CalendarDay[] = [];
  sessions: CalendarSession[] = [];
  
  // View options
  viewMode: 'month' | 'week' | 'day' = 'month';
  
  // Session details modal
  selectedSession: CalendarSession | null = null;
  showSessionDetails = false;
  
  // Calendar navigation
  monthNames = [
    'Enero', 'Pebrero', 'Marso', 'Abril', 'Mayo', 'Hunyo',
    'Hulyo', 'Agosto', 'Setyembre', 'Oktubre', 'Nobyembre', 'Disyembre'
  ];
  
  dayNames = ['Lin', 'Mar', 'Miy', 'Huw', 'Biy', 'Sab', 'Lin'];

  ngOnInit() {
    this.loadSessions();
    this.setupHeaderActions();
    this.generateCalendar();
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
        label: 'Today',
        icon: '📅',
        action: () => this.goToToday(),
        class: 'secondary'
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
          rating: 4.9
        },
        date: new Date('2025-08-06'),
        startTime: '10:00 AM',
        endTime: '11:30 AM',
        duration: 90,
        status: 'upcoming',
        sessionType: 'video-call',
        meetingLink: 'https://meet.google.com/abc-defg-hij',
        color: '#3b82f6'
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
          rating: 4.8
        },
        date: new Date('2025-08-05'),
        startTime: '2:00 PM',
        endTime: '3:00 PM',
        duration: 60,
        status: 'ongoing',
        sessionType: 'video-call',
        meetingLink: 'https://zoom.us/j/123456789',
        color: '#10b981'
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
          rating: 4.7
        },
        date: new Date('2025-08-07'),
        startTime: '3:30 PM',
        endTime: '5:00 PM',
        duration: 90,
        status: 'upcoming',
        sessionType: 'chat',
        color: '#8b5cf6'
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
          rating: 4.9
        },
        date: new Date('2025-08-08'),
        startTime: '1:00 PM',
        endTime: '2:30 PM',
        duration: 90,
        status: 'upcoming',
        sessionType: 'video-call',
        color: '#f59e0b'
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
          rating: 4.6
        },
        date: new Date('2025-08-12'),
        startTime: '9:00 AM',
        endTime: '10:30 AM',
        duration: 90,
        status: 'upcoming',
        sessionType: 'video-call',
        color: '#ef4444'
      },
      {
        id: '6',
        title: 'Frontend Development Review',
        topic: 'JavaScript Advanced Concepts',
        description: 'Review of advanced JavaScript concepts and best practices',
        mentor: {
          id: 'm1',
          firstName: 'Maria',
          lastName: 'Santos',
          expertise: ['Web Development', 'JavaScript', 'React'],
          rating: 4.9
        },
        date: new Date('2025-08-14'),
        startTime: '11:00 AM',
        endTime: '12:00 PM',
        duration: 60,
        status: 'upcoming',
        sessionType: 'video-call',
        color: '#3b82f6'
      }
    ];
    
    this.generateCalendar();
  }

  generateCalendar() {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    
    // Get first day of the month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Get the day of week for the first day (0 = Sunday, 1 = Monday, etc.)
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // Generate 42 days (6 weeks) for the calendar grid
    this.calendarDays = [];
    const today = new Date();
    
    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      // Get sessions for this date
      const daySessions = this.sessions.filter(session => 
        this.isSameDay(session.date, currentDate)
      );
      
      this.calendarDays.push({
        date: new Date(currentDate),
        isCurrentMonth: currentDate.getMonth() === month,
        isToday: this.isSameDay(currentDate, today),
        sessions: daySessions
      });
    }
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  }

  // Navigation methods
  previousMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1);
    this.generateCalendar();
  }

  nextMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1);
    this.generateCalendar();
  }

  goToToday() {
    this.currentMonth = new Date();
    this.generateCalendar();
  }

  setViewMode(mode: 'month' | 'week' | 'day') {
    this.viewMode = mode;
  }

  // Session methods
  onSessionClick(session: CalendarSession) {
    this.selectedSession = session;
    this.showSessionDetails = true;
  }

  closeSessionDetails() {
    this.showSessionDetails = false;
    this.selectedSession = null;
  }

  joinSession(session: CalendarSession) {
    if (session.sessionType === 'video-call' && session.meetingLink) {
      window.open(session.meetingLink, '_blank');
    }
    this.closeSessionDetails();
  }

  rescheduleSession(session: CalendarSession) {
    console.log('Reschedule session:', session.title);
    // Implement reschedule functionality
    this.closeSessionDetails();
  }

  cancelSession(session: CalendarSession) {
    if (confirm(`Sigurado ba kayong gusto ninyong i-cancel ang session na "${session.title}"?`)) {
      session.status = 'cancelled';
      console.log('Session cancelled:', session.title);
      this.closeSessionDetails();
    }
  }

  bookNewSession() {
    console.log('Book new session');
    // Navigate to session booking page
  }

  // Utility methods
  getCurrentMonthYear(): string {
    return `${this.monthNames[this.currentMonth.getMonth()]} ${this.currentMonth.getFullYear()}`;
  }

  getSessionStatusClass(status: string): string {
    switch (status) {
      case 'upcoming': return 'status-upcoming';
      case 'ongoing': return 'status-ongoing';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  }

  getSessionStatusText(status: string): string {
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

  formatTime(time: string): string {
    return time;
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('tl-PH', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  getMentorName(mentor: any): string {
    return `${mentor.firstName} ${mentor.lastName}`;
  }

  getSessionsForDate(date: Date): CalendarSession[] {
    return this.sessions.filter(session => this.isSameDay(session.date, date));
  }

  getSessionsForHour(day: CalendarDay, hour: number): CalendarSession[] {
    return day.sessions.filter(session => {
      const sessionHour = parseInt(session.startTime.split(':')[0]);
      const sessionPeriod = session.startTime.includes('PM') ? 'PM' : 'AM';
      let sessionHour24 = sessionHour;
      
      if (sessionPeriod === 'PM' && sessionHour !== 12) {
        sessionHour24 = sessionHour + 12;
      } else if (sessionPeriod === 'AM' && sessionHour === 12) {
        sessionHour24 = 0;
      }
      
      return sessionHour24 === hour;
    });
  }

  getUpcomingSessionsCount(): number {
    return this.sessions.filter(s => s.status === 'upcoming').length;
  }

  getTodaySessionsCount(): number {
    const today = new Date();
    return this.sessions.filter(s => this.isSameDay(s.date, today)).length;
  }

  getThisWeekSessionsCount(): number {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    return this.sessions.filter(s => s.date >= startOfWeek && s.date <= endOfWeek).length;
  }
}
