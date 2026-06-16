import Spinner4 from '@repo/shared/components/spinner4';
import { RouterProvider } from 'react-router-dom';
import { useSession } from './hooks/queries/auth-session';
import { createAppRouter } from './routes/app.route';
import { observer } from 'mobx-react-lite';

const App = observer(() => {
  
  const { isInitialized } = useSession();

  if (!isInitialized)
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
        <Spinner4 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );

  return <RouterProvider router={createAppRouter} />;
});

export default App;
