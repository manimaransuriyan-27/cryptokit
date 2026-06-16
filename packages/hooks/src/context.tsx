import type {
  CreateContextOptions,
  CreateContextReturn,
  CreateThemeOptions,
  ReducerContextValue,
  StateContextValue,
} from './types';
import {
  createContext as reactCreateContext,
  useContext as reactUseContext,
  useEffect,
  useReducer,
  useState,
  type ReactNode,
  type ComponentType,
  type Context,
} from 'react';

export function createContext<T>(
  options: CreateContextOptions<T>
): CreateContextReturn<T> {
  const { name, defaultValue, errorMessage } = options;

  const Context = reactCreateContext<T | undefined>(defaultValue);
  Context.displayName = name;

  // ── Hook ──────────────────────────────────────────────────────────────────
  function useContext(): T {
    const value = reactUseContext(Context);

    if (value === undefined) {
      throw new Error(
        errorMessage ??
          `use${name} must be used within a <${name}.Provider>. ` +
            `Make sure your component is wrapped in the correct Provider.`
      );
    }

    return value;
  }

  // Give the hook a meaningful name for DevTools / stack traces
  Object.defineProperty(useContext, 'name', { value: `use${name}` });

  // ── Provider ──────────────────────────────────────────────────────────────
  function ContextProvider({
    value,
    children,
  }: {
    value: T;
    children: ReactNode;
  }) {
    return <Context.Provider value={value}>{children}</Context.Provider>;
  }

  ContextProvider.displayName = `${name}.Provider`;

  return [useContext, ContextProvider, Context];
}

export function createStateContext<T>(
  initialValue: T,
  options: Omit<CreateContextOptions<StateContextValue<T>>, 'defaultValue'>
): [
  useContext: () => StateContextValue<T>,
  Provider: ComponentType<{ children: ReactNode; initialValue?: T }>,
  Context: Context<StateContextValue<T> | undefined>,
] {
  const [useCtx, , RawContext] = createContext<StateContextValue<T>>({
    ...options,
  });

  function StateProvider({
    children,
    initialValue: overrideInitial,
  }: {
    children: ReactNode;
    initialValue?: T;
  }) {
    const state = useState<T>(overrideInitial ?? initialValue);
    return <RawContext.Provider value={state}>{children}</RawContext.Provider>;
  }

  StateProvider.displayName = `${options.name}.Provider`;

  return [useCtx, StateProvider, RawContext];
}

export function createReducerContext<S, A>(
  reducer: React.Reducer<S, A>,
  initialState: S,
  options: Omit<CreateContextOptions<ReducerContextValue<S, A>>, 'defaultValue'>
): [
  useContext: () => ReducerContextValue<S, A>,
  Provider: ComponentType<{ children: ReactNode; initialState?: S }>,
  Context: Context<ReducerContextValue<S, A> | undefined>,
] {
  const [useCtx, , RawContext] =
    createContext<ReducerContextValue<S, A>>(options);

  function ReducerProvider({
    children,
    initialState: overrideState,
  }: {
    children: ReactNode;
    initialState?: S;
  }) {
    const value = useReducer(reducer, overrideState ?? initialState);
    return <RawContext.Provider value={value}>{children}</RawContext.Provider>;
  }

  ReducerProvider.displayName = `${options.name}.Provider`;

  return [useCtx, ReducerProvider, RawContext];
}

export function createThemeContext<T extends string>({
  name = 'Theme',
  defaultTheme,
  storageKey = 'app-theme',
}: CreateThemeOptions<T>): [
  useTheme: () => StateContextValue<T>,
  ThemeProvider: ComponentType<{ children: ReactNode }>,
  Context: Context<StateContextValue<T> | undefined>,
] {
  const [useThemeContext, RawThemeProvider, RawContext] = createStateContext<T>(
    defaultTheme,
    { name }
  );

  // ── Inner component: has access to the single state via useThemeContext ──
  function ThemeSync() {
    const [theme, setTheme] = useThemeContext();

    useEffect(() => {
      localStorage.setItem(storageKey, theme);
      if (typeof window !== 'undefined') {
        const root = window.document.documentElement;
        root.setAttribute('data-theme', theme); // keep this for CSS variables
        root.classList.toggle('dark', theme === 'dark'); // THIS is what Tailwind needs
      }
    }, [theme]);

    // Cross-tab sync
    useEffect(() => {
      const handleStorage = (e: StorageEvent) => {
        if (e.key === storageKey && e.newValue) {
          setTheme(e.newValue as T);
        }
      };
      window.addEventListener('storage', handleStorage);
      return () => window.removeEventListener('storage', handleStorage);
    }, []);

    return null;
  }

  // ── Outer provider: reads localStorage once for initial value only ──
  function ThemeProvider({ children }: { children: ReactNode }) {
    const initialTheme: T =
      typeof window !== 'undefined'
        ? ((localStorage.getItem(storageKey) as T) ?? defaultTheme)
        : defaultTheme;

    return (
      <RawThemeProvider initialValue={initialTheme}>
        <ThemeSync /> {/* ← consumes & syncs the ONE state */}
        {children}
      </RawThemeProvider>
    );
  }

  ThemeProvider.displayName = `${name}.Provider`;

  return [useThemeContext, ThemeProvider, RawContext];
}
