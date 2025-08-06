import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookSessionModalComponent, Mentor, SessionBooking } from '../../shared/book-session-modal/book-session-modal.component';
import { LiveClassDetailsModalComponent } from '../../shared/live-class-details-modal/live-class-details-modal.component';

export interface LiveClass {
  id: string;
  title: string;
  description: string;
  mentor: {
    id: string;
    name: string;
    avatar: string;
    expertise: string[];
  };
  category: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: number; // in minutes
  maxParticipants: number;
  currentParticipants: number;
  status: 'upcoming' | 'live' | 'ended';
  coverImage: string;
  price: number;
  isRegistered: boolean;
  zoomLink?: string;
  requirements?: string[];
  topics: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

@Component({
  selector: 'app-live-classes',
  standalone: true,
  imports: [CommonModule, FormsModule, BookSessionModalComponent, LiveClassDetailsModalComponent],
  templateUrl: './live-classes.component.html',
  styleUrl: './live-classes.component.scss'
})
export class LiveClassesComponent implements OnInit {
  liveClasses: LiveClass[] = [];
  filteredClasses: LiveClass[] = [];
  searchTerm = '';
  selectedCategory = 'all';
  selectedStatus = 'all';
  selectedDifficulty = 'all';
  sortBy = 'date';
  sortOrder: 'asc' | 'desc' = 'asc';

  categories = [
    'Programming',
    'Data Science',
    'Web Development',
    'Mobile Development',
    'Design',
    'Business',
    'Marketing',
    'Language Learning'
  ];

  // Book session modal properties
  isBookSessionModalOpen = false;
  selectedMentorForBooking: Mentor | null = null;

  // Live class details modal properties
  showDetailsModal = false;
  selectedClassId: string | null = null;

  ngOnInit() {
    this.loadLiveClasses();
    this.applyFilters();
  }

  loadLiveClasses() {
    // Mock data for live classes
    this.liveClasses = [
      {
        id: '1',
        title: 'Introduction to React Development',
        description: 'Learn the fundamentals of React including components, state management, and hooks.',
        mentor: {
          id: 'm1',
          name: 'Dr. Maria Santos',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
          expertise: ['React', 'JavaScript', 'Frontend Development']
        },
        category: 'Web Development',
        scheduledDate: '2024-01-15',
        scheduledTime: '14:00',
        duration: 120,
        maxParticipants: 50,
        currentParticipants: 32,
        status: 'upcoming',
        coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=200&fit=crop',
        price: 1500,
        isRegistered: false,
        topics: ['Components', 'JSX', 'State', 'Props', 'Hooks'],
        difficulty: 'Beginner',
        requirements: ['Basic JavaScript knowledge', 'HTML/CSS familiarity']
      },
      {
        id: '2',
        title: 'Python Data Analysis Workshop',
        description: 'Hands-on workshop covering pandas, numpy, and data visualization techniques.',
        mentor: {
          id: 'm2',
          name: 'Prof. Juan Dela Cruz',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          expertise: ['Python', 'Data Science', 'Machine Learning']
        },
        category: 'Data Science',
        scheduledDate: '2024-01-14',
        scheduledTime: '10:00',
        duration: 180,
        maxParticipants: 30,
        currentParticipants: 28,
        status: 'live',
        coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop',
        price: 2000,
        isRegistered: true,
        zoomLink: 'https://zoom.us/j/123456789',
        topics: ['Pandas', 'NumPy', 'Matplotlib', 'Data Cleaning'],
        difficulty: 'Intermediate',
        requirements: ['Python basics', 'Statistics knowledge helpful']
      },
      {
        id: '3',
        title: 'UI/UX Design Fundamentals',
        description: 'Learn design principles, user research, and prototyping techniques.',
        mentor: {
          id: 'm3',
          name: 'Anna Rodriguez',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
          expertise: ['UI Design', 'UX Research', 'Figma']
        },
        category: 'Design',
        scheduledDate: '2024-01-16',
        scheduledTime: '16:00',
        duration: 150,
        maxParticipants: 40,
        currentParticipants: 15,
        status: 'upcoming',
        coverImage: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400&h=200&fit=crop',
        price: 1800,
        isRegistered: false,
        topics: ['Design Thinking', 'Wireframing', 'Prototyping', 'User Testing'],
        difficulty: 'Beginner',
        requirements: ['No prior experience needed', 'Figma account recommended']
      },
      {
        id: '4',
        title: 'Advanced JavaScript Patterns',
        description: 'Dive deep into JavaScript design patterns, closures, and asynchronous programming.',
        mentor: {
          id: 'm4',
          name: 'Mark Thompson',
          avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
          expertise: ['JavaScript', 'Node.js', 'TypeScript']
        },
        category: 'Programming',
        scheduledDate: '2024-01-12',
        scheduledTime: '18:00',
        duration: 90,
        maxParticipants: 25,
        currentParticipants: 25,
        status: 'ended',
        coverImage: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=200&fit=crop',
        price: 2500,
        isRegistered: true,
        topics: ['Design Patterns', 'Async/Await', 'Closures', 'Performance'],
        difficulty: 'Advanced',
        requirements: ['Strong JavaScript foundation', '2+ years experience']
      },
      {
        id: '5',
        title: 'Mobile App Development with Flutter',
        description: 'Build cross-platform mobile apps using Flutter and Dart programming language.',
        mentor: {
          id: 'm5',
          name: 'Sarah Chen',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
          expertise: ['Flutter', 'Dart', 'Mobile Development']
        },
        category: 'Mobile Development',
        scheduledDate: '2024-01-18',
        scheduledTime: '13:00',
        duration: 240,
        maxParticipants: 35,
        currentParticipants: 12,
        status: 'upcoming',
        coverImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=200&fit=crop',
        price: 3000,
        isRegistered: false,
        topics: ['Flutter Widgets', 'State Management', 'API Integration', 'Publishing'],
        difficulty: 'Intermediate',
        requirements: ['Dart basics', 'Programming experience', 'Android Studio/VS Code']
      }
    ];
  }

  applyFilters() {
    this.filteredClasses = this.liveClasses.filter(liveClass => {
      const matchesSearch = liveClass.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           liveClass.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           liveClass.mentor.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesCategory = this.selectedCategory === 'all' || liveClass.category === this.selectedCategory;
      const matchesStatus = this.selectedStatus === 'all' || liveClass.status === this.selectedStatus;
      const matchesDifficulty = this.selectedDifficulty === 'all' || liveClass.difficulty === this.selectedDifficulty;
      
      return matchesSearch && matchesCategory && matchesStatus && matchesDifficulty;
    });

    this.sortClasses();
  }

  sortClasses() {
    this.filteredClasses.sort((a, b) => {
      let valueA: any, valueB: any;

      switch (this.sortBy) {
        case 'date':
          valueA = new Date(a.scheduledDate + ' ' + a.scheduledTime);
          valueB = new Date(b.scheduledDate + ' ' + b.scheduledTime);
          break;
        case 'title':
          valueA = a.title.toLowerCase();
          valueB = b.title.toLowerCase();
          break;
        case 'price':
          valueA = a.price;
          valueB = b.price;
          break;
        case 'participants':
          valueA = a.currentParticipants;
          valueB = b.currentParticipants;
          break;
        default:
          return 0;
      }

      if (valueA < valueB) return this.sortOrder === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  onSearch() {
    this.applyFilters();
  }

  onCategoryChange() {
    this.applyFilters();
  }

  onStatusChange() {
    this.applyFilters();
  }

  onDifficultyChange() {
    this.applyFilters();
  }

  onSortChange() {
    this.sortClasses();
  }

  toggleSortOrder() {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortClasses();
  }

  registerForClass(classId: string) {
    const liveClass = this.liveClasses.find(c => c.id === classId);
    if (liveClass && !liveClass.isRegistered && liveClass.currentParticipants < liveClass.maxParticipants) {
      liveClass.isRegistered = true;
      liveClass.currentParticipants++;
      console.log(`Registered for class: ${liveClass.title}`);
      this.applyFilters();
    }
  }

  unregisterFromClass(classId: string) {
    const liveClass = this.liveClasses.find(c => c.id === classId);
    if (liveClass && liveClass.isRegistered) {
      liveClass.isRegistered = false;
      liveClass.currentParticipants--;
      console.log(`Unregistered from class: ${liveClass.title}`);
      this.applyFilters();
    }
  }

  joinLiveClass(liveClass: LiveClass) {
    if (liveClass.status === 'live' && liveClass.isRegistered && liveClass.zoomLink) {
      window.open(liveClass.zoomLink, '_blank');
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'live': return '#10b981';
      case 'upcoming': return '#3b82f6';
      case 'ended': return '#6b7280';
      default: return '#6b7280';
    }
  }

  getDifficultyColor(difficulty: string): string {
    switch (difficulty) {
      case 'Beginner': return '#10b981';
      case 'Intermediate': return '#f59e0b';
      case 'Advanced': return '#ef4444';
      default: return '#6b7280';
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  formatTime(time: string): string {
    const [hours, minutes] = time.split(':');
    const hour24 = parseInt(hours);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  }

  // Book session modal methods
  openBookSessionModal(liveClass: LiveClass) {
    // Convert LiveClass mentor to Mentor format
    this.selectedMentorForBooking = {
      id: liveClass.mentor.id,
      name: liveClass.mentor.name,
      avatar: liveClass.mentor.avatar,
      expertise: liveClass.mentor.expertise,
      bio: `Experienced mentor specializing in ${liveClass.mentor.expertise.join(', ')}`,
      rating: 4.8, // Mock rating
      sessionsCompleted: 150, // Mock sessions
      hourlyRate: 1200, // Mock hourly rate
      timezone: 'Asia/Manila', // Mock timezone
      responseTime: 'within 24 hours', // Mock response time
      availability: {
        monday: ['09:00-12:00', '14:00-17:00'],
        tuesday: [],
        wednesday: ['10:00-12:00'],
        thursday: [],
        friday: ['13:00-16:00'],
        saturday: [],
        sunday: []
      }, // Mock availability
      languages: ['English', 'Tagalog'] // Mock languages
    };
    this.isBookSessionModalOpen = true;
  }

  closeBookSessionModal() {
    this.isBookSessionModalOpen = false;
    this.selectedMentorForBooking = null;
  }

  onSessionBooked(booking: SessionBooking) {
    console.log('Session booked:', booking);
    // Here you would typically send the booking to your backend
    // For now, we'll just show a success message and close the modal
    alert(`Session booked successfully with ${this.selectedMentorForBooking?.name}!`);
    this.closeBookSessionModal();
  }

  // Live class details modal methods
  openDetailsModal(liveClass: LiveClass) {
    this.selectedClassId = liveClass.id;
    this.showDetailsModal = true;
  }

  closeDetailsModal() {
    this.showDetailsModal = false;
    this.selectedClassId = null;
  }

  onClassDetailsEnroll(classId: string) {
    const liveClass = this.liveClasses.find(c => c.id === classId);
    if (liveClass) {
      liveClass.isRegistered = true;
      liveClass.currentParticipants++;
      console.log('Enrolled in class:', liveClass.title);
      this.applyFilters(); // Refresh the display
    }
  }

  onClassDetailsJoin(classId: string) {
    const liveClass = this.liveClasses.find(c => c.id === classId);
    if (liveClass && liveClass.zoomLink) {
      window.open(liveClass.zoomLink, '_blank');
      console.log('Joined live class:', liveClass.title);
    }
  }

  onClassDetailsEdit(classId: string) {
    console.log('Edit not available for mentees');
  }

  onClassDetailsDelete(classId: string) {
    console.log('Delete not available for mentees');
  }
}
