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
      50: '#e6f7f5',
      100: '#cceee9',
      200: '#99ddd3',
      300: '#66cdbd',
      400: '#33bca7',
      500: '#00ab91', // primary color
      600: '#008973',
      700: '#006756',
      800: '#004438',
      900: '#00221c',
    },
  },
  fonts: {
    heading: 'Inter, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'semibold',
      },
      defaultProps: {
        colorScheme: 'teal',
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: 'lg',
          overflow: 'hidden',
          boxShadow: 'sm',
        },
      },
    },
  },
})

export default theme
