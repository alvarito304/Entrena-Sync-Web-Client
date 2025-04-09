import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-theme-demo',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, InputTextModule],
  template: `
    <div class="p-4 themed-section" style="min-height: 100vh;">
      <h1 class="text-4xl mb-6 font-bold">Demostración de Tema</h1>
      
      <div class="flex justify-end mb-4">
        <p-button 
          [label]="isDarkMode ? 'Cambiar a Tema Claro' : 'Cambiar a Tema Oscuro'" 
          (onClick)="toggleTheme()" 
          icon="pi pi-sun" 
          severity="info">
        </p-button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Card 1 -->
        <p-card header="Card Principal" subheader="Demostración de Card">
          <p class="m-0">
            Este componente muestra los colores del tema. El color de fondo debe 
            cambiar dramáticamente entre los temas claro y oscuro.
          </p>
          <div class="mt-4">
            <p-button label="Botón Primario" styleClass="mr-2"></p-button>
            <p-button label="Botón Secundario" severity="secondary"></p-button>
          </div>
        </p-card>

        <!-- Card 2 -->
        <p-card header="Componentes de Formulario" subheader="Muestra de Inputs">
          <div class="flex flex-column gap-2">
            <label for="username">Nombre de Usuario</label>
            <input pInputText id="username" type="text" placeholder="Escribe aquí" />
            
            <div class="flex gap-2 mt-4">
              <p-button label="Aceptar" severity="success"></p-button>
              <p-button label="Cancelar" severity="danger"></p-button>
            </div>
          </div>
        </p-card>
      </div>
    </div>
  `
})
export class ThemeDemoComponent {
  isDarkMode = false;

  ngOnInit() {
    // Forzar la aplicación del tema inicial
    setTimeout(() => {
      document.documentElement.classList.remove('app-dark');
      console.log('Tema inicial aplicado');
    }, 0);
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    
    if (this.isDarkMode) {
      document.documentElement.classList.add('app-dark');
      console.log('Switched to dark mode - usando --dark-ground:', getComputedStyle(document.documentElement).getPropertyValue('--dark-ground'));
    } else {
      document.documentElement.classList.remove('app-dark');
      console.log('Switched to light mode - usando --light-ground:', getComputedStyle(document.documentElement).getPropertyValue('--light-ground'));
    }
  }
}
