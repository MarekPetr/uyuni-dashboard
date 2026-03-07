import { useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { CircleDotIcon, MenuIcon, XIcon } from 'lucide-react'
import { TokenSettings } from '@/components/token-settings'

export interface NavItem {
  to: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

function SidebarContent({
  navItems,
  onNavigate,
}: {
  navItems: ReadonlyArray<NavItem>
  onNavigate?: () => void
}) {
  const qc = useQueryClient()

  return (
    <>
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
            onClick={onNavigate}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground [&.active]:bg-accent [&.active]:text-accent-foreground"
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        ))}
      </nav>
      <TokenSettings onTokenChange={() => qc.invalidateQueries()} />
    </>
  )
}

export function AppSidebar({ navItems }: { navItems: ReadonlyArray<NavItem> }) {
  const [open, setOpen] = useState(false)

  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const [prevPath, setPrevPath] = useState(pathname)
  if (pathname !== prevPath) {
    setPrevPath(pathname)
    if (open) setOpen(false)
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col border-r border-border bg-card md:flex">
        <SidebarContent navItems={navItems} />
      </aside>

      {/* Mobile header */}
      <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border bg-card px-4 md:hidden">
        <button
          onClick={() => setOpen(true)}
          className="rounded-md p-1 text-muted-foreground hover:text-foreground"
        >
          <MenuIcon className="size-5" />
        </button>
        <CircleDotIcon className="size-5 text-primary" />
        <span className="text-sm font-semibold">Uyuni Dashboard</span>
      </header>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-full flex-col bg-card transition-transform duration-200 ease-in-out md:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground hover:text-foreground"
        >
          <XIcon className="size-5" />
        </button>
        <SidebarContent navItems={navItems} onNavigate={() => setOpen(false)} />
      </aside>
    </>
  )
}
