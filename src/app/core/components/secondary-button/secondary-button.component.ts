import {Component, Inject, Input, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {Button} from 'primeng/button';
import {isPlatformBrowser} from '@angular/common';

@Component({
  selector: 'app-secondary-button',
  imports: [
    Button
  ],
  templateUrl: './secondary-button.component.html',
  standalone: true,
  styleUrl: './secondary-button.component.css'
})
export class SecondaryButtonComponent implements OnInit, OnDestroy {
  @Input() text: string = '';
  darkTheme = false;
  private mutationObserver?: MutationObserver;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.checkTheme();
      // Iniciar MutationObserver para observar cambios en el atributo 'class' del elemento <html>
      const htmlElement = document.querySelector('html');
      if (htmlElement) {
        this.mutationObserver = new MutationObserver(() => {
          this.checkTheme();
        });
        this.mutationObserver.observe(htmlElement, { attributes: true, attributeFilter: ['class'] });
      }
    }
  }

  ngOnDestroy() {
    this.mutationObserver?.disconnect();
  }

  // Método para actualizar darkTheme basado en la clase del elemento html
  private checkTheme(): void {
    const htmlElement = document.querySelector('html');
    if (htmlElement) {
      this.darkTheme = htmlElement.classList.contains('my-app-dark');
    }
  }

  get computedStyleClass(): string {
    const baseClasses = "p-3 font-semibold rounded-md transition-all duration-300 shadow-md hover:shadow-lg";
    // Combinación de colores más atractiva con borders sutiles y hover mejorado
    const colorClass = this.darkTheme 
      ? "text-primary-400 hover:text-primary-300 border border-primary-500/40 hover:border-primary-500 bg-gray-800 hover:bg-gray-700" 
      : "text-primary-700 hover:text-primary-800 border border-primary-500/40 hover:border-primary-500 bg-gray-50 hover:bg-gray-100";
    return `${baseClasses} ${colorClass}`;
  }
}
