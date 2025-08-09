import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NavbarComponent } from './landing/navbar/navbar.component';
import { HeroComponent } from './landing/hero/hero.component';
import { StatsComponent } from './landing/stats/stats.component';
import { AboutComponent } from './landing/about/about.component';
import { FoundersComponent } from './landing/founders/founders.component';
import { MentorsComponent } from './landing/mentors/mentors.component';
import { ContactComponent } from './landing/contact/contact.component';
import { FooterComponent } from './landing/footer/footer.component';
import { InvestorsPartnersComponent } from './landing/investors-partners/investors-partners.component';

@Component({
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent,
    HeroComponent,
    StatsComponent,
    AboutComponent,
    FoundersComponent,
    MentorsComponent,
    ContactComponent,
    FooterComponent,
    InvestorsPartnersComponent
  ],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected title = 'imementor';
  isLandingPage = true;
  isAuthPage = false;
  isHomePage = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.isLandingPage = event.url === '/' || event.url === '';
        this.isAuthPage = event.url.includes('/auth');
        this.isHomePage = event.url.includes('/portal');
      });
  }
}
