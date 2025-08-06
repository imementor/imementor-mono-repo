import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements OnInit {
  @ViewChild('heroVideo') videoElement!: ElementRef<HTMLVideoElement>;
  
  ngOnInit() {
    // Ensure video plays on load
    setTimeout(() => {
      if (this.videoElement?.nativeElement) {
        this.videoElement.nativeElement.play().catch(err => {
          console.log('Video autoplay prevented:', err);
        });
      }
    }, 100);
  }
  
  scrollTo(elementId: string) {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  onVideoError() {
    console.log('Video failed to load, falling back to background image');
    // You could set a flag here to show a fallback background image
  }
}
