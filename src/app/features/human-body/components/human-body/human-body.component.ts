import { Component } from '@angular/core';
import { MenBodySvgComponent } from '../men-body-svg/men-body-svg.component';
import { MenBackBodySvgComponent } from '../men-back-body-svg/men-back-body-svg.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-human-body',
  standalone: true,
  imports: [MenBodySvgComponent, MenBackBodySvgComponent],
  templateUrl: './human-body.component.html',
  styleUrls: ['./human-body.component.css']
})
export class HumanBodyComponent {
  selectedArea: string = '';

  constructor(private router: Router) {}

  handlePieceClick(event: any): void {
    // Si el elemento tiene la clase no-click, no se hace nada.
    if (event.target.classList && event.target.classList.contains('no-click')) {
      return;
    }

    // Obtener el data-position
    const position =
      event.target.getAttribute('data-position') ||
      event.target.parentElement?.getAttribute('data-position');

    if (!position) {
      return;
    }

    // Quitar la clase activa de cualquier elemento previamente activo
    const activePath = document.querySelector('.sc-body-model-svg__path--active');
    if (activePath) {
      activePath.classList.remove('sc-body-model-svg__path--active');
    }

    // Agregar la clase activa al elemento clickeado
    const pathClass = event.target.getAttribute('class');
    if (pathClass) {
      event.target.setAttribute('class', `${pathClass} sc-body-model-svg__path--active`);
    }

    // Según la parte, realizar la navegación correspondiente
    if (position === 'cuello') {
      // Navega al endpoint /cuello
      this.router.navigate(['/cuello']);
    } else {
      // Para otras partes, puedes asignarlas a una variable o ejecutar otra lógica.
      this.selectedArea = position;
    }
  }
}

