import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageAction } from '../../shared/page-header/page-header.component';

export interface DashboardCard {
  title: string;
  value: string;
  icon: string;
  color: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export interface RecentActivity {
  id: string;
  type: 'message' | 'session' | 'achievement';
  title: string;
  description: string;
  time: string;
  icon: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  // Header configuration
  headerActions: PageAction[] = [
    {
      label: 'Refresh',
      icon: '🔄',
      action: () => this.refreshDashboard(),
      class: 'secondary'
    }
  ];

  dashboardCards: DashboardCard[] = [
    {
      title: 'Mga Session',
      value: '12',
      icon: '📅',
      color: 'blue',
      trend: { value: '+2 ngayong linggo', isPositive: true }
    },
    {
      title: 'Mga Mensahe',
      value: '8',
      icon: '💬',
      color: 'green',
      trend: { value: '+5 kahapon', isPositive: true }
    },
    {
      title: 'Mga Araw Aktibo',
      value: '24',
      icon: '🔥',
      color: 'orange',
      trend: { value: 'Streak!', isPositive: true }
    },
    {
      title: 'Mga Achievement',
      value: '6',
      icon: '🏆',
      color: 'purple',
      trend: { value: '+1 ngayong buwan', isPositive: true }
    }
  ];

  recentActivities: RecentActivity[] = [
    {
      id: '1',
      type: 'message',
      title: 'Bagong mensahe mula kay Maria Santos',
      description: 'Salamat sa pag-help sa Math homework!',
      time: '5 minuto na ang nakalipas',
      icon: '💬'
    },
    {
      id: '2',
      type: 'session',
      title: 'Session na tapos: English Grammar',
      description: 'Napakagaling mo sa lesson ngayon!',
      time: '2 oras na ang nakalipas',
      icon: '📅'
    },
    {
      id: '3',
      type: 'achievement',
      title: 'Nakuha mo ang "Helper" badge!',
      description: 'Nagtulungan ka ng 10 tao ngayong buwan',
      time: '1 araw na ang nakalipas',
      icon: '🏆'
    },
    {
      id: '4',
      type: 'message',
      title: 'Bagong mentoring request',
      description: 'Si John Cruz ay nag-request ng tulong sa Science',
      time: '2 araw na ang nakalipas',
      icon: '📚'
    }
  ];

  upcomingSessions = [
    {
      id: '1',
      title: 'Math Tutoring - Algebra',
      time: '3:00 PM - 4:00 PM',
      date: 'Bukas',
      participant: 'Ana Rodriguez',
      type: 'Video Call'
    },
    {
      id: '2',
      title: 'English Conversation',
      time: '10:00 AM - 11:00 AM',
      date: 'Lunes',
      participant: 'Miguel Santos',
      type: 'Chat Session'
    },
    {
      id: '3',
      title: 'Science Discussion - Physics',
      time: '2:00 PM - 3:00 PM',
      date: 'Martes',
      participant: 'Sofia Chen',
      type: 'Video Call'
    }
  ];

  refreshDashboard() {
    // Logic to refresh the dashboard data
    console.log('Dashboard refreshed!');
  }
}
