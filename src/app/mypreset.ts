// mypreset.ts
import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

const CustomTheme = definePreset(Aura, {
  colors: {
    // Colores personalizados extremadamente vibrantes
    'custom-pink': '#FF00FF',     // Rosa fucsia brillante
    'custom-purple': '#8A2BE2',   // Púrpura vibrante
    'custom-yellow': '#FFFF00',   // Amarillo brillante
  },
  semantic: {
    // Colores primarios
    primary: {
      color: '{custom-purple}',
    },
    surface: {
      // Tema claro - EXTREMADAMENTE VIBRANTE
      light: {
        // Color de fondo general
        ground: '#FFFF00',        // Amarillo chillón
        // Color de fondo para secciones
        section: '#FF00FF',       // Rosa fucsia
        card: '#00FFFF',          // Cian brillante
      },
      // Tema oscuro - EXTREMADAMENTE VIBRANTE
      dark: {
        // Color de fondo general 
        ground: '#8A2BE2',        // Púrpura brillante
        // Color de fondo para secciones
        section: '#FF1493',       // Rosa intenso
        card: '#00FF00',          // Verde neón
      }
    }
  }
});

export default CustomTheme;
