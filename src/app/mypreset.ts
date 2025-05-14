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
          700: '#333333',
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
    datatable:{
      colorScheme: {
        light: {
          border: {
            color: '#e0e0e0'
          },
          header: {
            background: '{transparent}',

            cell: {
              background: '{transparent}',
              hover: {
                background: '#dedfdf',
                color: '#000000'
              }
            }
          },
          body: {
            background: '{transparent}'
          },
          row: {
            background: '{transparent}',
            color: '#333333',
            hover: {
              background: '#dedfdf',
              color: '#000000'
            },
          },
        },
        dark: {
          border: {
            color: '#4a4a4a'
          },
          header: {
            background: '{transparent}',
            cell: {
              background: '{transparent}',
              hover: {
                background: '#2c2c34',
                color: '#ffffff'
              }
            }
          },
          body: {
            background: '{transparent}'
          },
          row: {
            background: '{transparent}',
            color: '#dedfdf',
            hover: {
              background: '#2c2c34',
              color: '#ffffff'
            },
          },
        }
      }
    },
    toolbar: {
      colorScheme: {
        light: {
          border: {
            color: '#e0e0e0'    // un gris medio (igual que el texto normal de fila)
          },
          background: '#dedfdf',         // token toolbar.background :contentReference[oaicite:5]{index=5}
        },
        dark: {
          border: {
            color: '#4a4a4a'    // un gris oscuro intermedio
          },
          background: '{transparent}'         // token toolbar.background :contentReference[oaicite:5]{index=5}
        }
      }
    },
    paginator: {
      colorScheme: {
        light: {
          background: '{transparent}',
          border: {
            color: '#e0e0e0'
          },
          current: {
            page: {
              report: {
                color: '#333333'
              }
            }
          },
          nav:{
            button: {
              color: '#333333',
              hover: {
                background: '#dedfdf',
                color: '#000000'
              }
            }
          }
        },
        dark: {
          background: '{transparent}',
          border: {
            color: '#4a4a4a'
          },
          current: {
            page: {
              report: {
                color: '#dedfdf'
              }
            }
          },
          nav:{
            button: {
              color: '#dedfdf',
              hover: {
                background: '#2c2c34',
                color: '#ffffff'
              }
            }
          }
        }
      }
    },
    checkbox: {
      colorScheme: {
        light: {
          border: {
            color: '#333333'
          },
          background: '{transparent}'
        },
        dark: {
          border: {
            color: '#4a4a4a'
          },
          background: '{transparent}'
        }
      }
    }

  }
});

export default CustomTheme;
