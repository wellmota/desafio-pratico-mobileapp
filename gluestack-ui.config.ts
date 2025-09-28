import { createConfig } from '@gluestack-ui/themed';

export const config = createConfig({
  aliases: {
    bg: 'backgroundColor',
    bgColor: 'backgroundColor',
    rounded: 'borderRadius',
  },
  tokens: {
    colors: {
      // Orange colors
      orangeBase: '#F24D0D',
      orangeDark: '#C43C08',
      
      // Blue colors
      blueLight: '#D7EFF9',
      blueBase: '#5EC5FD',
      blueDark: '#009CF0',
      
      // Shape colors
      white: '#FFFFFF',
      background: '#FBF4F4',
      shape: '#F5EAEA',
      
      // Grayscale colors
      gray100: '#ADADAD',
      gray200: '#949494',
      gray300: '#666666',
      gray400: '#3D3D3D',
      gray500: '#1D1D1D',
      
      // Semantic colors
      danger: '#DC3545',
      success: '#28A745',
    },
    space: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      '2xl': 48,
      '3xl': 64,
    },
    radii: {
      xs: 4,
      sm: 8,
      md: 12,
      lg: 16,
      xl: 20,
      '2xl': 24,
    },
    fontSizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 28,
      '4xl': 32,
    },
  },
  globalStyle: {
    variants: {
      hardShadow: {
        '1': {
          shadowColor: '$gray500',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.22,
          shadowRadius: 2.22,
          elevation: 3,
        },
        '2': {
          shadowColor: '$gray500',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        },
        '3': {
          shadowColor: '$gray500',
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.30,
          shadowRadius: 4.65,
          elevation: 8,
        },
      },
    },
  },
});

type Config = typeof config;

declare module '@gluestack-ui/themed' {
  interface ICustomConfig extends Config {}
}
