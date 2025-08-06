import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isScrolled = false;
  activeSection = 'home';

  constructor(private router: Router) {}

  ngOnInit() {
    this.checkScroll();
    this.checkActiveSection();
  }

  @HostListener('window:scroll')
  onScroll() {
    this.checkScroll();
    this.checkActiveSection();
  }

  private checkScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  private checkActiveSection() {
    const sections = ['home', 'about', 'founders', 'mentors', 'contact'];
    const scrollPosition = window.scrollY + window.innerHeight / 3; // Better UX - activate when section is 1/3 into view
    let foundActiveSection = false;

    // Check sections from bottom to top to handle overlapping cases
    for (let i = sections.length - 1; i >= 0; i--) {
      const sectionId = sections[i];
      const element = document.getElementById(sectionId);
      
      if (element) {
        const elementTop = element.offsetTop;
        const elementBottom = elementTop + element.offsetHeight;

        if (scrollPosition >= elementTop && scrollPosition <= elementBottom) {
          this.activeSection = sectionId;
          foundActiveSection = true;
          break;
        }
      }
    }

    // Special case for the very top of the page
    if (window.scrollY < 100) {
      this.activeSection = 'home';
    }
    // Special case for the very bottom of the page
    else if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
      this.activeSection = 'contact';
    }
  }

  scrollTo(elementId: string) {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  isActive(section: string): boolean {
    return this.activeSection === section;
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
