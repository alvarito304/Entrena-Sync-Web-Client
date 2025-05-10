// mypreset.ts
import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

const CustomTheme = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{rose.50}',
      100: '{rose.100}',
      200: '{rose.200}',
      300: '{rose.300}',
      400: '{rose.400}',
      500: '{rose.500}',
      600: '{rose.600}',
      700: '{rose.700}',
      800: '{rose.800}',
      900: '{rose.900}',
      950: '{rose.950}'
    },
    colorScheme: {
      light: {
        surface: {
          0: '#606060',
          50: '#707070',
          100: '#808080',
          200: '#909090',
          300: '#a0a0a0',
          400: '#b0b0b0',
          500: '#c0c0c0',
          600: '#d0d0d0',
          700: '#e0e0e0',
          800: '#f0f0f0',
          900: '#f8f8f8',
          950: '#ffffff'
        },
      },
      dark: {
        surface: {
          0: '#ffffff',
          50: '#ececec',
          100: '#dedfdf',
          200: '#c4c4c6',
          300: '#adaeb0',
          400: '#97979b',
          500: '#7f8084',
          600: '#6a6b70',
          700: '#55565b',
          800: '#3f4046',
          900: '#2c2c34',
          950: '#16161d'
        },
      }
    }
  },
  // ← aquí añadimos la sección “components” para Tabs
  components: {
    tabs: {
      semantic: {
        light: {
          tablist: {
            background: '{transparent}'         // token tabs.tablist.background :contentReference[oaicite:2]{index=2}
          },
          tab: {
            active: {
              background: '{transparent}'       // token tabs.tab.active.background :contentReference[oaicite:3]{index=3}
            }
          },
          tabpanel: {
            background: '{transparent}'         // token tabs.tabpanels.background :contentReference[oaicite:4]{index=4}
          }
        },
        dark: {
          tablist: {
            background: '{transparent}'
          },
          tab: {
            active: {
              background: '{transparent}'
            }
          },
          tabpanel: {
            background: '{transparent}'         // token tabs.tabpanels.background :contentReference[oaicite:4]{index=4}
          }
        }
      }
    },
/*    select: {
      semantic: {
        colorScheme: { // Añade este nivel explícito
          light: {
            color: 'red',
            placeholderColor: 'pink',
            optionColor: 'orange'
            // Aquí podrías añadir otros tokens semánticos para 'light' si los necesitas
            // por ejemplo, backgroundColor, borderColor, etc., si fueran aplicables a 'select.semantic'
          },
          dark: {
            color: 'blue',
            placeholderColor: 'lightblue',
            optionColor: 'cyan'
            // Tokens semánticos para 'dark'
          }
        }
      }
    }*/

  }
});

export default CustomTheme;
