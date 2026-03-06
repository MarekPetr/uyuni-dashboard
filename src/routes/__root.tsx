import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  CircleDotIcon,
  FolderKanbanIcon,
  GitPullRequestIcon,
  LayoutDashboardIcon,
  TagIcon,
} from 'lucide-react'

import appCss from '../styles.css?url'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export { queryClient }

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Uyuni Dashboard',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
  component: RootComponent,
})

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboardIcon },
  { to: '/issues', label: 'Issues', icon: CircleDotIcon },
  { to: '/pulls', label: 'Pull Requests', icon: GitPullRequestIcon },
  { to: '/labels', label: 'Labels', icon: TagIcon },
  { to: '/projects', label: 'Projects', icon: FolderKanbanIcon },
] as const

function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen">
        <aside className="sticky top-0 flex h-screen w-56 shrink-0 flex-col border-r border-border bg-card">
          <div className="flex h-14 items-center gap-2 border-b border-border px-4">
            <CircleDotIcon className="size-5 text-primary" />
            <span className="text-sm font-semibold">Uyuni Dashboard</span>
          </div>
          <nav className="flex flex-1 flex-col gap-1 p-2">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === '/' }}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground [&.active]:bg-accent [&.active]:text-accent-foreground"
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </QueryClientProvider>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
