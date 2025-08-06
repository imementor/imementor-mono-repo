import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent, PageAction } from '../../shared/page-header/page-header.component';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'learning' | 'mentorship' | 'achievement' | 'milestone' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  requirements: {
    type: 'sessions' | 'hours' | 'rating' | 'streak' | 'special';
    target: number;
    description: string;
  };
  achievedAt?: Date;
  progress: number; // 0-100 percentage
  isAchieved: boolean;
}

export interface BadgeCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  badges: Badge[];
}

@Component({
  selector: 'app-badges',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent],
  templateUrl: './badges.component.html',
  styleUrl: './badges.component.scss'
})
export class BadgesComponent implements OnInit {
  // Header configuration
  headerActions: PageAction[] = [];
  
  // Filter and view options
  selectedCategory = 'all';
  selectedStatus = 'all';
  viewMode: 'grid' | 'list' = 'grid';
  
  // Badges data
  badges: Badge[] = [];
  filteredBadges: Badge[] = [];
  badgeCategories: BadgeCategory[] = [];
  
  // Filter options
  categoryFilters = [
    { value: 'all', label: 'Lahat ng Categories' },
    { value: 'learning', label: 'Learning' },
    { value: 'mentorship', label: 'Mentorship' },
    { value: 'achievement', label: 'Achievement' },
    { value: 'milestone', label: 'Milestone' },
    { value: 'special', label: 'Special' }
  ];
  
  statusFilters = [
    { value: 'all', label: 'Lahat' },
    { value: 'achieved', label: 'Nakuha na' },
    { value: 'in-progress', label: 'Ginagawa' },
    { value: 'locked', label: 'Hindi pa available' }
  ];

  ngOnInit() {
    this.loadBadges();
    this.setupHeaderActions();
    this.filterBadges();
  }

  setupHeaderActions() {
    this.headerActions = [
      {
        label: 'Refresh',
        icon: '🔄',
        action: () => this.loadBadges(),
        class: 'secondary'
      }
    ];
  }

  loadBadges() {
    // Mock badges data
    this.badges = [
      // Learning Badges
      {
        id: 'first-session',
        name: 'First Session',
        description: 'Natapos ang unang mentorship session',
        icon: '🎯',
        category: 'learning',
        rarity: 'common',
        points: 50,
        requirements: {
          type: 'sessions',
          target: 1,
          description: 'Mag-complete ng 1 session'
        },
        achievedAt: new Date('2025-08-01'),
        progress: 100,
        isAchieved: true
      },
      {
        id: 'session-streak-5',
        name: 'Consistent Learner',
        description: 'Nag-attend ng 5 consecutive sessions',
        icon: '🔥',
        category: 'learning',
        rarity: 'rare',
        points: 200,
        requirements: {
          type: 'streak',
          target: 5,
          description: 'Mag-attend ng 5 sunod-sunod na sessions'
        },
        achievedAt: new Date('2025-08-03'),
        progress: 100,
        isAchieved: true
      },
      {
        id: 'early-bird',
        name: 'Early Bird',
        description: 'Nag-join ng session 15 minutes bago mag-start',
        icon: '🐦',
        category: 'achievement',
        rarity: 'common',
        points: 25,
        requirements: {
          type: 'special',
          target: 1,
          description: 'Maging early sa isang session'
        },
        progress: 75,
        isAchieved: false
      },
      {
        id: 'knowledge-seeker',
        name: 'Knowledge Seeker',
        description: 'Nag-complete ng 10 learning sessions',
        icon: '📚',
        category: 'learning',
        rarity: 'rare',
        points: 300,
        requirements: {
          type: 'sessions',
          target: 10,
          description: 'Mag-complete ng 10 sessions'
        },
        progress: 60,
        isAchieved: false
      },
      // Mentorship Badges
      {
        id: 'mentor-connector',
        name: 'Mentor Connector',
        description: 'Nag-message sa 5 different mentors',
        icon: '🤝',
        category: 'mentorship',
        rarity: 'common',
        points: 100,
        requirements: {
          type: 'special',
          target: 5,
          description: 'Makipag-connect sa 5 mentors'
        },
        progress: 80,
        isAchieved: false
      },
      {
        id: 'feedback-champion',
        name: 'Feedback Champion',
        description: 'Nag-provide ng rating sa 20 sessions',
        icon: '⭐',
        category: 'mentorship',
        rarity: 'rare',
        points: 250,
        requirements: {
          type: 'rating',
          target: 20,
          description: 'Mag-rate ng 20 sessions'
        },
        progress: 35,
        isAchieved: false
      },
      // Achievement Badges
      {
        id: 'goal-setter',
        name: 'Goal Setter',
        description: 'Nag-set ng learning goals sa profile',
        icon: '🎯',
        category: 'achievement',
        rarity: 'common',
        points: 75,
        requirements: {
          type: 'special',
          target: 1,
          description: 'Mag-complete ng profile goals'
        },
        achievedAt: new Date('2025-07-30'),
        progress: 100,
        isAchieved: true
      },
      {
        id: 'tech-explorer',
        name: 'Tech Explorer',
        description: 'Nag-attend ng sessions sa 3 different tech fields',
        icon: '🔬',
        category: 'achievement',
        rarity: 'epic',
        points: 400,
        requirements: {
          type: 'special',
          target: 3,
          description: 'Mag-explore ng 3 tech fields'
        },
        progress: 66,
        isAchieved: false
      },
      // Milestone Badges
      {
        id: 'bronze-learner',
        name: 'Bronze Learner',
        description: 'Nag-accumulate ng 500 learning points',
        icon: '🥉',
        category: 'milestone',
        rarity: 'rare',
        points: 500,
        requirements: {
          type: 'special',
          target: 500,
          description: 'Makakuha ng 500 points'
        },
        achievedAt: new Date('2025-08-04'),
        progress: 100,
        isAchieved: true
      },
      {
        id: 'silver-learner',
        name: 'Silver Learner',
        description: 'Nag-accumulate ng 1500 learning points',
        icon: '🥈',
        category: 'milestone',
        rarity: 'epic',
        points: 1000,
        requirements: {
          type: 'special',
          target: 1500,
          description: 'Makakuha ng 1500 points'
        },
        progress: 53,
        isAchieved: false
      },
      {
        id: 'gold-learner',
        name: 'Gold Learner',
        description: 'Nag-accumulate ng 3000 learning points',
        icon: '🥇',
        category: 'milestone',
        rarity: 'legendary',
        points: 2000,
        requirements: {
          type: 'special',
          target: 3000,
          description: 'Makakuha ng 3000 points'
        },
        progress: 26,
        isAchieved: false
      },
      // Special Badges
      {
        id: 'beta-tester',
        name: 'Beta Tester',
        description: 'Kasama sa beta testing ng platform',
        icon: '🧪',
        category: 'special',
        rarity: 'legendary',
        points: 1000,
        requirements: {
          type: 'special',
          target: 1,
          description: 'Maging beta tester'
        },
        achievedAt: new Date('2025-07-25'),
        progress: 100,
        isAchieved: true
      },
      {
        id: 'community-helper',
        name: 'Community Helper',
        description: 'Nag-help sa 10 fellow mentees sa forum',
        icon: '🤲',
        category: 'special',
        rarity: 'epic',
        points: 600,
        requirements: {
          type: 'special',
          target: 10,
          description: 'Tumulong sa 10 mentees'
        },
        progress: 20,
        isAchieved: false
      }
    ];
    
    this.organizeBadgesByCategory();
    this.filterBadges();
  }

  organizeBadgesByCategory() {
    const categoryMap = new Map<string, Badge[]>();
    
    this.badges.forEach(badge => {
      if (!categoryMap.has(badge.category)) {
        categoryMap.set(badge.category, []);
      }
      categoryMap.get(badge.category)?.push(badge);
    });

    this.badgeCategories = [
      {
        id: 'learning',
        name: 'Learning Badges',
        description: 'Mga badge na nakukuha through learning sessions',
        icon: '📚',
        badges: categoryMap.get('learning') || []
      },
      {
        id: 'mentorship',
        name: 'Mentorship Badges',
        description: 'Mga badge related sa mentorship activities',
        icon: '🤝',
        badges: categoryMap.get('mentorship') || []
      },
      {
        id: 'achievement',
        name: 'Achievement Badges',
        description: 'Mga badge para sa specific achievements',
        icon: '🏆',
        badges: categoryMap.get('achievement') || []
      },
      {
        id: 'milestone',
        name: 'Milestone Badges',
        description: 'Mga badge para sa major milestones',
        icon: '🎖️',
        badges: categoryMap.get('milestone') || []
      },
      {
        id: 'special',
        name: 'Special Badges',
        description: 'Mga rare at special badges',
        icon: '✨',
        badges: categoryMap.get('special') || []
      }
    ];
  }

  filterBadges() {
    this.filteredBadges = this.badges.filter(badge => {
      // Category filter
      const matchesCategory = this.selectedCategory === 'all' || badge.category === this.selectedCategory;

      // Status filter
      let matchesStatus = true;
      if (this.selectedStatus === 'achieved') {
        matchesStatus = badge.isAchieved;
      } else if (this.selectedStatus === 'in-progress') {
        matchesStatus = !badge.isAchieved && badge.progress > 0;
      } else if (this.selectedStatus === 'locked') {
        matchesStatus = !badge.isAchieved && badge.progress === 0;
      }

      return matchesCategory && matchesStatus;
    }).sort((a, b) => {
      // Sort by achieved status first, then by points
      if (a.isAchieved !== b.isAchieved) {
        return a.isAchieved ? -1 : 1;
      }
      return b.points - a.points;
    });
  }

  onFilterChange() {
    this.filterBadges();
  }

  toggleViewMode() {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  getRarityClass(rarity: string): string {
    switch (rarity) {
      case 'common': return 'rarity-common';
      case 'rare': return 'rarity-rare';
      case 'epic': return 'rarity-epic';
      case 'legendary': return 'rarity-legendary';
      default: return 'rarity-common';
    }
  }

  getRarityColor(rarity: string): string {
    switch (rarity) {
      case 'common': return '#6b7280';
      case 'rare': return '#3b82f6';
      case 'epic': return '#8b5cf6';
      case 'legendary': return '#f59e0b';
      default: return '#6b7280';
    }
  }

  getCategoryIcon(category: string): string {
    switch (category) {
      case 'learning': return '📚';
      case 'mentorship': return '🤝';
      case 'achievement': return '🏆';
      case 'milestone': return '🎖️';
      case 'special': return '✨';
      default: return '🏅';
    }
  }

  getProgressBarClass(badge: Badge): string {
    if (badge.isAchieved) return 'progress-completed';
    if (badge.progress >= 75) return 'progress-high';
    if (badge.progress >= 50) return 'progress-medium';
    if (badge.progress >= 25) return 'progress-low';
    return 'progress-none';
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('tl-PH', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  getAchievedBadgesCount(): number {
    return this.badges.filter(b => b.isAchieved).length;
  }

  getInProgressBadgesCount(): number {
    return this.badges.filter(b => !b.isAchieved && b.progress > 0).length;
  }

  getTotalPointsEarned(): number {
    return this.badges.filter(b => b.isAchieved).reduce((total, badge) => total + badge.points, 0);
  }

  getTotalBadgesCount(): number {
    return this.badges.length;
  }

  getCompletionPercentage(): number {
    const achieved = this.getAchievedBadgesCount();
    const total = this.getTotalBadgesCount();
    return total > 0 ? Math.round((achieved / total) * 100) : 0;
  }

  viewBadgeDetails(badge: Badge) {
    console.log('View badge details:', badge);
    // Implement badge details modal or navigation
  }

  shareBadge(badge: Badge) {
    console.log('Share badge:', badge);
    // Implement badge sharing functionality
  }

  claimBadge(badge: Badge) {
    if (badge.progress >= 100 && !badge.isAchieved) {
      badge.isAchieved = true;
      badge.achievedAt = new Date();
      console.log('Badge claimed:', badge.name);
      // Update UI and possibly send to backend
      this.filterBadges();
    }
  }

  getCategoryLabel(categoryValue: string): string {
    const category = this.categoryFilters.find(c => c.value === categoryValue);
    return category ? category.label : categoryValue;
  }

  getMath(): typeof Math {
    return Math;
  }

  getAchievedBadgesInCategory(badges: Badge[]): number {
    return badges.filter(b => b.isAchieved).length;
  }

  getCategoryCompletionPercentage(badges: Badge[]): number {
    const achieved = badges.filter(b => b.isAchieved).length;
    return badges.length > 0 ? (achieved / badges.length) * 100 : 0;
  }
}
