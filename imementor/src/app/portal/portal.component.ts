import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-portal',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="portal-container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .portal-container {
      min-height: 100vh;
      background: #f8fafc;
    }
  `]
})
export class PortalComponent {}
