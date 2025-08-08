import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent, PageAction } from '../../shared/components/layout/page-header/page-header.component';
import { CourseDetailsComponent } from '../course-details/course-details.component';

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string; // e.g., "4h 30m"
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  reviewCount: number;
  thumbnail: string;
  tags: string[];
  skills: string[];
  category: string;
  isPremium: boolean;
  isCompleted: boolean;
  progress: number; // 0-100
  enrolledStudents: number;
  releaseDate: Date;
  lastUpdated: Date;
  videoCount: number;
  exerciseCount: number;
  certificateAvailable: boolean;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  courses: Course[];
  estimatedTime: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  skills: string[];
  completedCourses: number;
  totalCourses: number;
}

@Component({
  selector: 'app-learning-portal',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, CourseDetailsComponent],
  templateUrl: './learning-portal.component.html',
  styleUrl: './learning-portal.component.scss'
})
export class LearningPortalComponent implements OnInit {
  // Header configuration
  headerActions: PageAction[] = [];
  
  // Search and filters
  searchTerm = '';
  selectedCategory = 'all';
  selectedLevel = 'all';
  selectedSkill = 'all';
  showCompletedOnly = false;
  showFreeOnly = false;
  
  // Data
  courses: Course[] = [];
  learningPaths: LearningPath[] = [];
  filteredCourses: Course[] = [];
  
  // View options
  viewMode: 'grid' | 'list' = 'grid';
  currentTab: 'courses' | 'paths' | 'my-learning' = 'courses';
  sortBy = 'popularity';
  
  // Filter options
  categoryOptions = [
    { value: 'all', label: 'Lahat ng Category' },
    { value: 'web-development', label: 'Web Development' },
    { value: 'mobile-development', label: 'Mobile Development' },
    { value: 'data-science', label: 'Data Science' },
    { value: 'ui-ux-design', label: 'UI/UX Design' },
    { value: 'cybersecurity', label: 'Cybersecurity' },
    { value: 'cloud-computing', label: 'Cloud Computing' },
    { value: 'artificial-intelligence', label: 'Artificial Intelligence' },
    { value: 'blockchain', label: 'Blockchain' },
    { value: 'devops', label: 'DevOps' },
    { value: 'database', label: 'Database' },
    { value: 'programming', label: 'Programming Languages' }
  ];
  
  levelOptions = [
    { value: 'all', label: 'Lahat ng Level' },
    { value: 'Beginner', label: 'Beginner' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Advanced', label: 'Advanced' }
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
    { value: 'machine-learning', label: 'Machine Learning' }
  ];
  
  sortOptions = [
    { value: 'popularity', label: 'Pinaka-popular' },
    { value: 'rating', label: 'Rating (Pinakamataas)' },
    { value: 'newest', label: 'Pinakabago' },
    { value: 'duration-short', label: 'Duration (Pinakamaikli)' },
    { value: 'duration-long', label: 'Duration (Pinakamahabang)' },
    { value: 'title', label: 'Title (A-Z)' }
  ];

  // Course Details Modal
  isCourseDetailsOpen = false;
  selectedCourseId: string | null = null;

  ngOnInit() {
    this.loadCourses();
    this.loadLearningPaths();
    this.setupHeaderActions();
    this.filterCourses();
  }

  setupHeaderActions() {
    this.headerActions = [
      {
        label: 'My Learning',
        icon: '📚',
        action: () => this.switchTab('my-learning'),
        class: 'secondary'
      },
      {
        label: 'Refresh',
        icon: '🔄',
        action: () => this.loadCourses(),
        class: 'secondary'
      }
    ];
  }

  loadCourses() {
    // Mock courses data
    this.courses = [
      {
        id: 'c1',
        title: 'Complete JavaScript Course for Beginners',
        description: 'Learn JavaScript from scratch with hands-on projects and real-world examples.',
        instructor: 'Maria Santos',
        duration: '12h 45m',
        level: 'Beginner',
        rating: 4.8,
        reviewCount: 1247,
        thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=320&h=180&fit=crop&auto=format&q=80',
        tags: ['JavaScript', 'Programming', 'Web Development'],
        skills: ['javascript', 'programming', 'web-development'],
        category: 'web-development',
        isPremium: false,
        isCompleted: false,
        progress: 0,
        enrolledStudents: 15623,
        releaseDate: new Date('2024-01-15'),
        lastUpdated: new Date('2024-12-01'),
        videoCount: 89,
        exerciseCount: 45,
        certificateAvailable: true
      },
      {
        id: 'c2',
        title: 'React Development Masterclass',
        description: 'Master React.js with advanced patterns, hooks, and state management.',
        instructor: 'John Dela Cruz',
        duration: '18h 20m',
        level: 'Intermediate',
        rating: 4.9,
        reviewCount: 892,
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=320&h=180&fit=crop&auto=format&q=80',
        tags: ['React', 'JavaScript', 'Frontend'],
        skills: ['react', 'javascript', 'frontend'],
        category: 'web-development',
        isPremium: true,
        isCompleted: true,
        progress: 100,
        enrolledStudents: 8934,
        releaseDate: new Date('2024-03-10'),
        lastUpdated: new Date('2024-11-15'),
        videoCount: 125,
        exerciseCount: 67,
        certificateAvailable: true
      },
      {
        id: 'c3',
        title: 'Python for Data Science',
        description: 'Complete guide to data analysis and machine learning with Python.',
        instructor: 'Ana Rodriguez',
        duration: '15h 10m',
        level: 'Intermediate',
        rating: 4.7,
        reviewCount: 567,
        thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=320&h=180&fit=crop&auto=format&q=80',
        tags: ['Python', 'Data Science', 'Machine Learning'],
        skills: ['python', 'data-science', 'machine-learning'],
        category: 'data-science',
        isPremium: true,
        isCompleted: false,
        progress: 35,
        enrolledStudents: 6782,
        releaseDate: new Date('2024-02-20'),
        lastUpdated: new Date('2024-10-30'),
        videoCount: 98,
        exerciseCount: 52,
        certificateAvailable: true
      },
      {
        id: 'c4',
        title: 'UI/UX Design Fundamentals',
        description: 'Learn design principles, user research, and prototyping with Figma.',
        instructor: 'Miguel Garcia',
        duration: '8h 45m',
        level: 'Beginner',
        rating: 4.6,
        reviewCount: 934,
        thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=320&h=180&fit=crop&auto=format&q=80',
        tags: ['Design', 'UI/UX', 'Figma'],
        skills: ['figma', 'design', 'user-research'],
        category: 'ui-ux-design',
        isPremium: false,
        isCompleted: false,
        progress: 0,
        enrolledStudents: 12456,
        releaseDate: new Date('2024-04-05'),
        lastUpdated: new Date('2024-11-20'),
        videoCount: 62,
        exerciseCount: 28,
        certificateAvailable: true
      },
      {
        id: 'c5',
        title: 'Node.js Backend Development',
        description: 'Build scalable backend applications with Node.js, Express, and MongoDB.',
        instructor: 'Sofia Reyes',
        duration: '14h 30m',
        level: 'Intermediate',
        rating: 4.8,
        reviewCount: 445,
        thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=320&h=180&fit=crop&auto=format&q=80',
        tags: ['Node.js', 'Backend', 'API'],
        skills: ['node', 'backend', 'api'],
        category: 'web-development',
        isPremium: true,
        isCompleted: false,
        progress: 60,
        enrolledStudents: 5123,
        releaseDate: new Date('2024-05-12'),
        lastUpdated: new Date('2024-12-01'),
        videoCount: 87,
        exerciseCount: 41,
        certificateAvailable: true
      },
      {
        id: 'c6',
        title: 'AWS Cloud Practitioner',
        description: 'Get certified as an AWS Cloud Practitioner with hands-on labs.',
        instructor: 'Carlos Mendoza',
        duration: '10h 15m',
        level: 'Beginner',
        rating: 4.7,
        reviewCount: 678,
        thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=320&h=180&fit=crop&auto=format&q=80',
        tags: ['AWS', 'Cloud', 'Certification'],
        skills: ['aws', 'cloud', 'certification'],
        category: 'cloud-computing',
        isPremium: true,
        isCompleted: false,
        progress: 0,
        enrolledStudents: 7891,
        releaseDate: new Date('2024-06-01'),
        lastUpdated: new Date('2024-11-10'),
        videoCount: 74,
        exerciseCount: 35,
        certificateAvailable: true
      }
    ];
    
    this.filterCourses();
  }

  loadLearningPaths() {
    // Mock learning paths data
    this.learningPaths = [
      {
        id: 'lp1',
        title: 'Full Stack Web Developer',
        description: 'Complete path from frontend to backend development',
        courses: this.courses.slice(0, 3),
        estimatedTime: '45h 55m',
        level: 'Beginner',
        skills: ['javascript', 'react', 'node', 'database'],
        completedCourses: 1,
        totalCourses: 3
      },
      {
        id: 'lp2',
        title: 'Data Scientist Career Track',
        description: 'Master data analysis, machine learning, and visualization',
        courses: [this.courses[2]],
        estimatedTime: '25h 30m',
        level: 'Intermediate',
        skills: ['python', 'data-science', 'machine-learning'],
        completedCourses: 0,
        totalCourses: 2
      }
    ];
  }

  filterCourses() {
    this.filteredCourses = this.courses.filter(course => {
      // Search filter
      const matchesSearch = !this.searchTerm || 
        course.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        course.tags.some(tag => tag.toLowerCase().includes(this.searchTerm.toLowerCase()));

      // Category filter
      const matchesCategory = this.selectedCategory === 'all' || course.category === this.selectedCategory;

      // Level filter
      const matchesLevel = this.selectedLevel === 'all' || course.level === this.selectedLevel;

      // Skill filter
      const matchesSkill = this.selectedSkill === 'all' || 
        course.skills.some(skill => skill.includes(this.selectedSkill));

      // Completed filter
      const matchesCompleted = !this.showCompletedOnly || course.isCompleted;

      // Free filter
      const matchesFree = !this.showFreeOnly || !course.isPremium;

      return matchesSearch && matchesCategory && matchesLevel && matchesSkill && matchesCompleted && matchesFree;
    }).sort((a, b) => this.sortCourses(a, b));
  }

  sortCourses(a: Course, b: Course): number {
    switch (this.sortBy) {
      case 'popularity':
        return b.enrolledStudents - a.enrolledStudents;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return b.releaseDate.getTime() - a.releaseDate.getTime();
      case 'duration-short':
        return this.parseHours(a.duration) - this.parseHours(b.duration);
      case 'duration-long':
        return this.parseHours(b.duration) - this.parseHours(a.duration);
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  }

  parseHours(duration: string): number {
    const match = duration.match(/(\d+)h\s*(\d+)?m?/);
    if (match) {
      const hours = parseInt(match[1]);
      const minutes = match[2] ? parseInt(match[2]) : 0;
      return hours + minutes / 60;
    }
    return 0;
  }

  onSearchChange() {
    this.filterCourses();
  }

  onFilterChange() {
    this.filterCourses();
  }

  switchTab(tab: 'courses' | 'paths' | 'my-learning') {
    this.currentTab = tab;
  }

  toggleViewMode() {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedCategory = 'all';
    this.selectedLevel = 'all';
    this.selectedSkill = 'all';
    this.showCompletedOnly = false;
    this.showFreeOnly = false;
    this.filterCourses();
  }

  enrollInCourse(course: Course) {
    console.log('Opening course details for:', course.title);
    this.selectedCourseId = course.id;
    this.isCourseDetailsOpen = true;
  }

  continueCourse(course: Course) {
    console.log('Continuing course:', course.title);
    // Navigate to course video player
  }

  // Course Details Modal Methods
  closeCourseDetails() {
    this.isCourseDetailsOpen = false;
    this.selectedCourseId = null;
  }

  onCourseEnrolled(courseId: string) {
    // Update the course enrollment status
    const course = this.courses.find(c => c.id === courseId);
    if (course) {
      course.progress = 0; // Set initial progress
      this.filterCourses(); // Refresh the filtered courses
    }
    console.log('Course enrolled:', courseId);
  }

  startLearningPath(path: LearningPath) {
    console.log('Starting learning path:', path.title);
    // Navigate to first course in the path
  }

  getProgressWidth(progress: number): string {
    return `${progress}%`;
  }

  getFilteredCount(): number {
    return this.filteredCourses.length;
  }

  getTotalCount(): number {
    return this.courses.length;
  }

  // Image handling methods
  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    // Set a default fallback image when the original image fails to load
    target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=320&h=180&fit=crop&auto=format&q=80';
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

  // Methods for My Learning section
  getMyCourses(): Course[] {
    return this.courses.filter(course => course.progress > 0 || course.isCompleted);
  }

  getInProgressCourses(): Course[] {
    return this.courses.filter(course => course.progress > 0 && !course.isCompleted);
  }

  getCompletedCourses(): Course[] {
    return this.courses.filter(course => course.isCompleted);
  }
}
