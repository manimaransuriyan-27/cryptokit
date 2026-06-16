import type { Context, ComponentType, ReactNode } from "react";

export interface CreateContextOptions<T> {
  name: string;
  errorMessage?: string;
  defaultValue?: T;
}

export type CreateContextReturn<T> = [
  useContext: () => T,
  Provider: ComponentType<{ value: T; children: ReactNode }>,
  Context: Context<T | undefined>,
];

export type StateContextValue<T> = [T, React.Dispatch<React.SetStateAction<T>>];

export interface CreateThemeOptions<T extends string> {
  name?: string;
  defaultTheme: T;
  storageKey?: string;
}

export type ReducerContextValue<S, A> = [S, React.Dispatch<A>];
