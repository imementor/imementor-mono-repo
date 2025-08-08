import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent, PageAction } from '../../shared/page-header/page-header.component';
import { BookSessionModalComponent, Mentor } from '../../shared/book-session-modal/book-session-modal.component';
import { MentorProfileModalComponent } from '../../shared/mentor-profile-modal/mentor-profile-modal.component';

export interface MentorProfile {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
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
  responseTime: string; // e.g., "Within 1 hour"
}

@Component({
  selector: 'app-mentors-search',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, BookSessionModalComponent, MentorProfileModalComponent],
  templateUrl: './mentors-search.component.html',
  styleUrl: './mentors-search.component.scss'
})
export class MentorsSearchComponent implements OnInit {
  // Header configuration
  headerActions: PageAction[] = [];
  
  // Search and filters
  searchTerm = '';
  selectedField = 'all';
  selectedSkill = 'all';
  selectedExpertise = 'all';
  showOnlineOnly = false;
  minRating = 0;
  maxHourlyRate = 0;
  
  // Mentors data
  mentors: MentorProfile[] = [];
  filteredMentors: MentorProfile[] = [];
  
  // Filter options
  fieldOptions = [
    { value: 'all', label: 'Lahat ng Field' },
    { value: 'web-development', label: 'Web Development' },
    { value: 'mobile-development', label: 'Mobile Development' },
    { value: 'data-science', label: 'Data Science' },
    { value: 'ui-ux-design', label: 'UI/UX Design' },
    { value: 'cybersecurity', label: 'Cybersecurity' },
    { value: 'cloud-computing', label: 'Cloud Computing' },
    { value: 'artificial-intelligence', label: 'Artificial Intelligence' },
    { value: 'blockchain', label: 'Blockchain' },
    { value: 'devops', label: 'DevOps' },
    { value: 'database', label: 'Database' }
  ];
  
  skillOptions = [
    { value: 'all', label: 'Lahat ng Skills' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'react', label: 'React' },
    { value: 'angular', label: 'Angular' },
    { value: 'vue', label: 'Vue.js' },
    { value: 'node', label: 'Node.js' },
    { value: 'java', label: 'Java' },
    { value: 'csharp', label: 'C#' },
    { value: 'php', label: 'PHP' },
    { value: 'sql', label: 'SQL' },
    { value: 'mongodb', label: 'MongoDB' },
    { value: 'aws', label: 'AWS' },
    { value: 'azure', label: 'Azure' },
    { value: 'docker', label: 'Docker' },
    { value: 'kubernetes', label: 'Kubernetes' },
    { value: 'figma', label: 'Figma' },
    { value: 'sketch', label: 'Sketch' },
    { value: 'photoshop', label: 'Photoshop' }
  ];
  
  expertiseOptions = [
    { value: 'all', label: 'Lahat ng Expertise' },
    { value: 'frontend', label: 'Frontend Development' },
    { value: 'backend', label: 'Backend Development' },
    { value: 'fullstack', label: 'Full-stack Development' },
    { value: 'mobile', label: 'Mobile Development' },
    { value: 'data-analysis', label: 'Data Analysis' },
    { value: 'machine-learning', label: 'Machine Learning' },
    { value: 'user-research', label: 'User Research' },
    { value: 'visual-design', label: 'Visual Design' },
    { value: 'product-design', label: 'Product Design' },
    { value: 'project-management', label: 'Project Management' },
    { value: 'system-design', label: 'System Design' },
    { value: 'api-development', label: 'API Development' }
  ];

  // View options
  viewMode: 'grid' | 'list' = 'grid';
  sortBy = 'rating';

  // Modal properties
  isBookSessionModalOpen = false;
  selectedMentorForBooking: Mentor | null = null;
  isMentorProfileModalOpen = false;
  selectedMentorId: string | null = null;

  // New properties for enhanced functionality
  favoriteIds: { [key: string]: boolean } = {};

  sortOptions = [
    { value: 'rating', label: 'Rating (Pinakamataas)' },
    { value: 'experience', label: 'Experience (Pinaka-marami)' },
    { value: 'sessions', label: 'Sessions (Pinaka-marami)' },
    { value: 'rate-low', label: 'Rate (Pinakamababa)' },
    { value: 'rate-high', label: 'Rate (Pinakamataas)' },
    { value: 'name', label: 'Pangalan (A-Z)' }
  ];

  ngOnInit() {
    this.loadMentors();
    this.setupHeaderActions();
    this.filterMentors();
  }

  setupHeaderActions() {
    this.headerActions = [
      {
        label: 'Refresh',
        icon: '🔄',
        action: () => this.loadMentors(),
        class: 'secondary'
      }
    ];
  }

  loadMentors() {
    // Mock mentors data
    this.mentors = [
      {
        id: 'm1',
        firstName: 'Maria',
        lastName: 'Santos',
        avatar: 'https://i.pravatar.cc/150?img=1',
        expertise: ['Frontend Development', 'User Research'],
        field: 'web-development',
        skills: ['JavaScript', 'React', 'HTML', 'CSS', 'Figma'],
        rating: 4.9,
        reviewCount: 127,
        isOnline: true,
        bio: 'Senior Frontend Developer with 8 years of experience in building scalable web applications.',
        experience: 8,
        hourlyRate: 2500,
        languages: ['English', 'Filipino'],
        location: 'Manila, Philippines',
        timezone: 'GMT+8',
        availability: { available: true },
        sessionTypes: ['video-call', 'chat'],
        totalSessions: 234,
        responseTime: 'Within 30 minutes'
      },
      {
        id: 'm2',
        firstName: 'John',
        lastName: 'Dela Cruz',
        avatar: 'https://i.pravatar.cc/150?img=2',
        expertise: ['Data Analysis', 'Machine Learning'],
        field: 'data-science',
        skills: ['Python', 'SQL', 'Pandas', 'TensorFlow', 'Jupyter'],
        rating: 4.8,
        reviewCount: 89,
        isOnline: false,
        bio: 'Data Scientist specializing in machine learning and statistical analysis.',
        experience: 6,
        hourlyRate: 3000,
        languages: ['English', 'Filipino'],
        location: 'Cebu, Philippines',
        timezone: 'GMT+8',
        availability: { 
          available: false, 
          nextAvailable: new Date('2025-08-06T14:00:00') 
        },
        sessionTypes: ['video-call', 'chat'],
        totalSessions: 156,
        responseTime: 'Within 1 hour'
      },
      {
        id: 'm3',
        firstName: 'Ana',
        lastName: 'Rodriguez',
        avatar: 'https://i.pravatar.cc/150?img=3',
        expertise: ['Mobile Development', 'Cross-platform Development'],
        field: 'mobile-development',
        skills: ['React Native', 'Flutter', 'iOS', 'Android', 'JavaScript'],
        rating: 4.7,
        reviewCount: 72,
        isOnline: true,
        bio: 'Mobile app developer with expertise in cross-platform solutions.',
        experience: 5,
        hourlyRate: 2800,
        languages: ['English', 'Filipino', 'Spanish'],
        location: 'Davao, Philippines',
        timezone: 'GMT+8',
        availability: { available: true },
        sessionTypes: ['video-call', 'chat', 'in-person'],
        totalSessions: 189,
        responseTime: 'Within 15 minutes'
      },
      {
        id: 'm4',
        firstName: 'Miguel',
        lastName: 'Garcia',
        avatar: 'https://i.pravatar.cc/150?img=4',
        expertise: ['Visual Design', 'Product Design', 'User Research'],
        field: 'ui-ux-design',
        skills: ['Figma', 'Sketch', 'Photoshop', 'Illustrator', 'Principle'],
        rating: 4.9,
        reviewCount: 143,
        isOnline: true,
        bio: 'UX/UI Designer focused on creating intuitive and beautiful user experiences.',
        experience: 7,
        hourlyRate: 2200,
        languages: ['English', 'Filipino'],
        location: 'Makati, Philippines',
        timezone: 'GMT+8',
        availability: { available: true },
        sessionTypes: ['video-call', 'chat'],
        totalSessions: 278,
        responseTime: 'Within 20 minutes'
      },
      {
        id: 'm5',
        firstName: 'Sofia',
        lastName: 'Reyes',
        avatar: 'https://i.pravatar.cc/150?img=5',
        expertise: ['Backend Development', 'API Development', 'System Design'],
        field: 'web-development',
        skills: ['Node.js', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker'],
        rating: 4.6,
        reviewCount: 95,
        isOnline: false,
        bio: 'Backend engineer specializing in scalable API development and cloud architecture.',
        experience: 9,
        hourlyRate: 3200,
        languages: ['English', 'Filipino'],
        location: 'Quezon City, Philippines',
        timezone: 'GMT+8',
        availability: { 
          available: false, 
          nextAvailable: new Date('2025-08-07T09:00:00') 
        },
        sessionTypes: ['video-call'],
        totalSessions: 201,
        responseTime: 'Within 2 hours'
      },
      {
        id: 'm6',
        firstName: 'Carlos',
        lastName: 'Mendoza',
        avatar: 'https://i.pravatar.cc/150?img=6',
        expertise: ['Full-stack Development', 'DevOps'],
        field: 'web-development',
        skills: ['Angular', 'TypeScript', 'C#', 'Azure', 'Kubernetes'],
        rating: 4.8,
        reviewCount: 68,
        isOnline: true,
        bio: 'Full-stack developer with strong DevOps background and cloud expertise.',
        experience: 4,
        hourlyRate: 2600,
        languages: ['English', 'Filipino'],
        location: 'Iloilo, Philippines',
        timezone: 'GMT+8',
        availability: { available: true },
        sessionTypes: ['video-call', 'chat'],
        totalSessions: 123,
        responseTime: 'Within 45 minutes'
      },
      {
        id: 'm7',
        firstName: 'Isabella',
        lastName: 'Torres',
        avatar: 'https://i.pravatar.cc/150?img=7',
        expertise: ['Cybersecurity', 'Network Security'],
        field: 'cybersecurity',
        skills: ['Penetration Testing', 'Network Security', 'Python', 'Linux', 'CISSP'],
        rating: 4.9,
        reviewCount: 54,
        isOnline: true,
        bio: 'Cybersecurity expert with focus on penetration testing and security architecture.',
        experience: 6,
        hourlyRate: 3500,
        languages: ['English', 'Filipino'],
        location: 'BGC, Philippines',
        timezone: 'GMT+8',
        availability: { available: true },
        sessionTypes: ['video-call', 'chat'],
        totalSessions: 87,
        responseTime: 'Within 1 hour'
      },
      {
        id: 'm8',
        firstName: 'Diego',
        lastName: 'Cruz',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        expertise: ['Artificial Intelligence', 'Deep Learning'],
        field: 'artificial-intelligence',
        skills: ['Python', 'TensorFlow', 'PyTorch', 'Keras', 'Computer Vision'],
        rating: 4.8,
        reviewCount: 89,
        isOnline: true,
        bio: 'AI researcher and practitioner focused on computer vision and natural language processing.',
        experience: 6,
        hourlyRate: 3800,
        languages: ['English', 'Filipino'],
        location: 'UP Diliman, Philippines',
        timezone: 'GMT+8',
        availability: { available: true },
        sessionTypes: ['video-call', 'chat'],
        totalSessions: 145,
        responseTime: 'Within 1 hour'
      },
      {
        id: 'm9',
        firstName: 'Lucia',
        lastName: 'Morales',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        expertise: ['Frontend Development', 'React Development'],
        field: 'web-development',
        skills: ['React', 'Next.js', 'TypeScript', 'Redux', 'Tailwind CSS'],
        rating: 4.7,
        reviewCount: 112,
        isOnline: true,
        bio: 'React specialist building modern web applications with focus on performance and user experience.',
        experience: 5,
        hourlyRate: 2400,
        languages: ['English', 'Filipino'],
        location: 'Pasig, Philippines',
        timezone: 'GMT+8',
        availability: { available: true },
        sessionTypes: ['video-call', 'chat', 'in-person'],
        totalSessions: 203,
        responseTime: 'Within 30 minutes'
      },
      {
        id: 'm10',
        firstName: 'Roberto',
        lastName: 'Silva',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        expertise: ['Cloud Computing', 'Infrastructure'],
        field: 'cloud-computing',
        skills: ['AWS', 'Terraform', 'Docker', 'Jenkins', 'Microservices'],
        rating: 4.6,
        reviewCount: 76,
        isOnline: false,
        bio: 'Cloud architect with extensive experience in AWS and infrastructure automation.',
        experience: 10,
        hourlyRate: 3500,
        languages: ['English', 'Filipino'],
        location: 'Alabang, Philippines',
        timezone: 'GMT+8',
        availability: { 
          available: false, 
          nextAvailable: new Date('2025-08-09T10:00:00') 
        },
        sessionTypes: ['video-call'],
        totalSessions: 178,
        responseTime: 'Within 4 hours'
      },
      {
        id: 'm11',
        firstName: 'Carmen',
        lastName: 'Villanueva',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        expertise: ['Product Design', 'Design Systems'],
        field: 'ui-ux-design',
        skills: ['Figma', 'Design Systems', 'Prototyping', 'User Testing', 'Branding'],
        rating: 4.9,
        reviewCount: 134,
        isOnline: true,
        bio: 'Senior product designer specializing in design systems and user-centered design processes.',
        experience: 8,
        hourlyRate: 2700,
        languages: ['English', 'Filipino'],
        location: 'BGC, Philippines',
        timezone: 'GMT+8',
        availability: { available: true },
        sessionTypes: ['video-call', 'chat', 'in-person'],
        totalSessions: 256,
        responseTime: 'Within 25 minutes'
      },
      {
        id: 'm12',
        firstName: 'Eduardo',
        lastName: 'Ramos',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        expertise: ['Blockchain Development', 'Smart Contracts'],
        field: 'blockchain',
        skills: ['Solidity', 'Web3', 'Ethereum', 'Smart Contracts', 'DeFi'],
        rating: 4.5,
        reviewCount: 43,
        isOnline: true,
        bio: 'Blockchain developer with focus on DeFi protocols and smart contract development.',
        experience: 4,
        hourlyRate: 4000,
        languages: ['English', 'Filipino'],
        location: 'Ortigas, Philippines',
        timezone: 'GMT+8',
        availability: { available: true },
        sessionTypes: ['video-call', 'chat'],
        totalSessions: 87,
        responseTime: 'Within 1.5 hours'
      }
    ];
    
    this.filterMentors();
  }

  filterMentors() {
    this.filteredMentors = this.mentors.filter(mentor => {
      // Search filter
      const matchesSearch = !this.searchTerm || 
        `${mentor.firstName} ${mentor.lastName}`.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        mentor.expertise.some(exp => exp.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        mentor.skills.some(skill => skill.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        mentor.bio.toLowerCase().includes(this.searchTerm.toLowerCase());

      // Field filter
      const matchesField = this.selectedField === 'all' || mentor.field === this.selectedField;

      // Skill filter
      const matchesSkill = this.selectedSkill === 'all' || 
        mentor.skills.some(skill => skill.toLowerCase().includes(this.selectedSkill.toLowerCase()));

      // Expertise filter
      const matchesExpertise = this.selectedExpertise === 'all' || 
        mentor.expertise.some(exp => exp.toLowerCase().includes(this.selectedExpertise.toLowerCase()));

      // Online filter
      const matchesOnline = !this.showOnlineOnly || mentor.isOnline;

      // Rating filter
      const matchesRating = mentor.rating >= this.minRating;

      // Hourly rate filter
      const matchesRate = this.maxHourlyRate === 0 || !mentor.hourlyRate || mentor.hourlyRate <= this.maxHourlyRate;

      return matchesSearch && matchesField && matchesSkill && matchesExpertise && matchesOnline && matchesRating && matchesRate;
    }).sort((a, b) => this.sortMentors(a, b));
  }

  sortMentors(a: MentorProfile, b: MentorProfile): number {
    switch (this.sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'experience':
        return b.experience - a.experience;
      case 'sessions':
        return b.totalSessions - a.totalSessions;
      case 'rate-low':
        return (a.hourlyRate || 0) - (b.hourlyRate || 0);
      case 'rate-high':
        return (b.hourlyRate || 0) - (a.hourlyRate || 0);
      case 'name':
        return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
      default:
        return 0;
    }
  }

  onSearchChange() {
    this.filterMentors();
  }

  onFilterChange() {
    this.filterMentors();
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedField = 'all';
    this.selectedSkill = 'all';
    this.selectedExpertise = 'all';
    this.showOnlineOnly = false;
    this.minRating = 0;
    this.maxHourlyRate = 0;
    this.filterMentors();
  }

  toggleViewMode() {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  getMentorInitials(mentor: MentorProfile): string {
    return `${mentor.firstName.charAt(0)}${mentor.lastName.charAt(0)}`.toUpperCase();
  }

  formatHourlyRate(rate?: number): string {
    if (!rate) return 'Rate not specified';
    return `₱${rate.toLocaleString()}/hour`;
  }

  getAvailabilityText(mentor: MentorProfile): string {
    if (mentor.availability.available) {
      return mentor.isOnline ? 'Available now' : 'Available offline';
    } else if (mentor.availability.nextAvailable) {
      const nextDate = mentor.availability.nextAvailable;
      return `Next available: ${nextDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      })}`;
    }
    return 'Not available';
  }

  getAvailabilityClass(mentor: MentorProfile): string {
    if (mentor.availability.available && mentor.isOnline) {
      return 'available-online';
    } else if (mentor.availability.available) {
      return 'available-offline';
    }
    return 'unavailable';
  }

  viewMentorProfile(mentor: MentorProfile) {
    console.log('View mentor profile:', mentor);
    this.selectedMentorId = mentor.id;
    this.isMentorProfileModalOpen = true;
  }

  bookSessionWithMentor(mentor: MentorProfile) {
    console.log('Book session with mentor:', mentor);
    // Convert MentorProfile to Mentor format for booking modal
    this.selectedMentorForBooking = {
      id: mentor.id,
      name: `${mentor.firstName} ${mentor.lastName}`,
      avatar: mentor.avatar || '',
      expertise: mentor.expertise,
      bio: mentor.bio,
      rating: mentor.rating,
      sessionsCompleted: mentor.totalSessions,
      hourlyRate: mentor.hourlyRate || 1500,
      timezone: mentor.timezone,
      responseTime: mentor.responseTime,
      availability: {
        monday: ['09:00-12:00', '14:00-17:00'],
        tuesday: ['09:00-12:00', '14:00-17:00'],
        wednesday: ['09:00-12:00', '14:00-17:00'],
        thursday: ['09:00-12:00', '14:00-17:00'],
        friday: ['09:00-12:00', '14:00-17:00'],
        saturday: ['10:00-14:00'],
        sunday: []
      },
      languages: mentor.languages
    };
    this.isBookSessionModalOpen = true;
  }

  sendMessageToMentor(mentor: MentorProfile) {
    console.log('Send message to mentor:', mentor);
    // Navigate to messages with mentor conversation
  }

  addToFavorites(mentor: MentorProfile) {
    this.favoriteIds[mentor.id] = !this.favoriteIds[mentor.id];
    console.log('Toggle favorite for mentor:', mentor.firstName, mentor.lastName, 
                'Favorited:', this.favoriteIds[mentor.id]);
    
    // In a real app, this would make an API call to save favorites
    if (this.favoriteIds[mentor.id]) {
      // Show success message or notification
      console.log(`Added ${mentor.firstName} ${mentor.lastName} to favorites`);
    } else {
      console.log(`Removed ${mentor.firstName} ${mentor.lastName} from favorites`);
    }
  }

  // Modal methods
  closeBookSessionModal() {
    this.isBookSessionModalOpen = false;
    this.selectedMentorForBooking = null;
  }

  onSessionBooked(event: any) {
    console.log('Session booked:', event);
    this.closeBookSessionModal();
    // Handle successful booking
  }

  closeMentorProfileModal() {
    this.isMentorProfileModalOpen = false;
    this.selectedMentorId = null;
  }

  onBookSessionFromProfile(mentorId: string) {
    console.log('Book session from profile:', mentorId);
    // Find the mentor and open booking modal
    const mentor = this.mentors.find(m => m.id === mentorId);
    if (mentor) {
      this.closeMentorProfileModal();
      this.bookSessionWithMentor(mentor);
    }
  }

  onSendMessageFromProfile(mentorId: string) {
    console.log('Send message from profile:', mentorId);
    // Find the mentor and send message
    const mentor = this.mentors.find(m => m.id === mentorId);
    if (mentor) {
      this.closeMentorProfileModal();
      this.sendMessageToMentor(mentor);
    }
  }

  getFilteredCount(): number {
    return this.filteredMentors.length;
  }

  getTotalCount(): number {
    return this.mentors.length;
  }

  getFieldLabel(fieldValue: string): string {
    const field = this.fieldOptions.find(f => f.value === fieldValue);
    return field ? field.label : fieldValue;
  }

  // Enhanced methods for improved list view
  handleImageError(event: any) {
    event.target.style.display = 'none';
    // The avatar placeholder will be shown instead
  }

  getStarsArray(rating: number): { filled: boolean; half: boolean }[] {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      stars.push({
        filled: i < fullStars,
        half: i === fullStars && hasHalfStar
      });
    }
    
    return stars;
  }

  // Enhanced mentor utility methods
  getMentorDisplayName(mentor: MentorProfile): string {
    return `${mentor.firstName} ${mentor.lastName}`;
  }

  getMentorExpertisePreview(mentor: MentorProfile, maxItems: number = 2): string[] {
    return mentor.expertise.slice(0, maxItems);
  }

  getMentorSkillsPreview(mentor: MentorProfile, maxItems: number = 5): string[] {
    return mentor.skills.slice(0, maxItems);
  }

  isTopRatedMentor(mentor: MentorProfile): boolean {
    return mentor.rating >= 4.8;
  }

  getMentorStatusInfo(mentor: MentorProfile): { status: string; color: string; icon: string } {
    if (mentor.availability.available && mentor.isOnline) {
      return { status: 'Available now', color: 'green', icon: '🟢' };
    } else if (mentor.availability.available) {
      return { status: 'Available offline', color: 'yellow', icon: '🟡' };
    } else if (mentor.availability.nextAvailable) {
      const nextDate = mentor.availability.nextAvailable;
      const statusText = `Next: ${nextDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      })}`;
      return { status: statusText, color: 'orange', icon: '🟠' };
    }
    return { status: 'Not available', color: 'red', icon: '🔴' };
  }
}
