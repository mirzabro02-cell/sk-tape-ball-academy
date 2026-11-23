import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';

export function NotFoundPage() {
  useDocumentTitle('Page Not Found');

  return (
    <Card className="mx-auto max-w-xl text-center" padding="lg">
      <p className="text-xs font-semibold uppercase tracking-wider text-[#C8202B]">
        404 · Route Not Found
      </p>
      <h1 className="mt-2 text-3xl font-bold text-[#071A36]">
        Page Not Available
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-[#64748B]">
        The requested path is not configured in SK Tape Ball Academy routes. Use the navigation bar or return to the foundation homepage.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Button to="/" variant="primary">
          Back to Home
        </Button>
        <Button to="/contact" variant="outline">
          Contact Page
        </Button>
      </div>
    </Card>
  );
}
