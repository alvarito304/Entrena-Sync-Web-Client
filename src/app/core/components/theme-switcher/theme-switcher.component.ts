import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  imports: [CommonModule, ButtonModule, TooltipModule],
  template: `
    <p-button 
      [icon]="isDarkMode ? 'pi pi-sun' : 'pi pi-moon'" 
      (onClick)="toggleTheme()" 
      styleClass="p-button-rounded p-button-text"
      [pTooltip]="isDarkMode ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'">
    </p-button>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ThemeSwitcherComponent implements OnInit {
  isDarkMode = false;

  ngOnInit() {
    // Verificar si hay una preferencia guardada
    const savedTheme = localStorage.getItem('theme-preference');
    if (savedTheme === 'dark') {
      this.isDarkMode = true;
      this.applyDarkMode();
    } else {
      this.applyLightMode();
    }
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    
    if (this.isDarkMode) {
      this.applyDarkMode();
    } else {
      this.applyLightMode();
    }
    
    // Guardar preferencia
    localStorage.setItem('theme-preference', this.isDarkMode ? 'dark' : 'light');
  }

  private applyDarkMode() {
    document.documentElement.classList.add('app-dark');
    document.body.style.backgroundColor = '#8A2BE2';
  }

  private applyLightMode() {
    document.documentElement.classList.remove('app-dark');
    document.body.style.backgroundColor = '#FFFF00';
  }
}
