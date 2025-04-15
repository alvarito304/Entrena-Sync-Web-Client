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
    const baseClasses = "p-3 bg-transparent border border-gray-700 hover:border-primary-400 bg-surface-300 font-semibold rounded-full transition-all duration-300 shadow-lg";
    const textColorClass = this.darkTheme ? "text-white" : "text-black";
    return `${baseClasses} ${textColorClass}`;
  }
}
