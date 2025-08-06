import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Feature {
  title: string;
  description: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  features: Feature[] = [
    {
      title: 'Personalized Matching',
      description: 'Hanap ang tamang mentor o mentee batay sa skills, interests, at goals.'
    },
    {
      title: 'Structured Learning',
      description: 'Systematic approach sa pagbabahagi ng kaalaman at career development.'
    },
    {
      title: 'Community Support',
      description: 'Makakasama ang mga kapwa Filipino na may parehong pangarap.'
    }
  ];
}
