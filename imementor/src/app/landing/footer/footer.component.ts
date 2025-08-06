import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FooterLink {
  text: string;
  url: string;
}

interface ContactInfo {
  icon: string;
  text: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  quickLinks: FooterLink[] = [
    { text: 'Tungkol Sa Amin', url: '#about' },
    { text: 'Mga Mentor', url: '#mentors' },
    { text: 'Paano Mag-sign up', url: '#signup' },
    { text: 'Privacy Policy', url: '#privacy' }
  ];

  supportLinks: FooterLink[] = [
    { text: 'Help Center', url: '#help' },
    { text: 'FAQs', url: '#faq' },
    { text: 'Contact Support', url: '#support' },
    { text: 'Community Guidelines', url: '#guidelines' }
  ];

  socialLinks: FooterLink[] = [
    { text: 'Facebook', url: '#facebook' },
    { text: 'Twitter', url: '#twitter' },
    { text: 'LinkedIn', url: '#linkedin' },
    { text: 'Instagram', url: '#instagram' }
  ];

  contactInfo: ContactInfo[] = [
    { icon: '📧', text: 'hello@imementor.ph' },
    { icon: '📱', text: '+63 123 456 7890' },
    { icon: '📍', text: 'Manila, Philippines' }
  ];

  currentYear = new Date().getFullYear();
}
