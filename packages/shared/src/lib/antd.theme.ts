import type { ThemeConfig } from 'antd';

export const themeConfig = {
  zeroRuntime: false,
  token: {
    fontFamily: 'var(--font-heading)',
    fontSize: 14,
  },
  components: {
    Notification: {
      width: 600,
      colorBgElevated: 'oklch(98.5% 0 0)',
      zIndexPopup: 1000,
    },
  },
} satisfies ThemeConfig;
