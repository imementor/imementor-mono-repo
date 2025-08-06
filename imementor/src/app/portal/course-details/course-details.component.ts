import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string; // e.g., "15:30"
  type: 'video' | 'article' | 'quiz' | 'exercise' | 'project';
  isCompleted: boolean;
  isLocked: boolean;
  videoUrl?: string;
  articleContent?: string;
  quizQuestions?: any[];
  resources?: LessonResource[];
  order: number;
}

export interface LessonResource {
  id: string;
  title: string;
  type: 'pdf' | 'code' | 'link' | 'image';
  url: string;
  size?: string;
}

export interface CourseSection {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  order: number;
  duration: string; // Total duration of all lessons in this section
}

export interface CourseDetails {
  id: string;
  title: string;
  description: string;
  instructor: {
    id: string;
    name: string;
    avatar: string;
    bio: string;
    rating: number;
    studentCount: number;
    courseCount: number;
  };
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  reviewCount: number;
  thumbnail: string;
  previewVideo?: string;
  tags: string[];
  skills: string[];
  category: string;
  isPremium: boolean;
  isEnrolled: boolean;
  progress: number;
  enrolledStudents: number;
  releaseDate: Date;
  lastUpdated: Date;
  sections: CourseSection[];
  requirements: string[];
  whatYouWillLearn: string[];
  certificateAvailable: boolean;
  language: string;
  subtitles: string[];
  totalVideoTime: string;
  totalLessons: number;
  totalQuizzes: number;
  totalProjects: number;
}

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './course-details.component.html',
  styleUrl: './course-details.component.scss'
})
export class CourseDetailsComponent implements OnInit, OnChanges {
  @Input() courseId: string | null = null;
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() courseEnrolled = new EventEmitter<string>();

  courseDetails: CourseDetails | null = null;
  selectedSection: CourseSection | null = null;
  selectedLesson: Lesson | null = null;
  showEnrollmentConfirmation = false;
  activeTab: 'overview' | 'curriculum' | 'instructor' | 'reviews' = 'overview';

  ngOnInit() {
    if (this.courseId) {
      this.loadCourseDetails();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['courseId'] && this.courseId && this.isOpen) {
      this.loadCourseDetails();
    }
  }

  loadCourseDetails() {
    // Mock course details data
    this.courseDetails = {
      id: this.courseId || '1',
      title: 'Complete React Development Bootcamp',
      description: 'Master React from basics to advanced concepts. Build real-world projects, learn hooks, context, routing, and state management. Perfect for beginners and intermediate developers.',
      instructor: {
        id: 'inst1',
        name: 'Dr. Maria Santos',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        bio: 'Senior Software Engineer with 10+ years of experience in React and modern web development. Former Facebook engineer.',
        rating: 4.9,
        studentCount: 25000,
        courseCount: 12
      },
      duration: '8h 45m',
      level: 'Beginner',
      rating: 4.8,
      reviewCount: 2847,
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
      previewVideo: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      tags: ['React', 'JavaScript', 'Frontend', 'Web Development'],
      skills: ['React Components', 'Hooks', 'State Management', 'Routing'],
      category: 'Web Development',
      isPremium: false,
      isEnrolled: false,
      progress: 0,
      enrolledStudents: 15420,
      releaseDate: new Date('2024-01-15'),
      lastUpdated: new Date('2024-03-10'),
      requirements: [
        'Basic knowledge of HTML and CSS',
        'JavaScript fundamentals (variables, functions, objects)',
        'Text editor (VS Code recommended)',
        'Node.js installed on your computer'
      ],
      whatYouWillLearn: [
        'Build modern React applications from scratch',
        'Master React Hooks and functional components',
        'Implement state management with Context API',
        'Create responsive and interactive user interfaces',
        'Handle API calls and data fetching',
        'Deploy React applications to production',
        'Write clean, maintainable React code',
        'Debug React applications effectively'
      ],
      certificateAvailable: true,
      language: 'English',
      subtitles: ['English', 'Filipino'],
      totalVideoTime: '8h 45m',
      totalLessons: 47,
      totalQuizzes: 8,
      totalProjects: 3,
      sections: [
        {
          id: 'section1',
          title: 'Getting Started with React',
          description: 'Learn the fundamentals of React and set up your development environment',
          order: 1,
          duration: '1h 30m',
          lessons: [
            {
              id: 'lesson1',
              title: 'Introduction to React',
              description: 'What is React and why should you learn it?',
              duration: '12:45',
              type: 'video',
              isCompleted: false,
              isLocked: false,
              order: 1,
              resources: [
                {
                  id: 'res1',
                  title: 'React Documentation',
                  type: 'link',
                  url: 'https://reactjs.org'
                }
              ]
            },
            {
              id: 'lesson2',
              title: 'Setting Up Development Environment',
              description: 'Install Node.js, create-react-app, and VS Code setup',
              duration: '18:30',
              type: 'video',
              isCompleted: false,
              isLocked: false,
              order: 2,
              resources: [
                {
                  id: 'res2',
                  title: 'Installation Guide',
                  type: 'pdf',
                  url: '/resources/install-guide.pdf',
                  size: '2.5 MB'
                }
              ]
            },
            {
              id: 'lesson3',
              title: 'Your First React Component',
              description: 'Create and understand your first React component',
              duration: '25:15',
              type: 'video',
              isCompleted: false,
              isLocked: false,
              order: 3
            },
            {
              id: 'quiz1',
              title: 'React Basics Quiz',
              description: 'Test your understanding of React fundamentals',
              duration: '10:00',
              type: 'quiz',
              isCompleted: false,
              isLocked: false,
              order: 4
            }
          ]
        },
        {
          id: 'section2',
          title: 'React Components Deep Dive',
          description: 'Master React components, props, and component composition',
          order: 2,
          duration: '2h 15m',
          lessons: [
            {
              id: 'lesson4',
              title: 'Understanding Props',
              description: 'Learn how to pass data between components using props',
              duration: '22:30',
              type: 'video',
              isCompleted: false,
              isLocked: true,
              order: 1
            },
            {
              id: 'lesson5',
              title: 'Component Composition',
              description: 'Build complex UIs by composing smaller components',
              duration: '28:45',
              type: 'video',
              isCompleted: false,
              isLocked: true,
              order: 2
            },
            {
              id: 'exercise1',
              title: 'Build a Product Card Component',
              description: 'Practice creating reusable components',
              duration: '45:00',
              type: 'exercise',
              isCompleted: false,
              isLocked: true,
              order: 3
            }
          ]
        },
        {
          id: 'section3',
          title: 'State Management & Hooks',
          description: 'Learn useState, useEffect, and other essential React hooks',
          order: 3,
          duration: '3h 20m',
          lessons: [
            {
              id: 'lesson6',
              title: 'Introduction to State',
              description: 'Understand component state and when to use it',
              duration: '20:15',
              type: 'video',
              isCompleted: false,
              isLocked: true,
              order: 1
            },
            {
              id: 'lesson7',
              title: 'useState Hook Deep Dive',
              description: 'Master the useState hook for managing component state',
              duration: '35:30',
              type: 'video',
              isCompleted: false,
              isLocked: true,
              order: 2
            },
            {
              id: 'lesson8',
              title: 'useEffect Hook',
              description: 'Handle side effects and lifecycle methods',
              duration: '42:20',
              type: 'video',
              isCompleted: false,
              isLocked: true,
              order: 3
            },
            {
              id: 'project1',
              title: 'Todo App Project',
              description: 'Build a complete todo application using hooks',
              duration: '90:00',
              type: 'project',
              isCompleted: false,
              isLocked: true,
              order: 4
            }
          ]
        }
      ]
    };

    // Set the first section as selected by default
    if (this.courseDetails.sections.length > 0) {
      this.selectedSection = this.courseDetails.sections[0];
    }
  }

  onClose() {
    this.close.emit();
    this.resetComponent();
  }

  resetComponent() {
    this.selectedSection = null;
    this.selectedLesson = null;
    this.showEnrollmentConfirmation = false;
    this.activeTab = 'overview';
  }

  enrollInCourse() {
    if (this.courseDetails) {
      this.courseDetails.isEnrolled = true;
      this.courseDetails.progress = 0;
      this.showEnrollmentConfirmation = true;
      this.courseEnrolled.emit(this.courseDetails.id);

      // Unlock the first lesson
      if (this.courseDetails.sections.length > 0 && this.courseDetails.sections[0].lessons.length > 0) {
        this.courseDetails.sections[0].lessons[0].isLocked = false;
      }

      setTimeout(() => {
        this.showEnrollmentConfirmation = false;
      }, 3000);
    }
  }

  selectSection(section: CourseSection) {
    this.selectedSection = section;
    this.selectedLesson = null;
  }

  selectLesson(lesson: Lesson) {
    if (!lesson.isLocked) {
      this.selectedLesson = lesson;
    }
  }

  startLesson(lesson: Lesson) {
    if (!lesson.isLocked) {
      console.log('Starting lesson:', lesson.title);
      // Here you would navigate to the lesson player
    }
  }

  setActiveTab(tab: 'overview' | 'curriculum' | 'instructor' | 'reviews') {
    this.activeTab = tab;
  }

  getTotalDuration(): string {
    if (!this.courseDetails) return '0m';
    return this.courseDetails.totalVideoTime;
  }

  getCompletedLessonsCount(): number {
    if (!this.courseDetails) return 0;
    return this.courseDetails.sections
      .flatMap(section => section.lessons)
      .filter(lesson => lesson.isCompleted).length;
  }

  getLessonIcon(type: string): string {
    switch (type) {
      case 'video': return '🎥';
      case 'article': return '📄';
      case 'quiz': return '❓';
      case 'exercise': return '💻';
      case 'project': return '🚀';
      default: return '📚';
    }
  }

  formatDuration(duration: string): string {
    // Convert duration like "12:45" to "12 min 45 sec"
    const [minutes, seconds] = duration.split(':');
    if (parseInt(minutes) > 60) {
      const hours = Math.floor(parseInt(minutes) / 60);
      const remainingMinutes = parseInt(minutes) % 60;
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${minutes}m ${seconds}s`;
  }
}
