import type { FC } from 'react';
import { rootStore } from '@/stores/root.store';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryProvider } from './query.provider';
import { RootStoreProvider } from './store.provider';
import { ThemeProvider } from './theme.provider';
import { ConfigProvider } from 'antd';
import { themeConfig } from '@repo/shared/lib/antd.theme';

interface AppProviderProps {
  children: React.ReactNode;
}

const AppProvider: FC<AppProviderProps> = ({ children }) => {
  return (
    <RootStoreProvider value={rootStore}>
      <QueryProvider>
        <ThemeProvider>
          <ConfigProvider theme={themeConfig}>{children}</ConfigProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </ThemeProvider>
      </QueryProvider>
    </RootStoreProvider>
  );
};

export default AppProvider;
