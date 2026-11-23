import { useEffect } from 'react';

const ACADEMY_BASE_TITLE = 'SK Tape Ball Academy';

export function useDocumentTitle(pageTitle?: string): void {
  useEffect(() => {
    document.title = pageTitle
      ? `${pageTitle} | ${ACADEMY_BASE_TITLE}`
      : `${ACADEMY_BASE_TITLE} — Build Your Game. Master Your Skills.`;
  }, [pageTitle]);
}
