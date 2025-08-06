import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Mentor {
  name: string;
  role: string;
  skills: string;
  avatar: string;
}

@Component({
  selector: 'app-mentors',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mentors.component.html',
  styleUrls: ['./mentors.component.scss']
})
export class MentorsComponent implements OnInit {
  mentors: Mentor[] = [
    {
      name: 'Maria Santos',
      role: 'Tech Lead',
      skills: 'Angular, React, Node.js',
      avatar: 'MS'
    },
    {
      name: 'Juan dela Cruz',
      role: 'Business Analyst',
      skills: 'Strategy, Analytics, Leadership',
      avatar: 'JC'
    },
    {
      name: 'Ana Reyes',
      role: 'UX Designer',
      skills: 'Design Thinking, Figma, Research',
      avatar: 'AR'
    },
    {
      name: 'Carlos Mendoza',
      role: 'Data Scientist',
      skills: 'Python, ML, Statistics',
      avatar: 'CM'
    }
  ];

  currentIndex = 0;

  ngOnInit() {
    this.startAutoSlide();
  }

  private startAutoSlide() {
    setInterval(() => {
      this.next();
    }, 4000);
  }

  prev() {
    this.currentIndex = this.currentIndex === 0 ? this.mentors.length - 1 : this.currentIndex - 1;
  }

  next() {
    this.currentIndex = this.currentIndex === this.mentors.length - 1 ? 0 : this.currentIndex + 1;
  }

  getTransformStyle() {
    return `translateX(-${this.currentIndex * 330}px)`;
  }
}
