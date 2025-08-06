import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Founder {
  id: number;
  name: string;
  role: string;
  bio: string;
  expertise: string[];
  vision: string;
  background: string;
  initials: string;
}

@Component({
  selector: 'app-founders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './founders.component.html',
  styleUrls: ['./founders.component.scss']
})
export class FoundersComponent implements OnInit {
  founders: Founder[] = [
    {
      id: 1,
      name: 'Maria Santos',
      role: 'Co-Founder & CEO',
      bio: 'Nangunguna sa pagbabago ng edukasyon sa Pilipinas',
      expertise: ['Educational Leadership', 'Technology Innovation', 'Community Building'],
      vision: 'Nakikita ko ang isang Pilipinas kung saan ang bawat Pilipino ay may access sa quality mentorship at educational opportunities.',
      background: '15 years sa edukasyon, dating teacher, at entrepreneur',
      initials: 'MS'
    },
    {
      id: 2,
      name: 'Jose Dela Cruz',
      role: 'Co-Founder & CTO',
      bio: 'Tech innovator na nakatuon sa Filipino communities',
      expertise: ['Software Development', 'Platform Architecture', 'Digital Transformation'],
      vision: 'Gumagamit natin ng technology para maging bridge ang mga Pilipino sa buong mundo at magka-connect sa mentorship.',
      background: 'Senior Developer sa mga international companies, passionate sa Filipino tech',
      initials: 'JD'
    },
    {
      id: 3,
      name: 'Ana Reyes',
      role: 'Co-Founder & Head of Community',
      bio: 'Community builder at advocate ng Filipino talent',
      expertise: ['Community Management', 'Program Development', 'Cultural Integration'],
      vision: 'Ang aming platform ay hindi lang tech tool - ito ay tulay para sa mga Pilipinong mag-grow together.',
      background: 'Community organizer, HR specialist, at lifelong learner',
      initials: 'AR'
    }
  ];

  ngOnInit(): void {
    // Component initialization
  }

  trackByFounderId(index: number, founder: Founder): number {
    return founder.id;
  }

  scrollTo(elementId: string) {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
