import { useNavigate } from 'react-router-dom';

export function useTypedNavigate<T>() {
  const navigate = useNavigate();

  return (
    to: string,
    options?: {
      replace?: boolean;
      state?: T;
    }
  ) => {
    navigate(to, options);
  };
}
