import { useLocation, type Location } from 'react-router-dom';

export function useTypedLocation<T>() {
  return useLocation() as Omit<Location, 'state'> & {
    state: T;
  };
}
