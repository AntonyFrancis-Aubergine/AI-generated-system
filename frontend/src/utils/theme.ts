import { extendTheme, ThemeConfig } from '@chakra-ui/react'

// Color mode config
const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

// Extend the theme
const theme = extendTheme({
  config,
  colors: {
    brand: {
      50: '#e6f7ff',
      100: '#c8eafe',
      200: '#9ad5fa',
      300: '#66bbf4',
      400: '#3b9eeb',
      500: '#1a73e8', // primary color - royal blue
      600: '#1259c3',
      700: '#0d429c',
      800: '#082e70',
      900: '#051d49',
    },
    accent: {
      50: '#ffeaef',
      100: '#ffd0db',
      200: '#ffa3b5',
      300: '#ff6d8c',
      400: '#ff486a',
      500: '#ff2d54', // accent color - vibrant coral
      600: '#e6113a',
      700: '#c10030',
      800: '#99002a',
      900: '#660018',
    },
    success: {
      50: '#e8f8f3',
      100: '#c9f0e4',
      200: '#95e1cc',
      300: '#5dcea4',
      400: '#30b680',
      500: '#16a75c', // success color - emerald green
      600: '#0c8a4a',
      700: '#096e3b',
      800: '#05522c',
      900: '#033b1e',
    },
    neutral: {
      50: '#f4f7fa',
      100: '#e9edf2',
      200: '#d3d9e4',
      300: '#b7c1d1',
      400: '#96a2b8',
      500: '#738096',
      600: '#5a667a',
      700: '#444d5c',
      800: '#2e343f',
      900: '#191d24',
    },
  },
  fonts: {
    heading: '"Poppins", system-ui, sans-serif',
    body: '"Inter", system-ui, sans-serif',
  },
  styles: {
    global: (props: any) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.900' : 'gray.50',
        color: props.colorMode === 'dark' ? 'white' : 'gray.800',
      },
    }),
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: '600',
        borderRadius: 'lg',
        _focus: {
          boxShadow: 'outline',
        },
      },
      variants: {
        solid: {
          bg: 'brand.500',
          color: 'white',
          _hover: {
            bg: 'brand.600',
            _disabled: {
              bg: 'brand.500',
            },
          },
          _active: { bg: 'brand.700' },
        },
        outline: {
          borderColor: 'brand.500',
          color: 'brand.500',
          _hover: {
            bg: 'brand.50',
          },
        },
        ghost: {
          color: 'neutral.600',
          _hover: {
            bg: 'neutral.100',
            color: 'brand.500',
          },
          _active: {
            bg: 'neutral.200',
          },
        },
        link: {
          color: 'brand.500',
          _hover: {
            textDecoration: 'underline',
            color: 'brand.600',
          },
        },
        gradient: {
          bgGradient: 'linear(to-r, brand.500, accent.500)',
          color: 'white',
          _hover: {
            bgGradient: 'linear(to-r, brand.600, accent.600)',
            _disabled: {
              bgGradient: 'linear(to-r, brand.500, accent.500)',
            },
          },
          _active: {
            bgGradient: 'linear(to-r, brand.700, accent.700)',
          },
        },
        success: {
          bg: 'success.500',
          color: 'white',
          _hover: {
            bg: 'success.600',
          },
          _active: {
            bg: 'success.700',
          },
        },
      },
      defaultProps: {
        colorScheme: 'brand',
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: 'xl',
          overflow: 'hidden',
          boxShadow: 'lg',
          transition: 'all 0.3s ease',
          _hover: {
            transform: 'translateY(-5px)',
            boxShadow: 'xl',
          },
        },
        header: {
          padding: '6',
        },
        body: {
          padding: '6',
        },
        footer: {
          padding: '6',
        },
      },
    },
    Heading: {
      baseStyle: {
        fontWeight: '700',
        lineHeight: '1.2',
      },
    },
    Badge: {
      baseStyle: {
        borderRadius: 'full',
        textTransform: 'capitalize',
        fontWeight: '500',
      },
    },
    Container: {
      baseStyle: {
        maxW: '1200px',
      },
    },
    Link: {
      baseStyle: {
        _hover: {
          textDecoration: 'none',
        },
      },
      variants: {
        navLink: {
          fontWeight: '500',
          position: 'relative',
          _after: {
            content: '""',
            position: 'absolute',
            bottom: '-2px',
            left: '0',
            right: '0',
            height: '2px',
            bg: 'brand.500',
            transform: 'scaleX(0)',
            transformOrigin: 'bottom right',
            transition: 'transform 0.3s',
          },
          _hover: {
            color: 'brand.500',
            _after: {
              transform: 'scaleX(1)',
              transformOrigin: 'bottom left',
            },
          },
        },
      },
    },
    Menu: {
      baseStyle: {
        list: {
          boxShadow: 'lg',
          borderWidth: '1px',
          borderColor: 'gray.100',
        },
        item: {
          _focus: {
            bg: 'brand.50',
          },
          _active: {
            bg: 'brand.50',
          },
        },
      },
    },
  },
  layerStyles: {
    gradientBg: {
      bgGradient: 'linear(to-r, brand.500, accent.500)',
      color: 'white',
    },
    cardHover: {
      transition: 'all 0.3s ease',
      _hover: {
        transform: 'translateY(-8px)',
        boxShadow: 'xl',
      },
    },
    boxShadow: {
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
    },
  },
  textStyles: {
    h1: {
      fontSize: ['4xl', '5xl'],
      fontWeight: 'bold',
      lineHeight: '110%',
      letterSpacing: '-1%',
    },
    h2: {
      fontSize: ['3xl', '4xl'],
      fontWeight: 'semibold',
      lineHeight: '110%',
      letterSpacing: '-1%',
    },
    h3: {
      fontSize: ['2xl', '3xl'],
      fontWeight: 'medium',
      lineHeight: '110%',
      letterSpacing: '-1%',
    },
    subtitle: {
      fontSize: ['xl', '2xl'],
      fontWeight: 'light',
      lineHeight: '110%',
      letterSpacing: '-0.5%',
    },
  },
})

export default theme
