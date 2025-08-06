import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface CourseMaterial {
  id: string;
  type: 'video' | 'pdf' | 'note';
  title: string;
  content?: string; // For notes
  fileUrl?: string; // For videos and PDFs
  fileName?: string; // Original file name
  fileSize?: number; // File size in bytes
  duration?: number; // For videos (in seconds)
  uploadedAt: Date;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  materials: CourseMaterial[];
  order: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  thumbnail?: string;
  lessons: Lesson[];
  isPublished: boolean;
  enrolledStudents: number;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
  mentorId: string;
}

export interface StudentProgress {
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentAvatar?: string;
  enrolledDate: Date;
  lastActiveDate: Date;
  completedLessons: string[]; // Array of lesson IDs
  totalTimeSpent: number; // In minutes
  progressPercentage: number;
  currentLesson?: string; // Current lesson ID
  status: 'active' | 'inactive' | 'completed' | 'dropped';
  grade?: number; // Overall grade (0-100)
}

export interface StudentEnrollment {
  id: string;
  courseId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentAvatar?: string;
  enrolledDate: Date;
  lastActiveDate: Date;
  progress: StudentProgress;
}

@Component({
  selector: 'app-course-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './course-management.component.html',
  styleUrl: './course-management.component.scss'
})
export class CourseManagementComponent {
  courses: Course[] = [
    {
      id: '1',
      title: 'Introduction to Web Development',
      description: 'Learn the fundamentals of web development with HTML, CSS, and JavaScript',
      category: 'Web Development',
      difficulty: 'beginner',
      lessons: [
        {
          id: '1',
          title: 'HTML Basics',
          description: 'Learn HTML fundamentals and structure',
          materials: [
            {
              id: '1',
              type: 'video',
              title: 'HTML Introduction Video',
              fileUrl: 'https://example.com/video1.mp4',
              fileName: 'html-intro.mp4',
              duration: 1800,
              uploadedAt: new Date('2024-08-01')
            },
            {
              id: '2',
              type: 'pdf',
              title: 'HTML Reference Guide',
              fileUrl: 'https://example.com/html-guide.pdf',
              fileName: 'html-guide.pdf',
              fileSize: 2048000,
              uploadedAt: new Date('2024-08-01')
            },
            {
              id: '3',
              type: 'note',
              title: 'HTML Tags Overview',
              content: 'Here are the most commonly used HTML tags:\n\n1. <h1> to <h6> - Headings\n2. <p> - Paragraphs\n3. <div> - Divisions\n4. <span> - Inline elements',
              uploadedAt: new Date('2024-08-01')
            }
          ],
          order: 1,
          isPublished: true,
          createdAt: new Date('2024-08-01'),
          updatedAt: new Date('2024-08-01')
        }
      ],
      isPublished: true,
      enrolledStudents: 25,
      rating: 4.5,
      createdAt: new Date('2024-08-01'),
      updatedAt: new Date('2024-08-01'),
      mentorId: 'mentor1'
    }
  ];

  // Mock student enrollment data
  studentEnrollments: StudentEnrollment[] = [
    {
      id: '1',
      courseId: '1',
      studentId: 'student1',
      studentName: 'Juan dela Cruz',
      studentEmail: 'juan.delacruz@email.com',
      enrolledDate: new Date('2024-07-15'),
      lastActiveDate: new Date('2024-08-04'),
      progress: {
        studentId: 'student1',
        studentName: 'Juan dela Cruz',
        studentEmail: 'juan.delacruz@email.com',
        enrolledDate: new Date('2024-07-15'),
        lastActiveDate: new Date('2024-08-04'),
        completedLessons: ['1'],
        totalTimeSpent: 120,
        progressPercentage: 50,
        currentLesson: '2',
        status: 'active',
        grade: 85
      }
    },
    {
      id: '2',
      courseId: '1',
      studentId: 'student2',
      studentName: 'Maria Santos',
      studentEmail: 'maria.santos@email.com',
      enrolledDate: new Date('2024-07-20'),
      lastActiveDate: new Date('2024-08-05'),
      progress: {
        studentId: 'student2',
        studentName: 'Maria Santos',
        studentEmail: 'maria.santos@email.com',
        enrolledDate: new Date('2024-07-20'),
        lastActiveDate: new Date('2024-08-05'),
        completedLessons: ['1'],
        totalTimeSpent: 95,
        progressPercentage: 75,
        currentLesson: '3',
        status: 'active',
        grade: 92
      }
    },
    {
      id: '3',
      courseId: '1',
      studentId: 'student3',
      studentName: 'Carlos Rodriguez',
      studentEmail: 'carlos.rodriguez@email.com',
      enrolledDate: new Date('2024-06-10'),
      lastActiveDate: new Date('2024-07-28'),
      progress: {
        studentId: 'student3',
        studentName: 'Carlos Rodriguez',
        studentEmail: 'carlos.rodriguez@email.com',
        enrolledDate: new Date('2024-06-10'),
        lastActiveDate: new Date('2024-07-28'),
        completedLessons: ['1'],
        totalTimeSpent: 45,
        progressPercentage: 25,
        currentLesson: '1',
        status: 'inactive',
        grade: 68
      }
    }
  ];

  currentView: 'list' | 'create' | 'edit' | 'lesson-edit' | 'students' = 'list';
  selectedCourse: Course | null = null;
  selectedLesson: Lesson | null = null;
  searchQuery = '';
  filterCategory = 'all';
  studentSearchQuery = '';
  studentFilterStatus = 'all';

  // Form data
  courseForm: Partial<Course> = {};
  lessonForm: Partial<Lesson> = {};
  materialForm: Partial<CourseMaterial> = {};

  // UI state
  showMaterialModal = false;
  isDragOver = false;
  thumbnailPreview: string | null = null;
  thumbnailFile: File | null = null;

  get filteredCourses(): Course[] {
    let filtered = this.courses;

    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query) ||
        course.category.toLowerCase().includes(query)
      );
    }

    if (this.filterCategory !== 'all') {
      filtered = filtered.filter(course => course.category === this.filterCategory);
    }

    return filtered;
  }

  get categories(): string[] {
    const cats = [...new Set(this.courses.map(course => course.category))];
    return cats;
  }

  get courseStudents(): StudentEnrollment[] {
    if (!this.selectedCourse) return [];
    
    let filtered = this.studentEnrollments.filter(enrollment => 
      enrollment.courseId === this.selectedCourse!.id
    );

    // Apply search filter
    if (this.studentSearchQuery.trim()) {
      const query = this.studentSearchQuery.toLowerCase();
      filtered = filtered.filter(enrollment => 
        enrollment.studentName.toLowerCase().includes(query) ||
        enrollment.studentEmail.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (this.studentFilterStatus !== 'all') {
      filtered = filtered.filter(enrollment => 
        enrollment.progress.status === this.studentFilterStatus
      );
    }

    return filtered.sort((a, b) => b.progress.progressPercentage - a.progress.progressPercentage);
  }

  get studentStatusOptions(): Array<{value: string, label: string}> {
    return [
      { value: 'all', label: 'All Students' },
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'completed', label: 'Completed' },
      { value: 'dropped', label: 'Dropped' }
    ];
  }

  // Course management methods
  createNewCourse() {
    this.currentView = 'create';
    this.courseForm = {
      title: '',
      description: '',
      category: '',
      difficulty: 'beginner',
      lessons: [],
      isPublished: false
    };
    this.thumbnailPreview = null;
    this.thumbnailFile = null;
  }

  editCourse(course: Course) {
    this.selectedCourse = course;
    this.currentView = 'edit';
    this.courseForm = { ...course };
    this.thumbnailPreview = course.thumbnail || null;
    this.thumbnailFile = null;
  }

  saveCourse() {
    // Handle thumbnail upload
    if (this.thumbnailFile) {
      // In a real application, you would upload the file to a server
      // For now, we'll use the preview URL
      this.courseForm.thumbnail = this.thumbnailPreview || undefined;
    } else if (this.thumbnailPreview === null) {
      // User removed the thumbnail
      this.courseForm.thumbnail = undefined;
    }

    if (this.currentView === 'create') {
      const newCourse: Course = {
        id: Date.now().toString(),
        title: this.courseForm.title || '',
        description: this.courseForm.description || '',
        category: this.courseForm.category || '',
        difficulty: this.courseForm.difficulty || 'beginner',
        thumbnail: this.courseForm.thumbnail,
        lessons: [],
        isPublished: false,
        enrolledStudents: 0,
        rating: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        mentorId: 'current-mentor'
      };
      this.courses.push(newCourse);
    } else if (this.currentView === 'edit' && this.selectedCourse) {
      const index = this.courses.findIndex(c => c.id === this.selectedCourse!.id);
      if (index !== -1) {
        this.courses[index] = {
          ...this.selectedCourse,
          ...this.courseForm,
          updatedAt: new Date()
        };
      }
    }
    this.goBackToList();
  }

  deleteCourse(course: Course) {
    if (confirm(`Are you sure you want to delete "${course.title}"?`)) {
      this.courses = this.courses.filter(c => c.id !== course.id);
    }
  }

  toggleCoursePublication(course: Course) {
    const index = this.courses.findIndex(c => c.id === course.id);
    if (index !== -1) {
      this.courses[index].isPublished = !this.courses[index].isPublished;
      this.courses[index].updatedAt = new Date();
    }
  }

  // Student management methods
  viewCourseStudents(course: Course) {
    this.selectedCourse = course;
    this.currentView = 'students';
    this.studentSearchQuery = '';
    this.studentFilterStatus = 'all';
  }

  sendMessageToStudent(student: StudentEnrollment) {
    console.log('Sending message to student:', student.studentName);
    // Implement message sending logic
  }

  viewStudentProfile(student: StudentEnrollment) {
    console.log('Viewing profile for student:', student.studentName);
    // Implement student profile viewing logic
  }

  removeStudentFromCourse(student: StudentEnrollment) {
    if (confirm(`Are you sure you want to remove ${student.studentName} from this course?`)) {
      this.studentEnrollments = this.studentEnrollments.filter(
        enrollment => enrollment.id !== student.id
      );
      // Update course enrolled students count
      if (this.selectedCourse) {
        const courseIndex = this.courses.findIndex(c => c.id === this.selectedCourse!.id);
        if (courseIndex !== -1) {
          this.courses[courseIndex].enrolledStudents--;
        }
      }
    }
  }

  exportStudentProgress() {
    console.log('Exporting student progress for course:', this.selectedCourse?.title);
    // Implement export functionality
  }

  // Lesson management methods
  addLesson() {
    if (!this.selectedCourse) return;
    
    this.lessonForm = {
      title: '',
      description: '',
      materials: [],
      order: this.selectedCourse.lessons.length + 1,
      isPublished: false
    };
    this.currentView = 'lesson-edit';
    this.selectedLesson = null;
  }

  editLesson(lesson: Lesson) {
    this.selectedLesson = lesson;
    this.lessonForm = { ...lesson };
    this.currentView = 'lesson-edit';
  }

  saveLesson() {
    if (!this.selectedCourse) return;

    if (this.selectedLesson) {
      // Edit existing lesson
      const index = this.selectedCourse.lessons.findIndex(l => l.id === this.selectedLesson!.id);
      if (index !== -1) {
        this.selectedCourse.lessons[index] = {
          ...this.selectedLesson,
          ...this.lessonForm,
          updatedAt: new Date()
        };
      }
    } else {
      // Create new lesson
      const newLesson: Lesson = {
        id: Date.now().toString(),
        title: this.lessonForm.title || '',
        description: this.lessonForm.description || '',
        materials: [],
        order: this.lessonForm.order || 1,
        isPublished: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.selectedCourse.lessons.push(newLesson);
    }

    this.currentView = 'edit';
  }

  deleteLesson(lesson: Lesson) {
    if (!this.selectedCourse) return;
    
    if (confirm(`Are you sure you want to delete "${lesson.title}"?`)) {
      this.selectedCourse.lessons = this.selectedCourse.lessons.filter(l => l.id !== lesson.id);
    }
  }

  // Material management methods
  addMaterial(type: 'video' | 'pdf' | 'note') {
    this.materialForm = {
      type,
      title: '',
      content: type === 'note' ? '' : undefined
    };
    this.showMaterialModal = true;
  }

  saveMaterial() {
    if (!this.selectedLesson && this.currentView === 'lesson-edit') {
      if (!this.lessonForm.materials) this.lessonForm.materials = [];
      
      const newMaterial: CourseMaterial = {
        id: Date.now().toString(),
        type: this.materialForm.type || 'note',
        title: this.materialForm.title || '',
        content: this.materialForm.content,
        uploadedAt: new Date()
      };
      
      this.lessonForm.materials.push(newMaterial);
    }
    
    this.showMaterialModal = false;
    this.materialForm = {};
  }

  deleteMaterial(materialId: string) {
    if (this.currentView === 'lesson-edit' && this.lessonForm.materials) {
      this.lessonForm.materials = this.lessonForm.materials.filter(m => m.id !== materialId);
    }
  }

  // File upload handlers
  onFileSelected(event: any, type: 'video' | 'pdf') {
    const file = event.target.files[0];
    if (file) {
      // In a real application, you would upload the file to a server
      console.log('File selected:', file);
      this.materialForm.fileName = file.name;
      this.materialForm.fileSize = file.size;
      
      // Simulate file upload URL
      this.materialForm.fileUrl = `https://example.com/uploads/${file.name}`;
      
      if (type === 'video') {
        // For videos, you might want to extract duration
        this.materialForm.duration = 0; // Placeholder
      }
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      console.log('File dropped:', file);
      // Handle dropped file similar to onFileSelected
    }
  }

  // Navigation methods
  goBackToList() {
    this.currentView = 'list';
    this.selectedCourse = null;
    this.selectedLesson = null;
    this.courseForm = {};
    this.lessonForm = {};
  }

  goBackToCourse() {
    this.currentView = 'edit';
    this.selectedLesson = null;
    this.lessonForm = {};
  }

  // Utility methods
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  getStatusClass(isPublished: boolean): string {
    return isPublished ? 'status-published' : 'status-draft';
  }

  getMaterialIcon(type: string): string {
    switch (type) {
      case 'video':
        return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="23 7 16 12 23 17 23 7"></polygon>
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
        </svg>`;
      case 'pdf':
        return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"></path>
        </svg>`;
      case 'note':
        return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14,2 14,8 20,8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10,9 9,9 8,9"></polyline>
        </svg>`;
      default:
        return '';
    }
  }

  // Student progress utility methods
  getProgressBarColor(percentage: number): string {
    if (percentage >= 80) return '#10b981'; // green
    if (percentage >= 60) return '#f59e0b'; // yellow
    if (percentage >= 40) return '#f97316'; // orange
    return '#ef4444'; // red
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'active':
        return 'status-active';
      case 'inactive':
        return 'status-inactive';
      case 'completed':
        return 'status-completed';
      case 'dropped':
        return 'status-dropped';
      default:
        return '';
    }
  }

  formatTimeSpent(minutes: number): string {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
  }

  formatLastActive(date: Date): string {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  }

  getLessonTitle(lessonId: string): string {
    if (!this.selectedCourse) return 'Unknown Lesson';
    
    const lesson = this.selectedCourse.lessons.find(l => l.id === lessonId);
    return lesson ? lesson.title : 'Unknown Lesson';
  }

  // Thumbnail upload methods
  onThumbnailSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      this.thumbnailFile = file;
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        this.thumbnailPreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onThumbnailDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onThumbnailDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onThumbnailDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        this.thumbnailFile = file;
        
        // Create preview URL
        const reader = new FileReader();
        reader.onload = (e) => {
          this.thumbnailPreview = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removeThumbnail() {
    this.thumbnailPreview = null;
    this.thumbnailFile = null;
    this.courseForm.thumbnail = undefined;
  }

  triggerThumbnailUpload() {
    const fileInput = document.getElementById('thumbnail-upload') as HTMLInputElement;
    fileInput?.click();
  }
}
