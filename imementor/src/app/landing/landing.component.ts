import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from './hero/hero.component';
import { AboutComponent } from './about/about.component';
import { StatsComponent } from './stats/stats.component';
import { ContactComponent } from './contact/contact.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    HeroComponent,
    AboutComponent,
    StatsComponent,
    ContactComponent,
    FooterComponent
  ],
  template: `
    <div class="landing-page">
      <app-hero></app-hero>
      <app-about></app-about>
      <app-stats></app-stats>
      <app-contact></app-contact>
      <app-footer></app-footer>
    </div>
  `,
  styles: [`
    .landing-page {
      width: 100%;
      overflow-x: hidden;
    }
  `]
})
export class LandingComponent {}
