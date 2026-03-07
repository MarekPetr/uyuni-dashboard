import { Outlet, createRootRoute } from '@tanstack/react-router'
import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import {
  CircleDotIcon,
  FolderKanbanIcon,
  GitPullRequestIcon,
  LayoutDashboardIcon,
  TagIcon,
} from 'lucide-react'
import { oneDayInMs, oneMinuteInMs } from '@/lib/utils'
import { AppSidebar } from '@/components/app-sidebar'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: oneMinuteInMs,
      gcTime: oneDayInMs,
      refetchOnWindowFocus: false,
    },
  },
})

const persister = createAsyncStoragePersister({
  storage: localStorage,
})

export { queryClient }

export const Route = createRootRoute({
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
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister, maxAge: oneDayInMs }}
    >
      <AppShell />
    </PersistQueryClientProvider>
  )
}

function AppShell() {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <AppSidebar navItems={navItems} />
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  )
}
