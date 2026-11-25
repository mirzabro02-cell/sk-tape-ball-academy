import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import { PlaceholderNotice } from '@/src/components/ui/PlaceholderNotice';

export interface AcademyPlaceholderPageProps {
  title: string;
  routePath: string;
  sectionLabel: string;
  description: string;
  plannedModules: string[];
}

export function AcademyPlaceholderPage({
  title,
  routePath,
  sectionLabel,
  description,
  plannedModules,
}: AcademyPlaceholderPageProps) {
  useDocumentTitle(title);

  return (
    <PlaceholderNotice
      routePath={routePath}
      sectionLabel={sectionLabel}
      title={title}
      description={description}
      plannedModules={plannedModules}
    />
  );
}
