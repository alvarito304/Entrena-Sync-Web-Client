import { Component, Input, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-primary-button',
  standalone: true,
  templateUrl: './primary-button.component.html',
  styleUrls: ['./primary-button.component.css'],
  imports: [Button]
})
export class PrimaryButtonComponent implements OnInit, OnDestroy {
  @Input() text = '';
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
    const baseClasses = "p-3 font-semibold rounded-md transition-colors duration-300 shadow-md";
    const colorClass = "p-button-primary";
    return `${baseClasses} ${colorClass}`;
  }
}
