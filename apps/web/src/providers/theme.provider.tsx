import { createThemeContext } from '@repo/hooks';

export type Theme = 'light' | 'dark' | 'system';

export const [useTheme, ThemeProvider] = createThemeContext<Theme>({
  name: 'ThemeContext',
  defaultTheme: 'light',
  storageKey: 'theme',
});
