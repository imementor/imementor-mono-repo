import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface MentorProfileDetails {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  coverImage?: string;
  title: string;
  company: string;
  position: string;
  expertise: string[];
  field: string;
  skills: string[];
  rating: number;
  reviewCount: number;
  isOnline: boolean;
  bio: string;
  experience: number; // years
  hourlyRate?: number;
  languages: string[];
  location: string;
  timezone: string;
  availability: {
    available: boolean;
    nextAvailable?: Date;
  };
  sessionTypes: ('video-call' | 'chat' | 'in-person')[];
  totalSessions: number;
  responseTime: string;
  education: Education[];
  workExperience: WorkExperience[];
  certifications: Certification[];
  achievements: Achievement[];
  portfolio: PortfolioItem[];
  testimonials: Testimonial[];
  socialLinks: SocialLinks;
  mentoringSince: Date;
  completionRate: number;
  responseRate: number;
  averageSessionRating: number;
  totalMentees: number;
  specializations: string[];
  mentorshipStyle: string[];
  availableTimeSlots: AvailableTimeSlot[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startYear: number;
  endYear: number;
  description?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
  description: string;
  technologies?: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: Date;
  expiryDate?: Date;
  credentialId?: string;
  verificationUrl?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: Date;
  type: 'award' | 'publication' | 'project' | 'recognition';
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  projectUrl?: string;
  technologies: string[];
  category: string;
}

export interface Testimonial {
  id: string;
  menteeName: string;
  menteeAvatar?: string;
  rating: number;
  comment: string;
  date: Date;
  sessionType: string;
}

export interface SocialLinks {
  linkedin?: string;
  github?: string;
  twitter?: string;
  website?: string;
  medium?: string;
}

export interface AvailableTimeSlot {
  day: string;
  startTime: string;
  endTime: string;
  timezone: string;
}

@Component({
  selector: 'app-mentor-profile-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mentor-profile-modal.component.html',
  styleUrl: './mentor-profile-modal.component.scss'
})
export class MentorProfileModalComponent implements OnInit, OnChanges {
  @Input() mentorId: string | null = null;
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() bookSession = new EventEmitter<string>();
  @Output() sendMessage = new EventEmitter<string>();

  mentorProfile: MentorProfileDetails | null = null;
  activeTab: 'overview' | 'experience' | 'portfolio' | 'reviews' | 'availability' = 'overview';
  showFullBio = false;

  ngOnInit() {
    if (this.mentorId) {
      this.loadMentorProfile();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['mentorId'] && this.mentorId && this.isOpen) {
      this.loadMentorProfile();
    }
  }

  loadMentorProfile() {
    // Mock mentor profile data - in real app, this would come from an API
    this.mentorProfile = {
      id: this.mentorId || '1',
      firstName: 'Dr. Maria',
      lastName: 'Santos',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face&auto=format&q=80',
      coverImage: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&h=300&fit=crop&auto=format&q=80',
      title: 'Senior Software Engineer & Tech Lead',
      company: 'Google Philippines',
      position: 'Principal Software Engineer',
      expertise: ['Web Development', 'Data Science', 'Machine Learning', 'Cloud Architecture'],
      field: 'Software Engineering',
      skills: ['JavaScript', 'Python', 'React', 'Node.js', 'TensorFlow', 'AWS', 'Docker', 'Kubernetes'],
      rating: 4.9,
      reviewCount: 247,
      isOnline: true,
      bio: 'Passionate software engineer with over 10 years of experience in building scalable web applications and leading development teams. I specialize in full-stack development, cloud architecture, and machine learning. I have mentored over 200 developers and helped them advance their careers in tech. My approach to mentoring is hands-on and personalized, focusing on practical skills and real-world problem-solving.',
      experience: 12,
      hourlyRate: 2500,
      languages: ['English', 'Filipino', 'Spanish'],
      location: 'Manila, Philippines',
      timezone: 'Asia/Manila (GMT+8)',
      availability: {
        available: true,
        nextAvailable: new Date('2024-01-15T14:00:00')
      },
      sessionTypes: ['video-call', 'chat'],
      totalSessions: 892,
      responseTime: 'Within 2 hours',
      mentoringSince: new Date('2020-03-15'),
      completionRate: 98,
      responseRate: 99,
      averageSessionRating: 4.8,
      totalMentees: 156,
      specializations: ['Career Development', 'Technical Skills', 'System Design', 'Leadership'],
      mentorshipStyle: ['Hands-on', 'Project-based', 'Goal-oriented', 'Supportive'],
      education: [
        {
          id: 'edu1',
          institution: 'University of the Philippines',
          degree: 'PhD in Computer Science',
          field: 'Machine Learning',
          startYear: 2015,
          endYear: 2019,
          description: 'Specialized in deep learning algorithms and their applications in natural language processing.'
        },
        {
          id: 'edu2',
          institution: 'Ateneo de Manila University',
          degree: 'MS in Computer Science',
          field: 'Software Engineering',
          startYear: 2010,
          endYear: 2012,
          description: 'Focus on software architecture and distributed systems.'
        },
        {
          id: 'edu3',
          institution: 'De La Salle University',
          degree: 'BS in Computer Science',
          field: 'Computer Science',
          startYear: 2006,
          endYear: 2010,
          description: 'Graduated Magna Cum Laude with specialization in algorithms and data structures.'
        }
      ],
      workExperience: [
        {
          id: 'work1',
          company: 'Google Philippines',
          position: 'Principal Software Engineer',
          startDate: new Date('2020-01-15'),
          endDate: undefined,
          isCurrent: true,
          description: 'Leading a team of 15 engineers developing cloud-native applications. Responsible for technical architecture decisions and mentoring junior developers. Key achievements include reducing system latency by 40% and implementing ML-powered features.',
          technologies: ['Python', 'Go', 'Kubernetes', 'TensorFlow', 'BigQuery']
        },
        {
          id: 'work2',
          company: 'Microsoft Philippines',
          position: 'Senior Software Engineer',
          startDate: new Date('2017-06-01'),
          endDate: new Date('2019-12-31'),
          isCurrent: false,
          description: 'Developed enterprise-level web applications using .NET and Azure cloud services. Led migration projects from on-premise to cloud infrastructure.',
          technologies: ['C#', '.NET Core', 'Azure', 'React', 'SQL Server']
        },
        {
          id: 'work3',
          company: 'Accenture Philippines',
          position: 'Software Engineer',
          startDate: new Date('2012-07-01'),
          endDate: new Date('2017-05-31'),
          isCurrent: false,
          description: 'Worked on various client projects involving web development, database design, and system integration. Gained experience in multiple programming languages and frameworks.',
          technologies: ['Java', 'JavaScript', 'Oracle', 'Spring', 'Angular']
        }
      ],
      certifications: [
        {
          id: 'cert1',
          name: 'Google Cloud Professional Architect',
          issuer: 'Google Cloud',
          issueDate: new Date('2023-08-15'),
          expiryDate: new Date('2025-08-15'),
          credentialId: 'GCP-PA-2023-8901',
          verificationUrl: 'https://cloud.google.com/certification/verify'
        },
        {
          id: 'cert2',
          name: 'AWS Solutions Architect Professional',
          issuer: 'Amazon Web Services',
          issueDate: new Date('2022-11-20'),
          expiryDate: new Date('2025-11-20'),
          credentialId: 'AWS-SAP-2022-5678'
        },
        {
          id: 'cert3',
          name: 'TensorFlow Developer Certificate',
          issuer: 'TensorFlow',
          issueDate: new Date('2023-03-10'),
          expiryDate: new Date('2026-03-10'),
          credentialId: 'TF-DEV-2023-1234'
        }
      ],
      achievements: [
        {
          id: 'ach1',
          title: 'Google Cloud Innovation Award',
          description: 'Recognized for developing an innovative ML solution that improved user engagement by 35%',
          date: new Date('2023-10-15'),
          type: 'award'
        },
        {
          id: 'ach2',
          title: 'Published Research: "Deep Learning in Production"',
          description: 'Co-authored research paper published in IEEE Transactions on Software Engineering',
          date: new Date('2023-06-20'),
          type: 'publication'
        },
        {
          id: 'ach3',
          title: 'Speaker at DevFest Philippines 2023',
          description: 'Delivered keynote presentation on "Building Scalable ML Systems"',
          date: new Date('2023-11-25'),
          type: 'recognition'
        }
      ],
      portfolio: [
        {
          id: 'port1',
          title: 'E-commerce Platform with ML Recommendations',
          description: 'Built a scalable e-commerce platform with real-time product recommendations using machine learning',
          imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop&auto=format&q=80',
          projectUrl: 'https://github.com/mariasantos/ecommerce-ml',
          technologies: ['React', 'Node.js', 'Python', 'TensorFlow', 'AWS'],
          category: 'Web Development'
        },
        {
          id: 'port2',
          title: 'Microservices Architecture Framework',
          description: 'Designed and implemented a microservices framework used by multiple teams at Google',
          imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop&auto=format&q=80',
          projectUrl: 'https://github.com/mariasantos/microservices-framework',
          technologies: ['Go', 'Docker', 'Kubernetes', 'gRPC'],
          category: 'System Architecture'
        },
        {
          id: 'port3',
          title: 'Real-time Analytics Dashboard',
          description: 'Created a real-time analytics dashboard processing millions of events per second',
          imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop&auto=format&q=80',
          projectUrl: 'https://github.com/mariasantos/analytics-dashboard',
          technologies: ['Python', 'Apache Kafka', 'Redis', 'React', 'D3.js'],
          category: 'Data Engineering'
        }
      ],
      testimonials: [
        {
          id: 'test1',
          menteeName: 'Juan Dela Cruz',
          menteeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face&auto=format&q=80',
          rating: 5,
          comment: 'Dr. Maria is an exceptional mentor! She helped me transition from junior to senior developer in just 6 months. Her practical approach and real-world insights are invaluable.',
          date: new Date('2023-12-15'),
          sessionType: 'Career Development'
        },
        {
          id: 'test2',
          menteeName: 'Anna Rodriguez',
          menteeAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face&auto=format&q=80',
          rating: 5,
          comment: 'The machine learning guidance I received was outstanding. Maria broke down complex concepts into digestible parts and provided hands-on projects that really solidified my understanding.',
          date: new Date('2023-11-28'),
          sessionType: 'Technical Skills'
        },
        {
          id: 'test3',
          menteeName: 'Carlos Mendoza',
          menteeAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face&auto=format&q=80',
          rating: 5,
          comment: 'Excellent system design sessions! Maria helped me prepare for senior engineer interviews and I successfully landed my dream job. Highly recommended!',
          date: new Date('2023-10-10'),
          sessionType: 'System Design'
        }
      ],
      socialLinks: {
        linkedin: 'https://linkedin.com/in/maria-santos-dev',
        github: 'https://github.com/mariasantos',
        twitter: 'https://twitter.com/mariasantos_dev',
        website: 'https://mariasantos.dev',
        medium: 'https://medium.com/@mariasantos'
      },
      availableTimeSlots: [
        { day: 'Monday', startTime: '09:00', endTime: '17:00', timezone: 'Asia/Manila' },
        { day: 'Tuesday', startTime: '09:00', endTime: '17:00', timezone: 'Asia/Manila' },
        { day: 'Wednesday', startTime: '09:00', endTime: '17:00', timezone: 'Asia/Manila' },
        { day: 'Thursday', startTime: '09:00', endTime: '17:00', timezone: 'Asia/Manila' },
        { day: 'Friday', startTime: '09:00', endTime: '15:00', timezone: 'Asia/Manila' },
        { day: 'Saturday', startTime: '10:00', endTime: '14:00', timezone: 'Asia/Manila' }
      ]
    };
  }

  onClose() {
    this.close.emit();
    this.resetModal();
  }

  resetModal() {
    this.activeTab = 'overview';
    this.showFullBio = false;
    this.mentorProfile = null;
  }

  setActiveTab(tab: 'overview' | 'experience' | 'portfolio' | 'reviews' | 'availability') {
    this.activeTab = tab;
  }

  onBookSession() {
    if (this.mentorProfile) {
      this.bookSession.emit(this.mentorProfile.id);
    }
  }

  onSendMessage() {
    if (this.mentorProfile) {
      this.sendMessage.emit(this.mentorProfile.id);
    }
  }

  toggleBio() {
    this.showFullBio = !this.showFullBio;
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatMonthYear(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  }

  getExperienceYears(startDate: Date, endDate?: Date): string {
    const end = endDate || new Date();
    const years = Math.floor((end.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365));
    const months = Math.floor(((end.getTime() - startDate.getTime()) % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
    
    if (years === 0) {
      return `${months} month${months > 1 ? 's' : ''}`;
    } else if (months === 0) {
      return `${years} year${years > 1 ? 's' : ''}`;
    } else {
      return `${years} year${years > 1 ? 's' : ''} ${months} month${months > 1 ? 's' : ''}`;
    }
  }

  openLink(url: string) {
    window.open(url, '_blank');
  }

  getAchievementIcon(type: string): string {
    switch (type) {
      case 'award': return '🏆';
      case 'publication': return '📄';
      case 'project': return '🚀';
      case 'recognition': return '🌟';
      default: return '🎯';
    }
  }

  getStars(rating: number): number[] {
    return Array.from({ length: 5 }, (_, i) => i + 1);
  }

  getOnlineStatus(): string {
    if (!this.mentorProfile) return '';
    return this.mentorProfile.isOnline ? 'Online now' : `Next available: ${this.formatDate(this.mentorProfile.availability.nextAvailable!)}`;
  }

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    // Set a default fallback image when the original image fails to load
    target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face&auto=format&q=80';
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

  // Better image URL handling
  getSafeImageUrl(url: string | undefined, fallback: string): string {
    if (!url) return fallback;
    // Add additional parameters to ensure image loads properly
    if (url.includes('unsplash.com')) {
      return url + (url.includes('?') ? '&' : '?') + 'auto=format&q=80';
    }
    return url;
  }
}
