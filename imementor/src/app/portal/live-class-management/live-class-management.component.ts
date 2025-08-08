import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LiveClassDetailsModalComponent } from '../../shared/components/modal/live-class-details-modal/live-class-details-modal.component';

export interface LiveClassMentor {
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
  registeredStudents: RegisteredStudent[];
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

@Component({
  selector: 'app-live-class-management',
  standalone: true,
  imports: [CommonModule, FormsModule, LiveClassDetailsModalComponent],
  templateUrl: './live-class-management.component.html',
  styleUrl: './live-class-management.component.scss'
})
export class LiveClassManagementComponent implements OnInit {
  liveClasses: LiveClassMentor[] = [];
  filteredClasses: LiveClassMentor[] = [];
  searchTerm = '';
  selectedStatus = 'all';
  sortBy = 'date';
  sortOrder: 'asc' | 'desc' = 'desc';

  // Modal states
  showAddClassModal = false;
  showEditClassModal = false;
  showStudentsModal = false;
  showDetailsModal = false;
  selectedClass: LiveClassMentor | null = null;
  selectedClassId: string | null = null;

  // Form data for new/edit class
  classForm = {
    title: '',
    description: '',
    category: '',
    scheduledDate: '',
    scheduledTime: '',
    duration: 60,
    maxParticipants: 30,
    price: 0,
    difficulty: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced',
    topics: [''],
    requirements: [''],
    coverImage: '',
    zoomLink: ''
  };

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

  ngOnInit() {
    this.loadLiveClasses();
    this.applyFilters();
  }

  loadLiveClasses() {
    // Mock data for mentor's live classes
    this.liveClasses = [
      {
        id: '1',
        title: 'Introduction to React Development',
        description: 'Learn the fundamentals of React including components, state management, and hooks.',
        category: 'Web Development',
        scheduledDate: '2024-01-15',
        scheduledTime: '14:00',
        duration: 120,
        maxParticipants: 50,
        currentParticipants: 32,
        status: 'scheduled',
        coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=200&fit=crop',
        price: 1500,
        topics: ['Components', 'JSX', 'State', 'Props', 'Hooks'],
        difficulty: 'Beginner',
        requirements: ['Basic JavaScript knowledge', 'HTML/CSS familiarity'],
        createdAt: '2024-01-10T10:00:00Z',
        updatedAt: '2024-01-12T15:30:00Z',
        zoomLink: 'https://zoom.us/j/123456789',
        registeredStudents: [
          {
            id: 's1',
            name: 'Juan Dela Cruz',
            email: 'juan@email.com',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
            school: 'University of the Philippines',
            registeredAt: '2024-01-11T09:30:00Z',
            paymentStatus: 'paid'
          },
          {
            id: 's2',
            name: 'Maria Santos',
            email: 'maria@email.com',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
            school: 'Ateneo de Manila',
            registeredAt: '2024-01-12T14:20:00Z',
            paymentStatus: 'paid'
          }
        ]
      },
      {
        id: '2',
        title: 'Advanced JavaScript Patterns',
        description: 'Dive deep into JavaScript design patterns, closures, and asynchronous programming.',
        category: 'Programming',
        scheduledDate: '2024-01-20',
        scheduledTime: '18:00',
        duration: 90,
        maxParticipants: 25,
        currentParticipants: 15,
        status: 'scheduled',
        coverImage: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=200&fit=crop',
        price: 2500,
        topics: ['Design Patterns', 'Async/Await', 'Closures', 'Performance'],
        difficulty: 'Advanced',
        requirements: ['Strong JavaScript foundation', '2+ years experience'],
        createdAt: '2024-01-08T16:45:00Z',
        updatedAt: '2024-01-13T11:15:00Z',
        zoomLink: 'https://zoom.us/j/987654321',
        registeredStudents: [
          {
            id: 's3',
            name: 'Pedro Garcia',
            email: 'pedro@email.com',
            avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
            school: 'De La Salle University',
            registeredAt: '2024-01-09T13:45:00Z',
            paymentStatus: 'paid'
          }
        ]
      },
      {
        id: '3',
        title: 'Python for Data Analysis',
        description: 'Learn data analysis using pandas, numpy, and visualization libraries.',
        category: 'Data Science',
        scheduledDate: '2024-01-12',
        scheduledTime: '10:00',
        duration: 180,
        maxParticipants: 30,
        currentParticipants: 28,
        status: 'ended',
        coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop',
        price: 2000,
        topics: ['Pandas', 'NumPy', 'Matplotlib', 'Data Cleaning'],
        difficulty: 'Intermediate',
        requirements: ['Python basics', 'Statistics knowledge helpful'],
        createdAt: '2024-01-05T12:00:00Z',
        updatedAt: '2024-01-12T09:30:00Z',
        registeredStudents: []
      }
    ];
  }

  applyFilters() {
    this.filteredClasses = this.liveClasses.filter(liveClass => {
      const matchesSearch = liveClass.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           liveClass.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = this.selectedStatus === 'all' || liveClass.status === this.selectedStatus;
      
      return matchesSearch && matchesStatus;
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
        case 'participants':
          valueA = a.currentParticipants;
          valueB = b.currentParticipants;
          break;
        case 'created':
          valueA = new Date(a.createdAt);
          valueB = new Date(b.createdAt);
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

  onStatusChange() {
    this.applyFilters();
  }

  onSortChange() {
    this.sortClasses();
  }

  toggleSortOrder() {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortClasses();
  }

  openAddClassModal() {
    this.resetClassForm();
    this.showAddClassModal = true;
  }

  openEditClassModal(liveClass: LiveClassMentor) {
    this.selectedClass = liveClass;
    this.populateClassForm(liveClass);
    this.showEditClassModal = true;
  }

  openStudentsModal(liveClass: LiveClassMentor) {
    this.selectedClass = liveClass;
    this.showStudentsModal = true;
  }

  // Live Class Details Modal Methods
  openDetailsModal(liveClass: LiveClassMentor) {
    this.selectedClassId = liveClass.id;
    this.showDetailsModal = true;
  }

  closeDetailsModal() {
    this.showDetailsModal = false;
    this.selectedClassId = null;
  }

  onClassDetailsEnroll(classId: string) {
    console.log('Student enrolled in class:', classId);
    // In a real app, this would handle the enrollment
  }

  onClassDetailsJoin(classId: string) {
    const liveClass = this.liveClasses.find(c => c.id === classId);
    if (liveClass && liveClass.zoomLink) {
      window.open(liveClass.zoomLink, '_blank');
      console.log('Joined live class:', liveClass.title);
    }
  }

  onClassDetailsEdit(classId: string) {
    const liveClass = this.liveClasses.find(c => c.id === classId);
    if (liveClass) {
      this.closeDetailsModal();
      this.openEditClassModal(liveClass);
    }
  }

  onClassDetailsDelete(classId: string) {
    const liveClass = this.liveClasses.find(c => c.id === classId);
    if (liveClass) {
      this.closeDetailsModal();
      this.deleteClass(liveClass);
    }
  }

  closeModals() {
    this.showAddClassModal = false;
    this.showEditClassModal = false;
    this.showStudentsModal = false;
    this.selectedClass = null;
  }

  resetClassForm() {
    this.classForm = {
      title: '',
      description: '',
      category: '',
      scheduledDate: '',
      scheduledTime: '',
      duration: 60,
      maxParticipants: 30,
      price: 0,
      difficulty: 'Beginner',
      topics: [''],
      requirements: [''],
      coverImage: '',
      zoomLink: ''
    };
  }

  populateClassForm(liveClass: LiveClassMentor) {
    this.classForm = {
      title: liveClass.title,
      description: liveClass.description,
      category: liveClass.category,
      scheduledDate: liveClass.scheduledDate,
      scheduledTime: liveClass.scheduledTime,
      duration: liveClass.duration,
      maxParticipants: liveClass.maxParticipants,
      price: liveClass.price,
      difficulty: liveClass.difficulty,
      topics: [...liveClass.topics],
      requirements: liveClass.requirements ? [...liveClass.requirements] : [''],
      coverImage: liveClass.coverImage,
      zoomLink: liveClass.zoomLink || ''
    };
  }

  addTopic() {
    this.classForm.topics.push('');
  }

  removeTopic(index: number) {
    if (this.classForm.topics.length > 1) {
      this.classForm.topics.splice(index, 1);
    }
  }

  addRequirement() {
    this.classForm.requirements.push('');
  }

  removeRequirement(index: number) {
    if (this.classForm.requirements.length > 1) {
      this.classForm.requirements.splice(index, 1);
    }
  }

  onImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      // In a real app, you would upload to a service and get back the URL
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.classForm.coverImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  saveClass() {
    if (this.showAddClassModal) {
      this.createClass();
    } else if (this.showEditClassModal) {
      this.updateClass();
    }
  }

  createClass() {
    const newClass: LiveClassMentor = {
      id: 'new_' + Date.now(),
      title: this.classForm.title,
      description: this.classForm.description,
      category: this.classForm.category,
      scheduledDate: this.classForm.scheduledDate,
      scheduledTime: this.classForm.scheduledTime,
      duration: this.classForm.duration,
      maxParticipants: this.classForm.maxParticipants,
      currentParticipants: 0,
      status: 'scheduled',
      coverImage: this.classForm.coverImage || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop',
      price: this.classForm.price,
      topics: this.classForm.topics.filter(topic => topic.trim() !== ''),
      difficulty: this.classForm.difficulty,
      requirements: this.classForm.requirements.filter(req => req.trim() !== ''),
      zoomLink: this.classForm.zoomLink,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      registeredStudents: []
    };

    this.liveClasses.unshift(newClass);
    this.applyFilters();
    this.closeModals();
    console.log('Live class created:', newClass);
  }

  updateClass() {
    if (this.selectedClass) {
      const index = this.liveClasses.findIndex(c => c.id === this.selectedClass!.id);
      if (index !== -1) {
        this.liveClasses[index] = {
          ...this.selectedClass,
          title: this.classForm.title,
          description: this.classForm.description,
          category: this.classForm.category,
          scheduledDate: this.classForm.scheduledDate,
          scheduledTime: this.classForm.scheduledTime,
          duration: this.classForm.duration,
          maxParticipants: this.classForm.maxParticipants,
          price: this.classForm.price,
          topics: this.classForm.topics.filter(topic => topic.trim() !== ''),
          difficulty: this.classForm.difficulty,
          requirements: this.classForm.requirements.filter(req => req.trim() !== ''),
          coverImage: this.classForm.coverImage,
          zoomLink: this.classForm.zoomLink,
          updatedAt: new Date().toISOString()
        };
        this.applyFilters();
        this.closeModals();
        console.log('Live class updated:', this.liveClasses[index]);
      }
    }
  }

  deleteClass(liveClass: LiveClassMentor) {
    if (confirm(`Are you sure you want to delete "${liveClass.title}"?`)) {
      const index = this.liveClasses.findIndex(c => c.id === liveClass.id);
      if (index !== -1) {
        this.liveClasses.splice(index, 1);
        this.applyFilters();
        console.log('Live class deleted:', liveClass.title);
      }
    }
  }

  duplicateClass(liveClass: LiveClassMentor) {
    const duplicatedClass: LiveClassMentor = {
      ...liveClass,
      id: 'dup_' + Date.now(),
      title: liveClass.title + ' (Copy)',
      currentParticipants: 0,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      registeredStudents: []
    };

    this.liveClasses.unshift(duplicatedClass);
    this.applyFilters();
    console.log('Live class duplicated:', duplicatedClass);
  }

  startLiveClass(liveClass: LiveClassMentor) {
    if (liveClass.zoomLink) {
      liveClass.status = 'live';
      this.applyFilters();
      window.open(liveClass.zoomLink, '_blank');
      console.log('Starting live class:', liveClass.title);
    } else {
      alert('Please add a Zoom link before starting the class.');
    }
  }

  endLiveClass(liveClass: LiveClassMentor) {
    liveClass.status = 'ended';
    this.applyFilters();
    console.log('Ended live class:', liveClass.title);
  }

  cancelClass(liveClass: LiveClassMentor) {
    if (confirm(`Are you sure you want to cancel "${liveClass.title}"? This will notify all registered students.`)) {
      liveClass.status = 'cancelled';
      this.applyFilters();
      console.log('Cancelled live class:', liveClass.title);
    }
  }

  removeStudent(student: RegisteredStudent) {
    if (this.selectedClass && confirm(`Remove ${student.name} from this class?`)) {
      const index = this.selectedClass.registeredStudents.findIndex(s => s.id === student.id);
      if (index !== -1) {
        this.selectedClass.registeredStudents.splice(index, 1);
        this.selectedClass.currentParticipants--;
        console.log('Student removed:', student.name);
      }
    }
  }

  messageStudent(student: RegisteredStudent) {
    console.log('Opening message to:', student.name);
    // In a real app, this would open a message modal or redirect to messages
  }

  exportStudentList() {
    if (this.selectedClass) {
      const csvContent = this.generateCSV(this.selectedClass.registeredStudents);
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${this.selectedClass.title}_students.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  }

  generateCSV(students: RegisteredStudent[]): string {
    const headers = ['Name', 'Email', 'School', 'Registered At', 'Payment Status'];
    const rows = students.map(student => [
      student.name,
      student.email,
      student.school || '',
      new Date(student.registeredAt).toLocaleDateString(),
      student.paymentStatus
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
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
}
