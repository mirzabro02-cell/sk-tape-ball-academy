import { NavLink, Outlet } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import { ADMIN_NAV_ITEMS } from '@/src/data/navigation';
import { ACADEMY_BRAND } from '@/src/data/brand';
import { Button } from '@/src/components/ui/Button';
import { OfficialLogo } from '@/src/components/ui/OfficialLogo';
import { cn } from '@/src/utils/cn';
import { PageContainer } from './PageContainer';

export function AdminLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA] text-[#071A36]">
      <header className="sticky top-0 z-30 h-[72px] border-b border-white/10 bg-[#050D1B] text-white">
        <PageContainer className="flex h-full items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <OfficialLogo tone="dark" to="/admin" />
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-[#D9A52E]">
              <Shield className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Admin Route Shell (Placeholder)</span>
            </span>
          </div>

          <Button to="/" variant="outlineLight" size="sm">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Public Site</span>
          </Button>
        </PageContainer>
      </header>

      <PageContainer className="flex-1 py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-4">
              <p className="px-3 text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                Admin Routes
              </p>
              <nav aria-label="Admin Placeholder Navigation" className="mt-3 flex flex-col gap-1">
                {ADMIN_NAV_ITEMS.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/admin'}
                    className={({ isActive }) =>
                      cn(
                        'rounded-[10px] px-3 py-2.5 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-[#071A36] text-white font-semibold'
                          : 'text-[#071A36] hover:bg-[#F5F7FA]',
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </div>
          </aside>

          <main className="lg:col-span-9">
            <Outlet />
          </main>
        </div>
      </PageContainer>

      <footer className="border-t border-[#E2E8F0] bg-white py-4 text-center text-xs text-[#64748B]">
        {ACADEMY_BRAND.name} · Admin Foundation Placeholder (Authentication &amp; Dashboard Pending Later Part)
      </footer>
    </div>
  );
}
