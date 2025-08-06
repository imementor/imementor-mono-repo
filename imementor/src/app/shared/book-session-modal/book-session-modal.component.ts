import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Mentor {
  id: string;
  name: string;
  avatar: string;
  expertise: string[];
  bio: string;
  rating: number;
  sessionsCompleted: number;
  hourlyRate: number;
  timezone: string;
  responseTime: string; // e.g., "Usually responds within 2 hours"
  availability: {
    monday: string[];
    tuesday: string[];
    wednesday: string[];
    thursday: string[];
    friday: string[];
    saturday: string[];
    sunday: string[];
  };
  languages: string[];
  nextAvailableSlot?: string;
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  available: boolean;
  booked?: boolean;
  mentorNote?: string; // Optional note from mentor about this slot
  isPreferred?: boolean; // Mentor's preferred time slots
}

export interface AvailableDay {
  date: string;
  dayName: string;
  timeSlots: TimeSlot[];
  totalSlots: number;
  availableSlots: number;
  isWeekend: boolean;
  mentorAvailability: 'high' | 'medium' | 'low'; // Based on number of available slots
}

export interface SessionBooking {
  mentorId: string;
  date: string;
  timeSlotId: string;
  duration: number;
  sessionType: 'one-on-one' | 'group' | 'workshop';
  topic: string;
  description: string;
  goals: string[];
  preferredPlatform: 'zoom' | 'google-meet' | 'teams';
  totalCost: number;
}

@Component({
  selector: 'app-book-session-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-session-modal.component.html',
  styleUrl: './book-session-modal.component.scss'
})
export class BookSessionModalComponent implements OnInit {
  @Input() isOpen = false;
  @Input() mentor: Mentor | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() bookSession = new EventEmitter<SessionBooking>();

  currentStep = 1;
  totalSteps = 4;

  // Form data
  sessionForm = {
    date: '',
    timeSlotId: '',
    duration: 60,
    sessionType: 'one-on-one' as 'one-on-one' | 'group' | 'workshop',
    topic: '',
    description: '',
    goals: [''],
    preferredPlatform: 'zoom' as 'zoom' | 'google-meet' | 'teams',
    specialRequests: ''
  };

  availableDays: AvailableDay[] = [];
  selectedDay: AvailableDay | null = null;
  selectedTimeSlot: TimeSlot | null = null;

  sessionTypes = [
    {
      id: 'one-on-one',
      name: 'One-on-One Session',
      description: 'Private mentoring session focused on your specific needs',
      icon: '👤',
      multiplier: 1
    },
    {
      id: 'group',
      name: 'Group Session',
      description: 'Join a small group session with other mentees',
      icon: '👥',
      multiplier: 0.7
    },
    {
      id: 'workshop',
      name: 'Workshop Style',
      description: 'Interactive workshop-style session with hands-on activities',
      icon: '🔧',
      multiplier: 1.2
    }
  ];

  platforms = [
    { id: 'zoom', name: 'Zoom', icon: '📹' },
    { id: 'google-meet', name: 'Google Meet', icon: '🎥' },
    { id: 'teams', name: 'Microsoft Teams', icon: '💼' }
  ];

  durations = [
    { value: 30, label: '30 minutes' },
    { value: 60, label: '1 hour' },
    { value: 90, label: '1.5 hours' },
    { value: 120, label: '2 hours' }
  ];

  ngOnInit() {
    if (this.mentor) {
      this.loadMentorAvailability();
    }
  }

  loadMentorAvailability() {
    // Mock data for mentor availability (next 14 days)
    const today = new Date();
    this.availableDays = [];

    // Generate more realistic mentor notes
    const mentorNotes = [
      'Great for focused discussions',
      'Ideal for technical deep-dives',
      'Perfect for career planning',
      'Best time for code reviews',
      'Excellent for interview prep',
      'Good for project guidance',
      'Optimal for learning new concepts'
    ];

    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      const dateString = date.toISOString().split('T')[0];
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;

      // Generate time slots based on mentor's typical availability
      const timeSlots: TimeSlot[] = [];
      let startHour = isWeekend ? 10 : 9; // Later start on weekends
      let endHour = isWeekend ? 16 : 18; // Earlier end on weekends
      
      // Skip lunch hour (12-13) on weekdays
      const skipLunch = !isWeekend;
      
      for (let hour = startHour; hour < endHour; hour++) {
        // Skip lunch hour
        if (skipLunch && hour === 12) continue;
        
        const startTime = `${hour.toString().padStart(2, '0')}:00`;
        const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
        
        // More realistic availability based on day and time
        let availabilityChance = 0.75; // Base availability
        
        // Adjust based on time of day (mentor's preferences)
        if (hour >= 9 && hour <= 11) availabilityChance += 0.15; // Morning preference
        if (hour >= 14 && hour <= 16) availabilityChance += 0.1; // Afternoon preference  
        if (hour >= 17) availabilityChance -= 0.2; // Less available late
        if (isWeekend) availabilityChance -= 0.3; // Less available on weekends
        
        // Random factors
        availabilityChance += (Math.random() - 0.5) * 0.2;
        availabilityChance = Math.max(0, Math.min(1, availabilityChance));
        
        const available = Math.random() < availabilityChance;
        const booked = !available && Math.random() > 0.7; // 30% chance of being booked if unavailable
        
        // Preferred slots are usually in the morning or early afternoon
        const isPreferred = available && (
          (hour >= 9 && hour <= 11) || // Morning slots
          (hour >= 14 && hour <= 15)   // Early afternoon slots
        ) && Math.random() > 0.6;
        
        // Add mentor note for preferred slots or special conditions
        let mentorNote: string | undefined;
        if (isPreferred) {
          mentorNote = mentorNotes[Math.floor(Math.random() * mentorNotes.length)];
        } else if (available && hour === 16) {
          mentorNote = "Last slot of the day - great for wrapping up projects";
        } else if (available && isWeekend) {
          mentorNote = "Weekend session - relaxed pace, perfect for learning";
        }
        
        timeSlots.push({
          id: `${dateString}_${startTime}`,
          startTime,
          endTime,
          available,
          booked,
          isPreferred,
          mentorNote
        });
      }

      const availableSlots = timeSlots.filter(slot => slot.available && !slot.booked).length;
      const totalSlots = timeSlots.length;
      
      // Determine mentor availability level
      let mentorAvailability: 'high' | 'medium' | 'low' = 'low';
      const availabilityRatio = availableSlots / totalSlots;
      if (availabilityRatio >= 0.7) mentorAvailability = 'high';
      else if (availabilityRatio >= 0.4) mentorAvailability = 'medium';

      this.availableDays.push({
        date: dateString,
        dayName,
        timeSlots,
        totalSlots,
        availableSlots,
        isWeekend,
        mentorAvailability
      });
    }
  }

  onDaySelect(day: AvailableDay) {
    this.selectedDay = day;
    this.sessionForm.date = day.date;
    this.selectedTimeSlot = null;
    this.sessionForm.timeSlotId = '';
  }

  onTimeSlotSelect(timeSlot: TimeSlot) {
    if (timeSlot.available && !timeSlot.booked) {
      this.selectedTimeSlot = timeSlot;
      this.sessionForm.timeSlotId = timeSlot.id;
    }
  }

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToStep(step: number) {
    this.currentStep = step;
  }

  addGoal() {
    this.sessionForm.goals.push('');
  }

  removeGoal(index: number) {
    if (this.sessionForm.goals.length > 1) {
      this.sessionForm.goals.splice(index, 1);
    }
  }

  getTotalCost(): number {
    if (!this.mentor) return 0;
    
    const selectedType = this.sessionTypes.find(type => type.id === this.sessionForm.sessionType);
    const multiplier = selectedType?.multiplier || 1;
    const durationMultiplier = this.sessionForm.duration / 60;
    
    return Math.round(this.mentor.hourlyRate * multiplier * durationMultiplier);
  }

  getSelectedSessionType() {
    return this.sessionTypes.find(type => type.id === this.sessionForm.sessionType);
  }

  getSelectedPlatform() {
    return this.platforms.find(platform => platform.id === this.sessionForm.preferredPlatform);
  }

  // Helper methods for template
  getDateNumber(dateString: string): number {
    return new Date(dateString).getDate();
  }

  getMonthYear(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short',
      year: 'numeric'
    });
  }

  getAvailableSlotsCount(day: AvailableDay): number {
    return day.timeSlots.filter(slot => slot.available && !slot.booked).length;
  }

  getFilteredGoals(): string[] {
    return this.sessionForm.goals.filter(g => g.trim());
  }

  hasFilteredGoals(): boolean {
    return this.getFilteredGoals().length > 0;
  }

  roundMath(value: number): number {
    return Math.round(value);
  }

  selectSessionType(typeId: string) {
    this.sessionForm.sessionType = typeId as 'one-on-one' | 'group' | 'workshop';
  }

  selectPlatform(platformId: string) {
    this.sessionForm.preferredPlatform = platformId as 'zoom' | 'google-meet' | 'teams';
  }

  isStepValid(step: number): boolean {
    switch (step) {
      case 1:
        return !!(this.sessionForm.date && this.sessionForm.timeSlotId);
      case 2:
        return !!(this.sessionForm.sessionType && this.sessionForm.duration);
      case 3:
        return !!(this.sessionForm.topic && this.sessionForm.description);
      case 4:
        return true; // Review step is always valid
      default:
        return false;
    }
  }

  canProceed(): boolean {
    return this.isStepValid(this.currentStep);
  }

  onSubmit() {
    if (!this.mentor) return;

    const booking: SessionBooking = {
      mentorId: this.mentor.id,
      date: this.sessionForm.date,
      timeSlotId: this.sessionForm.timeSlotId,
      duration: this.sessionForm.duration,
      sessionType: this.sessionForm.sessionType,
      topic: this.sessionForm.topic,
      description: this.sessionForm.description,
      goals: this.sessionForm.goals.filter(goal => goal.trim() !== ''),
      preferredPlatform: this.sessionForm.preferredPlatform,
      totalCost: this.getTotalCost()
    };

    this.bookSession.emit(booking);
    this.onClose();
  }

  onClose() {
    this.close.emit();
    this.resetForm();
  }

  resetForm() {
    this.currentStep = 1;
    this.selectedDay = null;
    this.selectedTimeSlot = null;
    this.sessionForm = {
      date: '',
      timeSlotId: '',
      duration: 60,
      sessionType: 'one-on-one',
      topic: '',
      description: '',
      goals: [''],
      preferredPlatform: 'zoom',
      specialRequests: ''
    };
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatDateShort(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
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

  getProgressPercentage(): number {
    return (this.currentStep / this.totalSteps) * 100;
  }

  getAvailabilityColor(availability: 'high' | 'medium' | 'low'): string {
    switch (availability) {
      case 'high': return '#10b981'; // Green
      case 'medium': return '#f59e0b'; // Yellow
      case 'low': return '#ef4444'; // Red
      default: return '#6b7280'; // Gray
    }
  }

  getAvailabilityText(availability: 'high' | 'medium' | 'low'): string {
    switch (availability) {
      case 'high': return 'High availability';
      case 'medium': return 'Limited availability';
      case 'low': return 'Low availability';
      default: return 'No availability';
    }
  }

  getNextAvailableSlot(): string {
    const nextSlot = this.availableDays
      .flatMap(day => 
        day.timeSlots
          .filter(slot => slot.available && !slot.booked)
          .map(slot => ({ ...slot, date: day.date, dayName: day.dayName }))
      )
      .sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.startTime}`);
        const dateB = new Date(`${b.date}T${b.startTime}`);
        return dateA.getTime() - dateB.getTime();
      })[0];

    if (nextSlot) {
      return `${nextSlot.dayName}, ${this.formatDate(nextSlot.date)} at ${this.formatTime(nextSlot.startTime)}`;
    }
    
    return 'No upcoming availability';
  }

  getMentorTimezone(): string {
    return this.mentor?.timezone || 'Asia/Manila (GMT+8)';
  }

  getWeeklyAvailability(): { day: string; hours: string }[] {
    if (!this.mentor?.availability) {
      return [
        { day: 'Monday', hours: '9:00 AM - 6:00 PM' },
        { day: 'Tuesday', hours: '9:00 AM - 6:00 PM' },
        { day: 'Wednesday', hours: '9:00 AM - 6:00 PM' },
        { day: 'Thursday', hours: '9:00 AM - 6:00 PM' },
        { day: 'Friday', hours: '9:00 AM - 6:00 PM' },
        { day: 'Saturday', hours: '10:00 AM - 4:00 PM' },
        { day: 'Sunday', hours: 'Not available' }
      ];
    }

    return Object.entries(this.mentor.availability).map(([day, hours]) => ({
      day: day.charAt(0).toUpperCase() + day.slice(1),
      hours: hours.length > 0 ? hours.join(', ') : 'Not available'
    }));
  }

  getDuration(startTime: string, endTime: string): string {
    const start = new Date(`2024-01-01T${startTime}:00`);
    const end = new Date(`2024-01-01T${endTime}:00`);
    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.round(diffMs / (1000 * 60));
    
    if (diffMins >= 60) {
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${diffMins}m`;
  }
}
