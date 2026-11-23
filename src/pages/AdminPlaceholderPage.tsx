import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';

export interface AdminPlaceholderPageProps {
  title: string;
  routePath: string;
  description: string;
}

export function AdminPlaceholderPage({
  title,
  routePath,
  description,
}: AdminPlaceholderPageProps) {
  useDocumentTitle(`Admin · ${title}`);

  return (
    <div className="space-y-6">
      <Card tone="navy" padding="lg">
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#D9A52E]">
          <span>Admin Route Placeholder</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono text-white/80">{routePath}</span>
        </div>
        <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-white">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/80">
          {description}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button to="/" variant="primary" size="sm">
            Return to Public Site
          </Button>
          <Button to="/admin" variant="outlineLight" size="sm">
            Admin Root
          </Button>
        </div>
      </Card>

      <Card padding="lg">
        <h2 className="text-base font-bold text-[#071A36]">Part 1 Scope Boundary</h2>
        <p className="mt-2 text-sm leading-relaxed text-[#64748B]">
          Per Part 1 instructions, the admin dashboard, tables, and Supabase-protected CRUD operations are not built yet. This route establishes the <span className="font-mono text-[#071A36]">/admin</span> layout shell and URL contract for future parts.
        </p>
      </Card>
    </div>
  );
}
