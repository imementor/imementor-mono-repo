import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';

interface StatData {
  icon: string;
  target: number;
  current: number;
  label: string;
  description: string;
}

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {
  stats: StatData[] = [
    {
      icon: '👨‍🏫',
      target: 1247,
      current: 0,
      label: 'Mga Mentor',
      description: 'Mga eksperto mula sa iba\'t ibang larangan'
    },
    {
      icon: '👩‍🎓',
      target: 5832,
      current: 0,
      label: 'Mga Estudyante',
      description: 'Mga learners na handang matuto at lumago'
    },
    {
      icon: '🤝',
      target: 892,
      current: 0,
      label: 'Mga Koneksyon',
      description: 'Successful mentor-mentee partnerships'
    },
    {
      icon: '🏆',
      target: 156,
      current: 0,
      label: 'Mga Tagumpay',
      description: 'Success stories na naging inspirasyon'
    }
  ];

  private isAnimated = false;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.setupIntersectionObserver();
  }

  private setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.isAnimated) {
          this.isAnimated = true;
          this.animateCounters();
          this.addVisibleClass();
        }
      });
    }, { threshold: 0.5 });

    observer.observe(this.elementRef.nativeElement);
  }

  private animateCounters() {
    this.stats.forEach((stat, index) => {
      const duration = 2000; // 2 seconds
      const increment = stat.target / (duration / 16); // 60fps
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= stat.target) {
          current = stat.target;
          clearInterval(timer);
        }
        stat.current = Math.floor(current);
      }, 16);
    });
  }

  private addVisibleClass() {
    const fadeElements = this.elementRef.nativeElement.querySelectorAll('.fade-in');
    fadeElements.forEach((element: HTMLElement, index: number) => {
      setTimeout(() => {
        this.renderer.addClass(element, 'visible');
      }, index * 100);
    });
  }
}
