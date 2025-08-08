import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface LiveClassDetails {
  id: string;
  title: string;
  description: string;
  category: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: number; // in minutes
  maxParticipants: number;
  currentParticipants: number;
  status: 'draft' | 'scheduled' | 'live' | 'ended' | 'cancelled';
  coverImage: string;
  price: number;
  zoomLink?: string;
  requirements?: string[];
  topics: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  createdAt: string;
  updatedAt: string;
  instructor: {
    id: string;
    name: string;
    avatar: string;
    bio: string;
    rating: number;
    totalStudents: number;
  };
  registeredStudents: RegisteredStudent[];
  agenda?: AgendaItem[];
  materials?: ClassMaterial[];
}

export interface RegisteredStudent {
  id: string;
  name: string;
  email: string;
  avatar: string;
  school?: string;
  registeredAt: string;
  attended?: boolean;
  paymentStatus: 'pending' | 'paid' | 'refunded';
}

export interface AgendaItem {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  order: number;
}

export interface ClassMaterial {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'link' | 'document';
  url: string;
  size?: string;
  description?: string;
}

@Component({
  selector: 'app-live-class-details-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './live-class-details-modal.component.html',
  styleUrl: './live-class-details-modal.component.scss'
})
export class LiveClassDetailsModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() liveClassId: string | null = null;
  @Input() userRole: 'mentor' | 'mentee' = 'mentee'; // Different actions based on role
  @Output() close = new EventEmitter<void>();
  @Output() enroll = new EventEmitter<string>();
  @Output() join = new EventEmitter<string>();
  @Output() edit = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();

  liveClass: LiveClassDetails | null = null;
  activeTab: 'overview' | 'agenda' | 'materials' | 'students' = 'overview';
  loading = false;
  error: string | null = null;

  ngOnInit() {
    if (this.isOpen && this.liveClassId) {
      this.loadLiveClassDetails();
    }
  }

  ngOnChanges() {
    if (this.isOpen && this.liveClassId) {
      this.loadLiveClassDetails();
    }
  }

  loadLiveClassDetails() {
    this.loading = true;
    this.error = null;

    // Mock data for live class details
    setTimeout(() => {
      this.liveClass = {
        id: this.liveClassId!,
        title: 'Introduction to React Development',
        description: 'Learn the fundamentals of React including components, state management, and hooks. This comprehensive live class will take you from beginner to intermediate level with hands-on coding exercises and real-world examples.',
        category: 'Web Development',
        scheduledDate: '2024-01-15',
        scheduledTime: '14:00',
        duration: 120,
        maxParticipants: 50,
        currentParticipants: 32,
        status: 'scheduled',
        coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop&auto=format&q=80',
        price: 1500,
        topics: ['React Components', 'JSX Syntax', 'State Management', 'Props', 'React Hooks', 'Event Handling'],
        difficulty: 'Beginner',
        requirements: ['Basic JavaScript knowledge', 'HTML/CSS familiarity', 'Code editor installed'],
        createdAt: '2024-01-10T10:00:00Z',
        updatedAt: '2024-01-12T15:30:00Z',
        zoomLink: 'https://zoom.us/j/123456789',
        instructor: {
          id: 'mentor1',
          name: 'Maria Santos',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
          bio: 'Senior Frontend Developer with 8+ years of experience in React, JavaScript, and modern web technologies. Passionate about teaching and helping students build amazing web applications.',
          rating: 4.9,
          totalStudents: 2847
        },
        registeredStudents: [
          {
            id: 's1',
            name: 'Juan Dela Cruz',
            email: 'juan@email.com',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
            school: 'University of the Philippines',
            registeredAt: '2024-01-11T09:30:00Z',
            paymentStatus: 'paid'
          },
          {
            id: 's2',
            name: 'Maria Santos',
            email: 'maria@email.com',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
            school: 'Ateneo de Manila',
            registeredAt: '2024-01-12T14:20:00Z',
            paymentStatus: 'paid'
          },
          {
            id: 's3',
            name: 'Pedro Garcia',
            email: 'pedro@email.com',
            avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
            school: 'De La Salle University',
            registeredAt: '2024-01-09T13:45:00Z',
            paymentStatus: 'paid'
          }
        ],
        agenda: [
          {
            id: 'a1',
            title: 'Introduction & Setup',
            description: 'Welcome, introductions, and development environment setup',
            duration: 15,
            order: 1
          },
          {
            id: 'a2',
            title: 'React Fundamentals',
            description: 'Understanding components, JSX, and the virtual DOM',
            duration: 30,
            order: 2
          },
          {
            id: 'a3',
            title: 'State and Props',
            description: 'Working with component state and passing data with props',
            duration: 25,
            order: 3
          },
          {
            id: 'a4',
            title: 'Event Handling',
            description: 'Handling user interactions and form inputs',
            duration: 20,
            order: 4
          },
          {
            id: 'a5',
            title: 'Hands-on Exercise',
            description: 'Build a simple to-do list application',
            duration: 25,
            order: 5
          },
          {
            id: 'a6',
            title: 'Q&A and Wrap-up',
            description: 'Questions, answers, and next steps',
            duration: 5,
            order: 6
          }
        ],
        materials: [
          {
            id: 'm1',
            title: 'React Setup Guide',
            type: 'pdf',
            url: '#',
            size: '2.5 MB',
            description: 'Step-by-step guide to setting up your React development environment'
          },
          {
            id: 'm2',
            title: 'Component Examples',
            type: 'document',
            url: '#',
            description: 'Sample React components and code snippets'
          },
          {
            id: 'm3',
            title: 'Official React Documentation',
            type: 'link',
            url: 'https://react.dev',
            description: 'Link to the official React documentation'
          },
          {
            id: 'm4',
            title: 'Class Recording (Previous Session)',
            type: 'video',
            url: '#',
            size: '450 MB',
            description: 'Recording from the previous React fundamentals session'
          }
        ]
      };
      this.loading = false;
    }, 1000);
  }

  closeModal() {
    this.close.emit();
  }

  switchTab(tab: 'overview' | 'agenda' | 'materials' | 'students') {
    this.activeTab = tab;
  }

  enrollInClass() {
    if (this.liveClass) {
      this.enroll.emit(this.liveClass.id);
    }
  }

  joinClass() {
    if (this.liveClass) {
      this.join.emit(this.liveClass.id);
    }
  }

  editClass() {
    if (this.liveClass) {
      this.edit.emit(this.liveClass.id);
    }
  }

  deleteClass() {
    if (this.liveClass && confirm(`Are you sure you want to delete "${this.liveClass.title}"?`)) {
      this.delete.emit(this.liveClass.id);
    }
  }

  downloadMaterial(material: ClassMaterial) {
    console.log('Downloading material:', material.title);
    // In a real app, this would trigger the download
  }

  openMaterialLink(material: ClassMaterial) {
    if (material.type === 'link') {
      window.open(material.url, '_blank');
    }
  }

  // Image handling methods
  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop&auto=format&q=80';
    target.classList.add('error');
  }

  onImageLoad(event: Event) {
    const target = event.target as HTMLImageElement;
    target.classList.remove('loading');
  }

  onImageLoadStart(event: Event) {
    const target = event.target as HTMLImageElement;
    target.classList.add('loading');
  }

  getSafeImageUrl(url: string | undefined, fallback: string): string {
    if (!url) return fallback;
    if (url.includes('unsplash.com')) {
      return url + (url.includes('?') ? '&' : '?') + 'auto=format&q=80';
    }
    return url;
  }

  // Utility methods
  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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

  getStatusColor(status: string): string {
    switch (status) {
      case 'live': return '#10b981';
      case 'scheduled': return '#3b82f6';
      case 'ended': return '#6b7280';
      case 'draft': return '#f59e0b';
      case 'cancelled': return '#ef4444';
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

  getPaymentStatusColor(status: string): string {
    switch (status) {
      case 'paid': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'refunded': return '#ef4444';
      default: return '#6b7280';
    }
  }

  getMaterialIcon(type: string): string {
    switch (type) {
      case 'pdf': return '📄';
      case 'video': return '🎥';
      case 'link': return '🔗';
      case 'document': return '📝';
      default: return '📎';
    }
  }

  canEnroll(): boolean {
    return this.userRole === 'mentee' && 
           this.liveClass?.status === 'scheduled' && 
           this.liveClass?.currentParticipants < this.liveClass?.maxParticipants;
  }

  canJoin(): boolean {
    return this.liveClass?.status === 'live' && !!this.liveClass?.zoomLink;
  }

  canEdit(): boolean {
    return this.userRole === 'mentor' && 
           this.liveClass?.status !== 'ended' && 
           this.liveClass?.status !== 'cancelled';
  }

  canDelete(): boolean {
    return this.userRole === 'mentor';
  }

  isEnrolled(): boolean {
    // In a real app, this would check if the current user is enrolled
    return false;
  }
}
