import { useTheme } from '@/providers/theme.provider';
import { RiCoinFill } from '@remixicon/react';
import { Globe } from '@repo/shared/components/ui/globe';
import { Link, Outlet } from 'react-router-dom';
import { CopyrightIcon, X } from 'lucide-react';
import { memo } from 'react';

const AuthLayout = memo(() => {
  const [theme, setTheme] = useTheme();

  return (
    <>
      <div className="grid min-h-screen w-full grid-cols-1 bg-background text-foreground lg:grid-cols-2">
        {/* LEFT PANEL: Banner / Left Page of Book */}
        <div className="relative z-10 hidden flex-col border bg-zinc-50 p-10 pb-3 text-zinc-900 shadow lg:flex lg:rounded-r-[2.5rem] lg:border-r lg:border-white/1 lg:shadow-[10px_0_10px_-5px_rgba(0,0,0,0.03)] dark:bg-zinc-950 dark:text-zinc-50 dark:lg:shadow-[10px_0_10px_-10px_rgba(0,0,0,0.1)]">
          <div className="pointer-events-none absolute top-40 left-10 h-72 w-72 rounded-full bg-cyan-300 opacity-30 blur-[150px] dark:bg-cyan-500 dark:opacity-30" />

          {/* Logo */}
          <div className="mb-2 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <RiCoinFill
                className="size-5 cursor-pointer"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              />
            </div>
            <h1 className="font text-xl font-bold tracking-tight">
              Crypto<span className="text-primary">kit</span>
            </h1>
          </div>

          {/* Hero Content */}
          <div className="mt-12">
            <h2 className="text-4xl leading-[1.2] font-extrabold tracking-tight sm:text-5xl">
              Quick{' '}
              <span className="bg-gradient-to-r from-primary via-cyan-500 to-green-500 bg-clip-text text-transparent">
                cryptocurrency
              </span>
              <br />
              trades near you.
            </h2>
            <p className="text-md mt-6 max-w-md leading-relaxed text-slate-500 dark:text-zinc-400">
              Trade digital assets and virtual products worldwide.
            </p>
          </div>

          {/* Globe */}
          <div className="mt-5 flex flex-1 items-center justify-center">
            <div className="relative h-full w-full">
              <Globe
                config={{
                  devicePixelRatio: 2,
                  width: 500 * 2,
                  height: 500 * 2,
                  dark: theme === 'dark' ? 1 : 0.1,
                  glowColor: [1, 1.01, 1],
                  markerColor: [0.2, 0.8, 22],
                }}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="relative z-10 flex items-center justify-between text-xs font-medium tracking-wide text-slate-400 dark:text-gray-500">
            <div className="flex flex-1 gap-1">
              <CopyrightIcon className="size-3.5" /> {new Date().getFullYear()}{' '}
              Cryptokit. All rights reserved.
            </div>
            <div className="flex cursor-not-allowed uppercase">
              <Link
                to="/legal"
                className="group relative transition-colors hover:text-slate-900 dark:hover:text-white"
              >
                cryptokit legal
                <span className="absolute -bottom-1 left-0 h-[1px] w-0 bg-zinc-500 transition-all duration-300 group-hover:w-full" />
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Auth Forms / Right Page of Book */}
        <div className="/* Book spine effect: Round left corners, glassmorphic blur, and negative margin */ relative flex items-center justify-center bg-background px-6 py-12 shadow sm:px-12 lg:rounded-l-[2.5rem] lg:border-l lg:border-white/10 lg:px-16 lg:shadow-[-10px_0_30px_-5px_rgba(0,0,0,0.05)] lg:backdrop-blur-md dark:lg:shadow-[-10px_0_40px_-10px_rgba(0,0,0,0.5)]">
          <Link to="/" className="absolute top-8 right-8 z-50 mt-2 p-2">
            <X className="size-4 text-slate-400 hover:text-slate-800 dark:text-slate-50 dark:hover:text-slate-200" />
          </Link>

          <div className="z-10 mx-auto w-full">
            <Outlet />
          </div>

          <div className="pointer-events-none absolute right-10 bottom-10 h-72 w-72 rounded-full bg-cyan-300 opacity-30 blur-[150px] dark:bg-cyan-600 dark:opacity-30" />
        </div>
      </div>
    </>
  );
});

AuthLayout.displayName = 'AuthLayout';

export default AuthLayout;
