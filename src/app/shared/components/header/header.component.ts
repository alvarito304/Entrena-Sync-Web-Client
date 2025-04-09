import {Component, computed, HostBinding, HostListener} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {
  trigger,
  transition,
  style,
  animate,
} from '@angular/animations';
import {Button} from 'primeng/button';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [
    RouterLink,
    NgForOf,
    NgIf,
    NgClass,
    RouterLinkActive,
    Button
  ],
  standalone: true,
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, transform: 'scale(0.95)' })),
      ]),
    ]),
  ],
})
export class HeaderComponent {
  isScrolled = false;
  isMobileMenuOpen = false;

  navLinks = [
    { path: '', label: 'Home' },
    { path: 'about', label: 'About' },
    { path: 'services', label: 'Services' },
    { path: 'trainers', label: 'Trainers' },
    { path: 'testimonials', label: 'Testimonials' },
    { path: 'contact', label: 'Contact' },
  ];

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isScrolled = window.scrollY > 10;
  }

  darkTheme = false;

  isDarkTheme() {
    return this.darkTheme;
  }

  toggleDarkMode() {
    const element = document.querySelector('html');
    if (element !== null) {
      element.classList.toggle('my-app-dark');
      this.darkTheme = !this.darkTheme;
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

}
