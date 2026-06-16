import { useLogout } from '@/hooks/mutations/auth/use-logout';
import { Button } from '@repo/shared/components/ui/button';
import {
  ArrowUpRight,
  BarChart3,
  LayoutDashboard,
  Settings,
  Users,
} from 'lucide-react';

export default function DashboardPage() {
  // Mock data for quick metrics to make it look like a real app immediately
  const simpleStats = [
    {
      label: 'Active Projects',
      value: '12',
      icon: LayoutDashboard,
      color: 'text-blue-500 bg-blue-500/10',
    },
    {
      label: 'Team Members',
      value: '8',
      icon: Users,
      color: 'text-emerald-500 bg-emerald-500/10',
    },
    {
      label: 'Performance',
      value: '98.4%',
      icon: BarChart3,
      color: 'text-indigo-500 bg-indigo-500/10',
    },
  ];

  const { isLoggingOut, onLogout } = useLogout();

  return (
    <div className="min-h-screen animate-in bg-muted/30 p-8 duration-700 ease-out fade-in slide-in-from-bottom-4 md:p-10">
      {/* Upper Layout: Header Panel */}
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col gap-4 border-b border-border/60 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
                Welcome Back!
              </h1>
              <span className="inline-flex animate-bounce items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 [animation-duration:3s] dark:text-emerald-400">
                Flow Success 🎉
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Your session is securely verified. Here is a glance at your
              workspace workspace today.
            </p>
          </div>

          <button className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98]">
            <span>Launch Console</span>
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </header>

        {/* Middle Layout: Metrics Grid */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {simpleStats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                style={{ animationDelay: `${(i + 1) * 100}ms` }}
                className="fill-mode-backward relative animate-in overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all duration-500 fade-in slide-in-from-bottom-2 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </span>
                  <div className={`rounded-lg p-2 ${stat.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-3xl font-bold tracking-tight text-foreground">
                    {stat.value}
                  </span>
                </div>
              </div>
            );
          })}
        </section>

        {/* Bottom Layout: Placeholder Interactive Workspace Card */}
        <main className="rounded-xl border border-dashed border-border bg-card/50 p-12 text-center shadow-inner">
          <div className="mx-auto flex max-w-sm flex-col items-center justify-center">
            <div className="rounded-full border bg-background p-4 shadow-sm">
              <Settings className="h-6 w-6 animate-spin text-muted-foreground [animation-duration:12s]" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              Workspace ready for deployment
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Everything is provisioned. You can modify your initial workspace
              variables inside account settings anytime.
            </p>
          </div>
        </main>
        <div>
          <Button onClick={() => onLogout()} disabled={isLoggingOut}>
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </Button>
        </div>
      </div>
    </div>
  );
}
